import assert from 'node:assert/strict';
import { cleanContact } from '../lib/contact-fields';

const base = { companyId: 69825, name: ' Jane Doe ', sourceUrl: 'https://example.com/team' };
const ok = cleanContact({ ...base, phone: '(718) 555-0100', email: 'Jane@Example.com', title: '' });
assert.equal(ok.ok, true);
if (ok.ok) {
  assert.equal(ok.value.name, 'Jane Doe');
  assert.equal(ok.value.email, 'jane@example.com');
  assert.equal(ok.value.title, null); // empty optional → null, not ''
}
assert.equal(cleanContact({ ...base, phone: '+1 718-555-0100' }).ok, true);
assert.equal(cleanContact({ ...base, phone: '12-34' }).ok, false);
assert.equal(cleanContact({ ...base, sourceUrl: '' }).ok, false); // source required (Q12/Q18)
assert.equal(cleanContact({ ...base, linkedinUrl: 'javascript:alert(1)' }).ok, false);
assert.equal(cleanContact({ ...base, name: '   ' }).ok, false);
assert.equal(cleanContact({ ...base, companyId: 'x' }).ok, false);
assert.equal(cleanContact(null).ok, false);
console.log('contact checks ok');
