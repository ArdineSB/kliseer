import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { FieldValue } from './fields';

export const AUTH_ERROR = 'Email or password is not valid.';
export const EMAIL_ERROR = 'Enter a valid email.';
export const PASSWORD_ERROR = 'Password must be at least 8 characters.';
export const GUEST_DAYS = 7;
export const SESSION_DAYS = 30;

export function emailError(email: string): string | null {
  const v = email.trim().toLowerCase();
  if (v.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return EMAIL_ERROR;
  return null;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** ponytail: over 128 chars uses the same short-password copy. Q11 locked three strings. */
export function passwordError(password: string): string | null {
  if (password.length < 8 || password.length > 128) return PASSWORD_ERROR;
  return null;
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32);
  return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [kind, saltB64, hashB64] = stored.split('$');
  if (kind !== 'scrypt' || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, 'base64');
  const actual = scryptSync(password, Buffer.from(saltB64, 'base64'), expected.length);
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function sectionFilled(data: Record<string, FieldValue> | null | undefined): boolean {
  if (!data) return false;
  return Object.values(data).some((v) => (Array.isArray(v) ? v.some((i) => i.trim()) : v.trim() !== ''));
}

export type Claim = 'keep-account' | 'take-guest';

/** Account with any Company, ICP, or Target value wins. Empty account takes the guest row. */
export function claimGuest(account: { company: Record<string, FieldValue>; icp: Record<string, FieldValue>; target: Record<string, FieldValue> }): Claim {
  return sectionFilled(account.company) || sectionFilled(account.icp) || sectionFilled(account.target) ? 'keep-account' : 'take-guest';
}

/** Expired at exactly 7 days. Rows without a guest token are never guests. */
export function guestExpired(createdAt: Date, now: Date, hasGuestToken: boolean): boolean {
  if (!hasGuestToken) return false;
  return now.getTime() - createdAt.getTime() >= GUEST_DAYS * 86400_000;
}

/** Stored text keeps the token. Display replaces it. One pass, so a name cannot re-enter the token. */
export function renderDraft(text: string, contactName: string): string {
  return text.replaceAll('{contact.name}', contactName);
}
