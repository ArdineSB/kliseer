export type WorkspaceContact = {
  name: string;
  company: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  sourceUrl: string;
};

export type WorkspaceCandidate = {
  id: number;
  name: string;
  state: string;
  tier: string;
  score: number | null;
  signals: number;
  recent: number;
  matched: number;
  lastDate: string;
  lastSummary: string;
  contacts: Pick<WorkspaceContact, 'name' | 'title' | 'email' | 'phone'>[];
};

export type WorkspaceSnapshot = {
  candidateTotal: number;
  candidates: WorkspaceCandidate[];
  contactsTotal: number;
  contacts: WorkspaceContact[];
  contactsTruncated: boolean;
  workspaceProfile?: { company: unknown; icp: unknown; target: unknown };
};

const details = (p: WorkspaceCandidate) =>
  `${p.name} (${p.state}) — ${p.score === null ? `Tier ${p.tier}, not scored` : `${p.score}/20, Tier ${p.tier}`}; ${p.signals} saved signals, ${p.matched} keyword matches; latest ${p.lastDate}: ${p.lastSummary}${p.contacts.length ? `; contacts: ${p.contacts.map((c) => `${c.name}${c.title ? `, ${c.title}` : ''}${c.email ? `, ${c.email}` : ''}`).join('; ')}` : '; no sourced contact is on file'}.`;

/** Give direct database-backed answers for common prospect and contact requests. */
export function answerWorkspaceQuestion(message: string, data: WorkspaceSnapshot): string | null {
  const q = message.toLowerCase();
  const noContactQuestion = /\b(no|without|missing|lack(?:s|ing)?|uncontacted|do not have|don't have)\b[^.?\n]{0,50}\bcontacts?\b|\bcontacts?\b[^.?\n]{0,50}\b(no|without|missing|unavailable)\b/.test(q);

  if (noContactQuestion) {
    if (!data.candidateTotal) return 'There are no current Seer prospects to check yet. Complete your company and target setup or load the Harborline demo to see current public-signal prospects.';
    const without = data.candidates.filter((p) => p.contacts.length === 0);
    if (!without.length) return `All ${data.candidates.length} current top Seer prospects have at least one saved contact.`;
    return `Among the ${data.candidates.length} current top Seer prospects, ${without.length} have no sourced contact on file:\n${without.map((p) => `- ${details(p)}`).join('\n')}`;
  }

  if (/\b(compare|comparison)\b/.test(q) && /\b(candidates?|prospects?|companies)\b/.test(q)) {
    if (!data.candidates.length) return 'There are no current Seer candidates to compare yet. Complete your company and target setup or load the Harborline demo to see prospects from current public signals.';
    const ranked = data.candidates.slice(0, 3);
    return `Here are the strongest current Seer candidates, ranked by the existing match scores:\n${ranked.map((p, i) => `${i + 1}. ${details(p)}`).join('\n')}\nI would start with ${ranked[0].name}, the highest-ranked current match. The score reflects fit signals, not a guarantee they will buy.`;
  }

  if ((/\b(pick|choose|select|recommend)\b/.test(q) && /\b(one|1|first|prospect|candidate|company|lead|contact)\b/.test(q)) || /\breach out(?: to)? first\b|\bcontact(?: them)? first\b/.test(q)) {
    const first = data.candidates[0];
    if (!first) return 'There are no current Seer prospects to recommend yet. Complete your company and target setup or load the Harborline demo to find matches from current public signals.';
    return `Start with ${details(first)} This is the highest-ranked candidate currently available; its score is a fit indicator, not a buying-intent claim.`;
  }

  if (/\b(contact|contacts|email|emails|phone|phones)\b/.test(q) && /\b(list|show|give|available|all|any|who|what)\b/.test(q)) {
    if (!data.contactsTotal) return 'There are no sourced contacts saved for this workspace yet. I will not invent a name, email, or phone number. Open Seer to check prospects and add a contact with its source when one is available.';
    const listed = data.contacts.map((c) => `- ${c.name}${c.title ? ` — ${c.title}` : ''} at ${c.company}${c.email ? `; ${c.email}` : ''}${c.phone ? `; ${c.phone}` : ''}; source: ${c.sourceUrl}`);
    const omitted = data.contactsTruncated ? `\nShowing ${data.contacts.length} of ${data.contactsTotal} sourced contacts. Filter the Contacts page for the rest.` : '';
    return `Sourced contacts currently available (${data.contactsTotal}):\n${listed.join('\n')}${omitted}`;
  }

  return null;
}

export function formatWorkspaceContext(data: WorkspaceSnapshot) {
  return JSON.stringify({
    sellerProfile: data.workspaceProfile,
    candidateScope: `Current Seer top ${data.candidates.length} (of ${data.candidateTotal} matching prospects), ordered by the existing score and ranking rules.`,
    candidates: data.candidates,
    contactsScope: `${data.contacts.length} sourced contact records of ${data.contactsTotal} available${data.contactsTruncated ? ' (list truncated)' : ''}.`,
    contacts: data.contacts,
    prospectsWithoutContacts: data.candidates.filter((p) => p.contacts.length === 0).map(({ id, name, state, score, tier }) => ({ id, name, state, score, tier })),
  });
}
