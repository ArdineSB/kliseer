import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { NewContactButton } from '@/components/NewContactButton';
import { Shell } from '@/components/Shell';
import { Topbar } from '@/components/Topbar';
import { listContacts } from '@/lib/contacts';
import { ensureSellerId } from '@/lib/session';

export const dynamic = 'force-dynamic';

const PAGE = 25;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;
const host = (u: string) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } };

function Profile({ href, icon, label }: { href: string | null; icon: 'linkedin' | 'globe' | 'share'; label: string }) {
  if (!href) return <span className="text-muted" title={`${label}: not found`}><Icon name={icon} struck /><span className="sr-only">{label}: not found</span></span>;
  return <a href={href} target="_blank" rel="noopener noreferrer" className={icon === 'linkedin' ? 'text-linkedin' : 'text-brand'} title={label}><Icon name={icon} filled={icon === 'linkedin'} /><span className="sr-only">{label} (opens in new tab)</span></a>;
}

export default async function ContactsPage({ searchParams }: PageProps<'/contacts'>) {
  const sp = await searchParams;
  const q = one(sp.q)?.slice(0, 100);
  const page = Math.max(1, Number(one(sp.page)) || 1);
  const sellerId = await ensureSellerId();
  const { items, total } = await listContacts(sellerId, { q, limit: PAGE, offset: (page - 1) * PAGE });
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const href = (p: number) => `/contacts?${new URLSearchParams({ ...(q ? { q } : {}), ...(p > 1 ? { page: String(p) } : {}) })}`;

  return (
    <Shell tab="contacts" sellerId={sellerId}>
      <Topbar crumbs={['Contacts']} />
      <div className="content">
        <div className="page-head">
          <div>
            <h1>Contacts</h1>
            <p className="lede">People and company contacts for your prospects. Every contact links to where it was found.</p>
          </div>
          <NewContactButton />
        </div>

        <form className="toolbar" action="/contacts" role="search">
          <div className="search">
            <Icon name="search" />
            <label htmlFor="contacts-q" className="sr-only">Search contacts</label>
            <input id="contacts-q" name="q" defaultValue={q} placeholder="Search name, company, title or email" maxLength={100} />
          </div>
          <span className="text-xs text-secondary">{total} contact{total === 1 ? '' : 's'}</span>
        </form>

        {items.length === 0 ? (
          <div className="card empty">
            <h2>{q ? 'No contacts match your search' : 'No contacts yet'}</h2>
            <p className="m-0">{q ? <Link href="/contacts" className="link">Clear search</Link> : 'Add one with New Contact, or from a prospect’s Contacts section.'}</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th scope="col">Name</th><th scope="col">Company</th><th scope="col">Title</th><th scope="col">Email</th><th scope="col">Phone</th><th scope="col">Profiles</th><th scope="col">Source</th></tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className="flex items-center gap-2.5">
                        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-soft text-[11px] font-semibold text-brand" aria-hidden="true">{c.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()}</span>
                        <b className="font-semibold">{c.name}</b>
                        {c.manual && <span className="badge">Manual</span>}
                      </span>
                    </td>
                    <td><Link href={`/seer/${c.companyId}`} className="row-link">{c.company}</Link></td>
                    <td className={c.title ? '' : 'text-muted'}>{c.title ?? '—'}</td>
                    <td>{c.email ? <a href={`mailto:${c.email}`} className="link font-normal">{c.email}</a> : <span className="text-muted">Not found</span>}</td>
                    <td className="num">{c.phone ? <a href={`tel:${c.phone.replace(/[^\d+]/g, '')}`}>{c.phone}</a> : <span className="text-muted">Not found</span>}</td>
                    <td><span className="flex gap-2.5"><Profile href={c.linkedinUrl} icon="linkedin" label="LinkedIn" /><Profile href={c.website} icon="globe" label="Website" /><Profile href={c.socialUrl} icon="share" label="Social" /></span></td>
                    <td><a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="link text-xs font-normal">{host(c.sourceUrl)} <Icon name="external" size={12} /><span className="sr-only">(opens in new tab)</span></a></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="table-foot">
              <span>Showing {(page - 1) * PAGE + 1}–{(page - 1) * PAGE + items.length} of {total}</span>
              <nav className="pager" aria-label="Pagination">
                {page > 1 ? <Link href={href(page - 1)} className="link">Previous</Link> : <span className="text-muted">Previous</span>}
                <span>Page {page} of {pages}</span>
                {page < pages ? <Link href={href(page + 1)} className="link">Next</Link> : <span className="text-muted">Next</span>}
              </nav>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
