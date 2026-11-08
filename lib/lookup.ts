import { LlmUnavailable } from './chat';
import { cleanContact, type ContactInput } from './contact-fields';
import { llm, LLM_MODEL } from './llm';

/**
 * Contact auto-lookup (KLISEER_BUILD_PLAN_2.md): free path only —
 * DuckDuckGo HTML results read through r.jina.ai, then LLM extraction.
 * No SerpAPI, no Hunter at runtime (C0/Q16). Every contact keeps a real sourceUrl.
 * Search snippets are quoted text from the result page, so a contact found in a snippet
 * still cites the page DuckDuckGo quotes (provenance Q18). Directories often block
 * crawlers (CAPTCHA), so snippets carry most of the signal.
 */
export const LOOKUP_LIMIT = 5;
const PAGE_TIMEOUT = 25_000;
const JINA_RETRIES = 3;

export class LookupUnavailable extends Error {}

/** Read a URL as plain text/markdown via the free Jina Reader proxy; r.jina.ai rate-limits cold callers. */
async function jina(url: string): Promise<string> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`https://r.jina.ai/${url}`, { signal: AbortSignal.timeout(PAGE_TIMEOUT) }).catch((e: Error) => e);
    if (res instanceof Response && res.ok) return await res.text().catch(() => '');
    // 429 from r.jina.ai without a key: wait and retry; other failures give up.
    if (!(res instanceof Response) || res.status !== 429) return '';
    if (attempt >= JINA_RETRIES) return '';
    const { promise, resolve } = Promise.withResolvers<void>();
    setTimeout(resolve, 2000 * attempt);
    await promise;
  }
}


/** Strip DuckDuckGo's `&rut=` tracking suffix (it lands inside the path, not the query).
 * Kept as a named helper: non-obvious format detail used at two call sites. */
const normalize = (u: string) => u.replace(/&rut=[0-9a-f]+\b.*$/, '').replace(/\/$/, '');

type Hit = { url: string; text: string };

/** Parse DuckDuckGo HTML (via Jina) into result entries: page URL + its snippet block. */
async function searchHits(query: string): Promise<Hit[]> {
  const text = await jina(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`);
  if (!text) return [];
  const hits: Hit[] = [];
  const seen = new Set<string>();
  // Split on result headings; each block belongs to the last seen result URL.
  const parts = text.split(/^## /m);
  let current: Hit | null = null;
  const push = () => { if (current && current.text.trim() && !seen.has(current.url)) { seen.add(current.url); hits.push(current); } };
  for (const part of parts) {
    const link = [...part.matchAll(/]\(https:\/\/duckduckgo\.com\/l\/\?uddg=([^)\s]+)/g)]
      .map((m) => { try { return normalize(decodeURIComponent(m[1])); } catch { return null; } })
      .find((u): u is string => Boolean(u));
    if (link) {
      push();
      current = { url: link, text: part.replace(/\[|\]|\(https:\/\/duckduckgo\.com[^\)]*\)/g, ' ').slice(0, 1500) };
    } else if (current) {
      current.text += '\n' + part.slice(0, 500);
    }
  }
  push();
  return hits.slice(0, 6);
}

/** Search a company's public contacts: name, title, email, phone, with the page each came from. */
export async function lookupContacts(companyName: string, state: string | null): Promise<{ contacts: ContactInput[]; note: string }> {
  const queries = [`${companyName} ${state ?? ''} contact email phone`.trim(), `${companyName} linkedin`];
  const byUrl = new Map<string, string>();
  for (const q of queries) {
    for (const hit of await searchHits(q)) {
      if (!byUrl.has(hit.url)) byUrl.set(hit.url, hit.text);
      if (byUrl.size >= 8) break;
    }
    if (byUrl.size >= 8) break;
  }
  // Fetch full pages for the top hits in parallel; richer than snippets when they load.
  const top = [...byUrl.keys()].slice(0, 3);
  await Promise.all(top.map(async (url) => {
    const text = await jina(url);
    if (text && !/security check|just a moment|captcha/i.test(text.slice(0, 500))) byUrl.set(url, byUrl.get(url) + '\n' + text.slice(0, 8000));
  }));
  const pages = [...byUrl.entries()].map(([url, text]) => ({ url, text }));
  if (!pages.length) return { contacts: [], note: 'No public pages found.' };

  if (!process.env.LLM_API_KEY || !LLM_MODEL) throw new LlmUnavailable('LLM unavailable');
  let raw: string;
  try {
    const res = await llm.chat.completions.create({
      model: LLM_MODEL,
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: `You extract public business contacts from web-search result pages for a US construction sales tool. Reply JSON only: {"contacts":[{"name","title","email","phone","linkedinUrl","website","sourceUrl"}]}.
Rules: use ONLY text that appears in the given page content (each page has its own sourceUrl). name = a person's full name, or the company contact as printed. Skip generic names ("Contact us", "Owner", "Webmaster", "Admin"). Copy emails/phones/URLs exactly as printed. Every contact MUST set sourceUrl to the page its data came from. Return at most ${LOOKUP_LIMIT} contacts. If none, return {"contacts":[]}.`,
        },
        {
          role: 'user',
          content: JSON.stringify({ company: companyName, pages }),
        },
      ],
    });
    raw = res.choices[0]?.message?.content ?? '';
  } catch (e) {
    console.error('LLM error:', (e as Error).message);
    throw new LlmUnavailable('LLM unavailable');
  }
  const m = raw.match(/\{[\s\S]*\}/);
  let rows: unknown[] = [];
  if (m) {
    try {
      const j = JSON.parse(m[0]) as { contacts?: unknown };
      if (Array.isArray(j.contacts)) rows = j.contacts;
    } catch { /* fall through: empty */ }
  }
  const companyHint = companyName.split(/\s+/).slice(0, 2).join(' ').toLowerCase();
  const urls = new Set(pages.map((p) => p.url));

  const contacts: ContactInput[] = [];
  for (const row of rows.slice(0, LOOKUP_LIMIT)) {
    if (!row || typeof row !== 'object') continue;
    const r = row as Record<string, unknown>;
    const name = typeof r.name === 'string' ? r.name.trim() : '';
    const sourceUrl = typeof r.sourceUrl === 'string' ? normalize(r.sourceUrl.trim()) : '';
    // Provenance: sourceUrl must be one of the pages we actually read; name must not be generic junk.
    const generic = /^(owner|contact|admin|webmaster|info|office|manager|sales|support)$/i.test(name);
    if (!name || generic || !urls.has(sourceUrl)) continue;
    // companyId=1 is a validation placeholder; the API route overwrites it with the real company id.
    const clean = cleanContact({
      companyId: 1, name, title: r.title, email: r.email, phone: r.phone,
      linkedinUrl: r.linkedinUrl, website: r.website, socialUrl: r.socialUrl, sourceUrl,
    });
    // Only rows that actually carry a contact detail; never a bare name.
    if (!clean.ok || !(clean.value.email || clean.value.phone || clean.value.linkedinUrl)) continue;
    // Name must relate to the company or look like a person (≥2 words).
    const person = name.split(/\s+/).length >= 2 || name.toLowerCase().includes(companyHint);
    if (person && !contacts.some((c) => (c.email && c.email === clean.value.email) || (c.phone && c.phone === clean.value.phone))) {
      contacts.push(clean.value);
    }
  }
  return { contacts, note: contacts.length ? `Found ${contacts.length} public contact${contacts.length === 1 ? '' : 's'}.` : 'No public contact found.' };
}
