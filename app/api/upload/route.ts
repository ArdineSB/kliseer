import { readUpload, proposeCitations, UPLOAD_ERROR, type Citation } from '@/lib/upload';
import { ensureSellerId } from '@/lib/session';
import { saveSection } from '@/lib/seller';
import type { FieldValue } from '@/lib/fields';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FILES = 20;

type FileResult = { name: string; size: number; status: 'ready' | 'error'; error?: string; fields?: { section: string; field: string; value: FieldValue; quote: string; fileName: string }[] };

/**
 * Per-file pipeline: read → propose → gate via acceptCitations. One file's failure
 * never cancels the batch (DESIGN.md upload contract). Drafts are written with
 * source markers keyed `upload.<fileName>` for attribution; no auto-approve.
 */
export async function POST(req: Request) {
  const sellerId = await ensureSellerId();
  const form = await req.formData().catch(() => null);
  const files = form?.getAll('files').filter((f): f is File => f instanceof File) ?? [];
  if (!files.length) return Response.json({ error: 'no files' }, { status: 400 });
  if (files.length > MAX_FILES) return Response.json({ error: `at most ${MAX_FILES} files` }, { status: 400 });

  const results: FileResult[] = [];
  const allCitations: Citation[] = [];
  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const read = await readUpload(file.name, bytes);
    if (!read.ok) {
      results.push({ name: file.name, size: file.size, status: 'error', error: UPLOAD_ERROR });
      continue;
    }
    // LLM per file; a proposal failure is a file failure, not a batch failure.
    let cites: Citation[] = [];
    try {
      cites = await proposeCitations(read.text, file.name);
    } catch {
      results.push({ name: file.name, size: file.size, status: 'error', error: UPLOAD_ERROR });
      continue;
    }
    results.push({
      name: file.name, size: file.size, status: 'ready',
      fields: cites.map((c) => ({ section: c.section, field: c.field, value: c.value, quote: c.quote, fileName: c.fileName })),
    });
    allCitations.push(...cites);
  }

  if (allCitations.length) {
    // Merge per section; later files overwrite earlier values for the same field (last file wins).
    for (const section of ['company', 'icp', 'target'] as const) {
      const fields = allCitations.filter((c) => c.section === section);
      if (!fields.length) continue;
      const data = Object.fromEntries(fields.map((c) => [c.field, c.value]));
      await saveSection(sellerId, section, data as Record<string, FieldValue>, false);
    }
  }

  return Response.json({ files: results });
}
