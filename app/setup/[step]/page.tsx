import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import { ApproveButton, FindProspects } from '@/components/ReviewActions';
import { SetupForm } from '@/components/SetupForm';
import { Shell } from '@/components/Shell';
import { Topbar } from '@/components/Topbar';
import type { Tab } from '@/lib/chat';
import { ensureSellerId } from '@/lib/session';
import { FIELDS, SECTIONS, type Section, type Seller } from '@/lib/fields';
import { getSeller } from '@/lib/seller';

export const dynamic = 'force-dynamic';

const STEPS: { slug: Section | 'review'; label: string; tab: Tab; chat: string; title: string; lede: string }[] = [
  { slug: 'company', label: 'Company', tab: 'klise', chat: 'Klise chat', title: 'Company background', lede: 'Tell Kliseer what you sell and where. Klise can fill this from chat.' },
  { slug: 'icp', label: 'ICP', tab: 'icp', chat: 'ICP chat', title: 'Ideal customer profile', lede: 'Which customers fit you best. Used to explain why a prospect matches.' },
  { slug: 'target', label: 'Target', tab: 'target', chat: 'Target chat', title: 'Who to look for', lede: 'Company types, regions and buyer roles Seer should focus on.' },
  { slug: 'review', label: 'Review', tab: 'klise', chat: 'Setup chat', title: 'Review your setup', lede: 'Confirm what Kliseer uses to find prospects.' },
];
const LABEL: Record<Section, string> = { company: 'Company', icp: 'ICP', target: 'Target' };

function Stepper({ seller, current }: { seller: Seller; current: number }) {
  return (
    <ol className="stepper" aria-label="Setup steps">
      {STEPS.map((s, i) => {
        const isDone = i < current || (s.slug !== 'review' && seller.status[s.slug] === 'approved');
        const body = <><i>{isDone && i !== current ? <Icon name="check" size={12} /> : i + 1}</i>{s.label}</>;
        return (
          <li key={s.slug}>
            {i === current
              ? <span className="step" aria-current="step">{body}</span>
              : <Link href={`/setup/${s.slug}`} className={`step${isDone ? ' done' : ''}`}>{body}</Link>}
          </li>
        );
      })}
    </ol>
  );
}

export default async function SetupPage({ params }: PageProps<'/setup/[step]'>) {
  const { step } = await params;
  const idx = STEPS.findIndex((s) => s.slug === step);
  if (idx < 0) notFound();
  const s = STEPS[idx];
  const sellerId = await ensureSellerId();
  const seller = await getSeller(sellerId);
  const head = (
    <>
      <Stepper seller={seller} current={idx} />
      <h1>{s.title}</h1>
      <p className="lede">{s.lede}</p>
    </>
  );

  return (
    <Shell tab={s.tab} sellerId={sellerId} setupStep={idx + 1} chat={{ tab: s.tab, title: s.chat, placeholder: 'Ask Kliseer…' }}>
      {s.slug === 'review'
        ? <Review seller={seller} head={head} />
        : <SetupForm
            key={s.slug}
            section={s.slug}
            seller={seller}
            crumbs={['Setup', s.label]}
            chatHref={`/setup/${s.slug}`}
            back={idx > 0 ? `/setup/${STEPS[idx - 1].slug}` : undefined}
            next={`/setup/${STEPS[idx + 1].slug}`}
            head={head}
          />}
    </Shell>
  );
}

const show = (v: unknown) => (Array.isArray(v) ? v.join(', ') : typeof v === 'string' ? v : '') || '—';

function Review({ seller, head }: { seller: Seller; head: ReactNode }) {
  const approved = SECTIONS.filter((x) => seller.status[x] === 'approved').length;
  const allApproved = approved === SECTIONS.length;
  return (
    <>
      <Topbar crumbs={['Setup', 'Review']} right={<span className={`save-status${allApproved ? ' ok' : ''}`} role="status">{allApproved ? 'Saved' : 'Draft'}</span>} />
      <div className="content">
        <div className="page-head">
          <div>{head}</div>
          {Object.keys(seller.sources).length > 0 && <span className="legend"><i className="from-chat" aria-hidden="true" /> From chat</span>}
        </div>
        <div className="review">
          {SECTIONS.map((sec) => {
            // Company card shows the fields that drive matching; the rest stay on the Company step.
            const fields = FIELDS[sec].filter((f) => sec !== 'company' || ['name', 'products', 'region', 'keywords'].includes(f.key));
            const empty = FIELDS[sec].every((f) => show(seller[sec][f.key]) === '—');
            const isApproved = seller.status[sec] === 'approved';
            return (
              <section key={sec} className="card" aria-labelledby={`rv-${sec}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h2 id={`rv-${sec}`}>{LABEL[sec]}</h2>
                  <span className={`badge ${isApproved ? 'badge-ok' : 'badge-warn'}`}>{isApproved ? 'Approved' : 'Draft'}</span>
                  <Link href={`/setup/${sec}`} className="link" style={{ marginLeft: 'auto' }} aria-label={`Edit ${LABEL[sec]}`}>Edit</Link>
                </div>
                <dl>
                  {fields.map((f) => (
                    <div key={f.key}>
                      <dt>{f.label}{seller.sources[`${sec}.${f.key}`] && <i className="from-chat" role="img" aria-label="from chat" />}</dt>
                      <dd>{show(seller[sec][f.key])}</dd>
                    </div>
                  ))}
                </dl>
                {!isApproved && (
                  <div style={{ marginTop: 20 }}>
                    {empty
                      ? <p className="muted" style={{ margin: 0, fontSize: 12 }}>Fill this section before approving.</p>
                      : <ApproveButton section={sec} label={LABEL[sec]} />}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
      <footer className="footer">
        <Link href="/setup/target" className="btn btn-ghost">Back</Link>
        <span className="spacer" />
        <span className="muted">{allApproved ? 'All sections approved' : `${approved} of 3 sections approved`}</span>
        <FindProspects enabled={allApproved} />
      </footer>
    </>
  );
}
