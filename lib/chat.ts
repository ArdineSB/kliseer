import { answerWorkspaceQuestion, formatWorkspaceContext, type WorkspaceSnapshot } from './chat-workspace';
import { listContacts } from './contacts';
import { TOP, listProspects } from './prospects';
import { sql } from './db';
import { llm, LLM_MODEL } from './llm';
import { cleanFields, FIELDS, type FieldValue, type Section } from './fields';
import { getSeller, saveSection } from './seller';

export const TABS = ['home', 'klise', 'target', 'seer', 'signals', 'competitors', 'contacts', 'profiling', 'icp'] as const;
export type Tab = (typeof TABS)[number];
export type ChatMessage = { id: number; tab: Tab; role: 'user' | 'assistant'; content: string; created_at: string };

/** Setup tabs that write drafts into a seller section (D-19). */
const SECTION_OF: Partial<Record<Tab, Section>> = { klise: 'company', icp: 'icp', target: 'target' };

export type ChatThreadSummary = { id: string; tab: Tab; title: string; lastMessageId: number; lastMessage: string; updatedAt: string };

export async function createThread(sellerId: number, tab: Tab, isDefault = false) {
  const [created] = await sql<{ id: string }[]>`
    insert into chat_threads (seller_id, tab, is_default) values (${sellerId}, ${tab}, ${isDefault})
    returning id`;
  return created.id;
}

export async function defaultThread(sellerId: number, tab: Tab) {
  const [created] = await sql<{ id: string }[]>`
    insert into chat_threads (seller_id, tab, is_default) values (${sellerId}, ${tab}, true)
    on conflict (seller_id, tab) where is_default do nothing returning id`;
  if (created) return created.id;
  const [existing] = await sql<{ id: string }[]>`select id from chat_threads where seller_id = ${sellerId} and tab = ${tab} and is_default`;
  return existing.id;
}

export async function ownedThread(sellerId: number, tab: Tab, id: string) {
  const [row] = await sql<{ id: string }[]>`select id from chat_threads where id = ${id} and seller_id = ${sellerId} and tab = ${tab}`;
  return row?.id ?? null;
}

export async function thread(sellerId: number, tab: Tab, threadId: string, limit = 50) {
  const rows = await sql<ChatMessage[]>`
    select id, tab, role, content, created_at from chat_messages
    where seller_id = ${sellerId} and tab = ${tab} and thread_id = ${threadId}
    order by id desc limit ${limit}`;
  return rows.reverse();
}

/** Messages grouped as conversations for Home history. */
export async function threadHeads(sellerId: number): Promise<ChatThreadSummary[]> {
  return sql<ChatThreadSummary[]>`
    select t.id, t.tab, t.title, latest.id as "lastMessageId", latest.content as "lastMessage", t.updated_at as "updatedAt"
    from chat_threads t
    join lateral (select id, content from chat_messages where thread_id = t.id order by id desc limit 1) latest on true
    where t.seller_id = ${sellerId}
    order by t.updated_at desc`;
}

async function workspaceSnapshot(sellerId: number): Promise<WorkspaceSnapshot> {
  const [seller, prospects, contactRows] = await Promise.all([
    getSeller(sellerId),
    listProspects(sellerId, { page: 1 }),
    listContacts(sellerId, { limit: 100 }),
  ]);
  const contacts = contactRows.items.map((c) => ({
    name: c.name, company: c.company, title: c.title, email: c.email, phone: c.phone, sourceUrl: c.sourceUrl,
  }));
  const contactsByCompany = new Map<number, typeof contacts>();
  for (const c of contactRows.items) {
    const group = contactsByCompany.get(c.companyId) ?? [];
    group.push({ name: c.name, company: c.company, title: c.title, email: c.email, phone: c.phone, sourceUrl: c.sourceUrl });
    contactsByCompany.set(c.companyId, group);
  }
  return {
    candidateTotal: prospects.summary.total,
    candidates: prospects.items.slice(0, TOP).map((p) => ({
      id: p.id, name: p.name, state: p.state, tier: p.tier, score: p.score, signals: p.signals,
      recent: p.recent, matched: p.matched, lastDate: p.lastDate, lastSummary: p.lastSummary,
      contacts: (contactsByCompany.get(p.id) ?? []).map(({ name, title, email, phone }) => ({ name, title, email, phone })),
    })),
    contactsTotal: contactRows.total,
    contacts,
    contactsTruncated: contactRows.total > contactRows.items.length,
    workspaceProfile: { company: seller.company, icp: seller.icp, target: seller.target },
  };
}

function systemPrompt(section: Section | undefined, current: Record<string, FieldValue> | undefined, snapshot: WorkspaceSnapshot) {
  const base = `You are Klise, the assistant inside Kliseer, a sales prospecting tool for US building-construction sellers. Answer in English, briefly. Never invent companies, signals, dates, scores or contacts.
The user's workspace snapshot below is current, read-only data from the database. You can see the supplied prospects and sourced contact records: never claim you cannot access, find, or list them. For prospect comparisons and recommendations, use the supplied Seer score, tier, dated signal and contact facts. A match score is not buying intent. A prospect absent from the supplied top candidates is not proven to have no contact. Missing contact fields must stay missing; never infer an email, phone, person, title or source.
If the contact list is truncated, say how many records are included and that the Contacts page has the complete searchable list. Use only the JSON records below as current workspace facts.\nWorkspace snapshot: ${formatWorkspaceContext(snapshot)}`;
  if (!section) return `${base}\nReply with JSON only: {"reply": string, "drafts": {}}`;
  const fields = FIELDS[section].map((f) => `- ${f.key} (${f.label}; ${f.list ? 'array of strings' : 'string'}): current ${JSON.stringify(current?.[f.key] ?? (f.list ? [] : ''))}`).join('\n');
  return `${base}
You help the seller fill the "${section}" section of their profile. Fields:
${fields}
Reply with JSON only: {"reply": string, "drafts": {field: value}}.
Put in "drafts" only fields the user stated in this message, with the full new value (for arrays: the complete list). Do not guess missing fields; ask for them in "reply".`;
}

function parseReply(content: string): { reply: string; drafts: Record<string, unknown> } {
  const m = content.match(/\{[\s\S]*\}/);
  if (m) {
    try {
      const j: unknown = JSON.parse(m[0]);
      if (j && typeof j === 'object' && 'reply' in j && typeof j.reply === 'string') {
        const drafts = 'drafts' in j && j.drafts && typeof j.drafts === 'object' && !Array.isArray(j.drafts) ? (j.drafts as Record<string, unknown>) : {};
        return { reply: j.reply, drafts };
      }
    } catch { /* fall through to raw content */ }
  }
  return { reply: content.trim(), drafts: {} };
}

export class LlmUnavailable extends Error {}

/**
 * Store the user message first (kept even if the LLM fails), call the LLM, store the reply,
 * and write valid drafts into the seller section with status draft and a "From chat" source.
 */
export async function sendMessage(sellerId: number, tab: Tab, threadId: string, message: string) {
  if (!await ownedThread(sellerId, tab, threadId)) throw new Error('Chat thread not found.');
  // Retry after an LLM failure reuses the stored user message instead of duplicating it.
  const [last] = await sql<ChatMessage[]>`
    select id, tab, role, content, created_at from chat_messages
    where seller_id = ${sellerId} and tab = ${tab} and thread_id = ${threadId} order by id desc limit 1`;
  const userMsg = last?.role === 'user' && last.content === message ? last : (await sql<ChatMessage[]>`
    insert into chat_messages (seller_id, tab, thread_id, role, content)
    values (${sellerId}, ${tab}, ${threadId}, 'user', ${message})
    returning id, tab, role, content, created_at`)[0];
  await sql`update chat_threads set title = case when title = '' then left(${message}, 90) else title end, updated_at = now() where id = ${threadId} and seller_id = ${sellerId}`;

  const section = SECTION_OF[tab];
  const [seller, snapshot] = await Promise.all([
    section ? getSeller(sellerId) : Promise.resolve(undefined),
    workspaceSnapshot(sellerId),
  ]);
  const directReply = answerWorkspaceQuestion(message, snapshot);
  const history = (await thread(sellerId, tab, threadId, 20)).filter((m) => m.id !== userMsg.id);

  let content: string;
  if (directReply !== null) {
    content = JSON.stringify({ reply: directReply, drafts: {} });
  } else {
    try {
      if (!process.env.LLM_API_KEY || !LLM_MODEL) throw new Error('LLM not configured');
      const res = await llm.chat.completions.create({
        model: LLM_MODEL,
        temperature: 0.2,
        messages: [
          { role: 'system', content: systemPrompt(section, seller?.[section!], snapshot) },
          ...history.map((m) => ({ role: m.role, content: m.content })),
          { role: 'user', content: message },
        ],
      });
      content = res.choices[0]?.message?.content ?? '';
    } catch (e) {
      console.error('LLM error:', (e as Error).message);
      throw new LlmUnavailable('LLM unavailable');
    }
  }

  const { reply, drafts } = parseReply(content);
  const [assistantMsg] = await sql<ChatMessage[]>`
    insert into chat_messages (seller_id, tab, thread_id, role, content)
    values (${sellerId}, ${tab}, ${threadId}, 'assistant', ${reply})
    returning id, tab, role, content, created_at`;

  let applied: Record<string, FieldValue> = {};
  if (section && Object.keys(drafts).length) {
    // Keep only known, valid fields; the model's output is untrusted.
    const known = Object.fromEntries(Object.entries(drafts).filter(([k]) => FIELDS[section].some((f) => f.key === k)));
    const clean = cleanFields(section, known);
    if (clean.ok && Object.keys(clean.value).length) {
      await saveSection(sellerId, section, clean.value, false, assistantMsg.id);
      applied = clean.value;
    }
  }
  return { user: userMsg, assistant: assistantMsg, drafts: applied };
}
