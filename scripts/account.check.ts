import assert from 'node:assert/strict';
import { AUTH_ERROR, EMAIL_ERROR, PASSWORD_ERROR, claimGuest, emailError, guestExpired, hashPassword, passwordError, renderDraft, verifyPassword } from '../lib/account';
import { UPLOAD_ERROR, acceptCitations, readUpload } from '../lib/upload';

assert.equal(emailError('not-an-email'), EMAIL_ERROR);
assert.equal(emailError('a@b.co'), null);
assert.equal(passwordError('short'), PASSWORD_ERROR);
assert.equal(passwordError('long-enough'), null);
assert.equal(AUTH_ERROR, 'Email or password is not valid.');

const stored = hashPassword('long-enough');
assert.equal(verifyPassword('long-enough', stored), true);
assert.equal(verifyPassword('wrong-password', stored), false);
assert.equal(verifyPassword('long-enough', 'nope'), false);

const empty = { company: {}, icp: {}, target: {} };
assert.equal(claimGuest(empty), 'take-guest');
assert.equal(claimGuest({ ...empty, company: { name: '  ' } }), 'take-guest');
assert.equal(claimGuest({ ...empty, target: { buyerRoles: ['Procurement'] } }), 'keep-account');

const created = new Date('2026-11-01T00:00:00Z');
assert.equal(guestExpired(created, new Date('2026-11-08T00:00:00Z'), true), true);
assert.equal(guestExpired(created, new Date('2026-11-07T00:00:00Z'), true), false);
assert.equal(guestExpired(created, new Date('2026-11-20T00:00:00Z'), false), false);

const body = 'Hi {contact.name}, following up.';
assert.equal(renderDraft(body, 'Conor'), 'Hi Conor, following up.');
assert.equal(body.includes('{contact.name}'), true);
assert.equal(renderDraft('Hi {contact.name}', '{contact.name}'), 'Hi {contact.name}');

const file = 'Harborline Electrical Supply sells switchboards in NY.';
const cites = acceptCitations(file, 'profile.md', [
  { section: 'company', field: 'name', value: 'Harborline Electrical Supply', quote: 'Harborline Electrical Supply' },
  { section: 'company', field: 'name', value: 'Invented Co', quote: 'not in file' },
  { section: 'company', field: 'nope', value: 'x', quote: 'Harborline' },
  { section: 'company', field: 'keywords', value: ['switchboards'], quote: 'switchboards' },
]);
assert.equal(cites.length, 2);
assert.equal(cites[0].value, 'Harborline Electrical Supply');
assert.deepEqual(cites[1].value, ['switchboards']);

const txt = await readUpload('profile.txt', new TextEncoder().encode(file));
assert.equal(txt.ok && txt.text, file);
assert.deepEqual(await readUpload('notes.csv', new TextEncoder().encode('a')), { ok: false, error: UPLOAD_ERROR });
assert.deepEqual(await readUpload('empty.txt', new Uint8Array()), { ok: false, error: UPLOAD_ERROR });

function miniPdf(text: string): Uint8Array {
  const stream = `BT /F1 12 Tf 20 100 Td (${text}) Tj ET`;
  const objects = [
    '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n',
    '2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n',
    '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 144]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n',
    `4 0 obj<</Length ${stream.length}>>stream\n${stream}\nendstream\nendobj\n`,
    '5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n',
  ];
  let body = '%PDF-1.4\n';
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(body));
    body += obj;
  }
  const xrefAt = Buffer.byteLength(body);
  let xref = 'xref\n0 6\n0000000000 65535 f \n';
  for (let i = 1; i <= 5; i++) xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  body += `${xref}trailer<</Size 6/Root 1 0 R>>\nstartxref\n${xrefAt}\n%%EOF`;
  return new TextEncoder().encode(body);
}

const pdf = await readUpload('profile.pdf', miniPdf('Harborline Electrical'));
assert.equal(pdf.ok, true, pdf.ok ? '' : pdf.error);
if (pdf.ok) assert.equal(pdf.text.includes('Harborline Electrical'), true);

console.log('account checks ok');
