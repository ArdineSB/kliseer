import { extractText } from 'unpdf';
import { FIELDS, cleanFields, type FieldValue, type Section } from './fields';
import { llm, LLM_MODEL } from './llm';

export const UPLOAD_ERROR = 'Could not read that file.';
const MAX_BYTES = 2 * 1024 * 1024;

export type Citation = {
  section: Section;
  field: string;
  value: FieldValue;
  quote: string;
  fileName: string;
};

/** Drop any field whose quote is not an exact substring, or whose value fails cleanFields. */
export function acceptCitations(text: string, fileName: string, raw: unknown): Citation[] {
  if (!Array.isArray(raw)) return [];
  const out: Citation[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const row = item as Record<string, unknown>;
    const section = row.section;
    const field = row.field;
    const quote = row.quote;
    if ((section !== 'company' && section !== 'icp' && section !== 'target') || typeof field !== 'string' || typeof quote !== 'string' || !quote.trim()) continue;
    if (!FIELDS[section].some((f) => f.key === field) || !text.includes(quote)) continue;
    const cleaned = cleanFields(section, { [field]: row.value });
    if (!cleaned.ok) continue;
    const value = cleaned.value[field];
    if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) continue;
    out.push({ section, field, value, quote, fileName });
  }
  return out;
}

export async function readUpload(fileName: string, bytes: Uint8Array): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_BYTES) return { ok: false, error: UPLOAD_ERROR };
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'txt' || ext === 'md' || ext === 'markdown') return { ok: true, text: new TextDecoder().decode(bytes) };
  if (ext !== 'pdf') return { ok: false, error: UPLOAD_ERROR };
  try {
    const { text } = await extractText(bytes, { mergePages: true });
    if (!text.trim()) return { ok: false, error: UPLOAD_ERROR };
    return { ok: true, text };
  } catch {
    return { ok: false, error: UPLOAD_ERROR };
  }
}

/** LLM proposes fields. acceptCitations is the gate. Does not write the seller and does not approve. */
export async function proposeCitations(text: string, fileName: string): Promise<Citation[]> {
  const clipped = text.slice(0, 12_000);
  const keys = (Object.entries(FIELDS) as [Section, typeof FIELDS.company][]).flatMap(([section, fields]) => fields.map((f) => `${section}.${f.key}${f.list ? '[]' : ''}`));
  const res = await llm.chat.completions.create({
    model: LLM_MODEL,
    temperature: 0,
    messages: [
      { role: 'system', content: `Extract seller setup fields from the file. Reply with a JSON array only. Each item: {"section","field","value","quote"}. section.field must be one of: ${keys.join(', ')}. value is a string, or a string array when the key ends with []. quote is an exact substring of the file. Omit a field you cannot quote. Do not approve anything.` },
      { role: 'user', content: clipped },
    ],
  });
  const raw = res.choices[0]?.message?.content ?? '';
  const start = raw.indexOf('[');
  const end = raw.lastIndexOf(']');
  if (start < 0 || end < start) return [];
  try {
    return acceptCitations(clipped, fileName, JSON.parse(raw.slice(start, end + 1)));
  } catch {
    return [];
  }
}
