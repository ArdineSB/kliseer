import Link from 'next/link';
import { Icon, type IconName } from './Icon';

export const SUGGESTED_PROMPT = 'Which companies would be a good fit for what I sell?';

const SETUP: { icon: IconName; label: string; href: string }[] = [
  { icon: 'building', label: 'Describe your company', href: '/setup/company' },
  { icon: 'file', label: 'Define your ideal customer', href: '/setup/icp' },
  { icon: 'target', label: 'Set your target market', href: '/setup/target' },
];
const ACTIONS: { icon: IconName; label: string; href: string }[] = [
  { icon: 'building', label: 'Company profile', href: '/setup/company' },
  { icon: 'file', label: 'Define ICP', href: '/setup/icp' },
  { icon: 'target', label: 'Set targets', href: '/setup/target' },
  { icon: 'eye', label: 'View prospects', href: '/seer' },
];

const card = 'flex h-40 flex-col rounded-xl border border-line bg-canvas';
const cardFoot = 'mt-auto flex h-9 items-center justify-between border-t border-line px-4 text-xs text-secondary';

/** Home empty state, frame 5013: logo, greeting, three cards, four actions. Rendered inside ChatPanel. */
export function HomeHero({ onPrompt }: { onPrompt: (text: string) => void }) {
  return (
    <div className="mx-auto flex w-[844px] max-w-full flex-col items-center px-6 pt-16 text-center">
      <span className="grid size-12 place-items-center rounded-xl bg-brand text-white shadow-sm" aria-hidden="true">
        <svg width="26" height="26" viewBox="0 0 256 256" fill="none" stroke="#fff" strokeWidth="40">
          <path d="M62 44v168" strokeLinecap="round" />
          <path d="M212 44 128 128 212 212" strokeLinejoin="bevel" />
        </svg>
      </span>
      <h1 className="mt-6 mb-0 text-[28px] leading-9 font-semibold tracking-tight">Hi there. What’s your next opportunity?</h1>
      <p className="mt-3 mb-0 text-secondary">Tell Kliseer what you sell. Let’s find who needs it.</p>

      <div className="mt-20 grid w-full grid-cols-3 gap-4 text-left">
        <div className="gradient-border flex h-40 flex-col rounded-xl p-5">
          <span className="flex items-center gap-2 text-[13px] text-brand"><Icon name="sparkle" size={16} />Kliseer assistant</span>
          <b className="mt-4 text-[15px] font-semibold">Your prospecting partner</b>
          <span className="mt-4 text-xs leading-5 text-secondary">Connect your products to the companies that need them.</span>
        </div>
        <div className={card}>
          <ul className="m-0 flex list-none flex-col gap-3 p-4 pb-3">
            {SETUP.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="flex items-center gap-2 text-[13px] hover:text-brand"><span className="text-secondary"><Icon name={s.icon} /></span>{s.label}</Link>
              </li>
            ))}
          </ul>
          <div className={cardFoot}><span>Get started</span><Link href="/setup/company" className="font-medium text-brand hover:underline">Open setup</Link></div>
        </div>
        <button type="button" onClick={() => onPrompt(SUGGESTED_PROMPT)} className={`${card} cursor-pointer p-0 text-left hover:border-[var(--selection-border)]`}>
          <span className="p-4 pt-5 text-[15px] leading-6">{SUGGESTED_PROMPT}</span>
          <span className={`${cardFoot} w-full`}><span>Suggested prompt</span><Icon name="arrowRight" size={18} /></span>
        </button>
      </div>

      <nav aria-label="Quick actions" className="mt-6 flex flex-wrap justify-center gap-3">
        {ACTIONS.map((a) => (
          <Link key={a.label} href={a.href} className="flex h-11 items-center gap-2 rounded-full border border-line bg-canvas px-4 text-[13px] hover:bg-subtle">
            <span className="text-brand"><Icon name={a.icon} size={18} /></span>{a.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
