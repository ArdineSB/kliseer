import assert from 'node:assert/strict';
import { answerWorkspaceQuestion, formatWorkspaceContext, type WorkspaceSnapshot } from '../lib/chat-workspace';

const data: WorkspaceSnapshot = {
  candidateTotal: 2,
  candidates: [
    { id: 41, name: 'Beacon Electric', state: 'NY', tier: 'S', score: 18, signals: 7, recent: 4, matched: 3, lastDate: '2026-11-06', lastSummary: 'Filed a commercial switchgear installation permit.', contacts: [] },
    { id: 42, name: 'Hudson Builders', state: 'NJ', tier: 'A', score: 13, signals: 5, recent: 2, matched: 1, lastDate: '2026-11-03', lastSummary: 'Filed a warehouse renovation permit.', contacts: [{ name: 'Mina Shah', title: 'Project Manager', email: 'mina@hudson.example', phone: null }] },
  ],
  contactsTotal: 1,
  contacts: [{ name: 'Mina Shah', company: 'Hudson Builders', title: 'Project Manager', email: 'mina@hudson.example', phone: null, sourceUrl: 'https://example.com/team' }],
  contactsTruncated: false,
};

const without = answerWorkspaceQuestion('which prospects have no contacts?', data);
assert.ok(without && without.includes('Beacon Electric') && !without.includes('Hudson Builders'), 'no-contact answer lists only Beacon');
const compare = answerWorkspaceQuestion('compare the candidates for me', data);
assert.ok(compare && compare.startsWith('Here are the strongest'), 'compare answer ranks candidates');
const pick = answerWorkspaceQuestion('Which prospect should I reach out to first?', data);
assert.ok(pick && pick.includes('Beacon Electric'), 'pick answer names the top candidate');
const list = answerWorkspaceQuestion('show me all contacts', data);
assert.ok(list && list.includes('mina@hudson.example') && list.includes('https://example.com/team'), 'contact list keeps source');
const none = answerWorkspaceQuestion('what is the weather?', data);
assert.equal(none, null, 'unmatched questions fall through to the LLM');
const empty = answerWorkspaceQuestion('who has no contacts?', { candidateTotal: 0, candidates: [], contactsTotal: 0, contacts: [], contactsTruncated: false });
assert.ok(empty && empty.includes('no current Seer prospects'), 'empty workspace gets an honest answer');
assert.ok(formatWorkspaceContext(data).includes('Beacon Electric'), 'context includes candidates');
console.log('chat-workspace checks ok');
