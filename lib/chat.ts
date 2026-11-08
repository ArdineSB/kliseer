import { sql } from './db';
import { llm, LLM_MODEL } from './llm';
import { cleanFields, FIELDS, type FieldValue, type Section } from './fields';
import { getSeller, saveSection } from './seller';

export const TABS = ['home', 'klise', 'target', 'seer', 'signals', 'competitors', 'contacts', 'profiling', 'icp'] as const;
export type Tab = (typeof TABS)[number];
export type ChatMessage = { id: number; tab: Tab; role: 'user' | 'assistant'; content: string; created_at: string };

/** Setup tabs that write drafts into a seller section (D-19). */
const SECTION_OF: Partial<Record<Tab, Section>> = { klise: 'company', icp: 'icp', target: 'target' };

export async function thread(sellerId: number, tab: Tab, limit = 50) {
  const rows = await sql<ChatMessage[]>`
    select id, tab, role, content, created_at from chat_messages
    where seller_id = ${sellerId} and tab = ${tab} order by id desc limit ${limit}`;
  return rows.reverse();
}

/** Latest message per tab, for Home history. */
export async function threadHeads(sellerId: number) {
  return sql<ChatMessage[]>`
    select distinct on (tab) id, tab, role, content, created_at from chat_messages
    where seller_id = ${sellerId} order by tab, id desc`;
}

function systemPrompt(tab: Tab, section: Section | undefined, current: Record<string, FieldValue> | undefined) {
  const base = 'You are Klise, the assistant inside Kliseer, a sales prospecting tool for US building-construction sellers. Answer in English, briefly. Never invent companies, signals, dates, scores or contacts.';
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
export async function sendMessage(sellerId: number, tab: Tab, message: string) {
  // Retry after an LLM failure resends the same text; reuse the stored message instead of duplicating it.
  const [last] = await sql<ChatMessage[]>`
    select id, tab, role, content, created_at from chat_messages
    where seller_id = ${sellerId} and tab = ${tab} order by id desc limit 1`;
  const userMsg = last?.role === 'user' && last.content === message ? last : (await sql<ChatMessage[]>`
    insert into chat_messages (seller_id, tab, role, content) values (${sellerId}, ${tab}, 'user', ${message})
    returning id, tab, role, content, created_at`)[0];
  const section = SECTION_OF[tab];
  const seller = section ? await getSeller(sellerId) : undefined;
  const history = (await thread(sellerId, tab, 20)).filter((m) => m.id !== userMsg.id);

  let content: string;
  try {
    if (!process.env.LLM_API_KEY || !LLM_MODEL) throw new Error('LLM not configured');
    const res = await llm.chat.completions.create({
      model: LLM_MODEL,
      temperature: 0.2,
      messages: [
        { role: 'system', content: systemPrompt(tab, section, seller?.[section!]) },
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: message },
      ],
    });
    content = res.choices[0]?.message?.content ?? '';
  } catch (e) {
    console.error('LLM error:', (e as Error).message);
    throw new LlmUnavailable('LLM unavailable');
  }

  const { reply, drafts } = parseReply(content);
  const [assistantMsg] = await sql<ChatMessage[]>`
    insert into chat_messages (seller_id, tab, role, content) values (${sellerId}, ${tab}, 'assistant', ${reply})
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
