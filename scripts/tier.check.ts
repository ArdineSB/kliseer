import assert from 'node:assert/strict';
import { matchKeywords, tierFor } from '../lib/tier';

const today = new Date('2026-11-06T12:00:00Z');
const ago = (n: number) => new Date(Date.UTC(2026, 10, 6) - n * 86400_000).toISOString().slice(0, 10);
const hit = (n: number) => ({ date: ago(n), matched: ['switchboard'] });
const miss = (n: number) => ({ date: ago(n), matched: [] });

assert.equal(tierFor([hit(1), miss(10)], today), 'S');
assert.equal(tierFor([miss(1), miss(10)], today), 'B'); // two recent, none relevant
assert.equal(tierFor([hit(5)], today), 'A');
assert.equal(tierFor([miss(5)], today), 'B');
assert.equal(tierFor([hit(90)], today), 'A');  // 90 days: inside window
assert.equal(tierFor([hit(91)], today), 'C');  // 91 days: outside
assert.equal(tierFor([hit(90), miss(91)], today), 'A'); // only one inside window
assert.equal(tierFor([miss(365)], today), 'C');
assert.equal(tierFor([miss(366)], today), '—');
assert.equal(tierFor([], today), '—');

assert.deepEqual(matchKeywords('Install new SWITCHBOARD and ATS', ['switchboard', 'ats', 'generator']), ['switchboard', 'ats']);
assert.deepEqual(matchKeywords('Repairs on stats board', ['ats']), []); // word boundary
assert.deepEqual(matchKeywords('Add cable tray, 3rd floor', ['cable tray']), ['cable tray']);
console.log('tier checks ok');
