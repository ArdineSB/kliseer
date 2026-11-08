import { LlmUnavailable } from './chat';
import { sql } from './db';
import { llm, LLM_MODEL } from './llm';
import type { ProspectDetail } from './prospects';

/**
 * One interpretation paragraph per (seller, prospect). The LLM reads the rule-based stars and
 * real signals; it never assigns or changes a rating (G8). Stored so reloads do not re-bill.
 */
export async function generateAnalysis(sellerId: number, p: ProspectDetail, seller: { name: string; products: string[] }): Promise<string> {
  if (!process.env.LLM_API_KEY || !LLM_MODEL) throw new LlmUnavailable('LLM unavailable');
  let raw: string;
  try {
    const res = await llm.chat.completions.create({
      model: LLM_MODEL,
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: 'You interpret sales prospects for Kliseer, a US building-construction prospecting tool. Write ONE plain-text paragraph, 50 to 90 words, English. Explain why this company may fit the seller now, using only the given signals and ratings. Do not state or change any score. Do not invent projects, people, dates, or purchases. Say what outreach should confirm. No markdown, no lists, no greeting.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            seller,
            prospect: { name: p.name, state: p.state, tier: p.tier, overall: p.score, ratings: p.stars, reasons: p.reasons },
            signals: p.signals.slice(0, 5).map((s) => ({ date: s.date, source: s.source, summary: s.summary, matchedKeywords: s.matched })),
          }),
        },
      ],
    });
    raw = res.choices[0]?.message?.content ?? '';
  } catch (e) {
    console.error('LLM error:', (e as Error).message);
    throw new LlmUnavailable('LLM unavailable');
  }
  const body = raw.replace(/\s+/g, ' ').trim().slice(0, 1200);
  if (!body) throw new LlmUnavailable('LLM unavailable');
  await sql`
    insert into analyses (seller_id, company_id, body) values (${sellerId}, ${p.id}, ${body})
    on conflict (seller_id, company_id) do update set body = excluded.body, updated_at = now()`;
  return body;
}
