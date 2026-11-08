import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import "./styles.css";

type FrameProps = {
  frame: number;
};

type Scene = {
  id: string;
  label: string;
  start: number;
  end: number;
  activeNav: string;
};

const scenes: Scene[] = [
  { id: "company", label: "Company context", start: 0, end: 112, activeNav: "Klise" },
  { id: "target", label: "Define the target", start: 112, end: 204, activeNav: "Target" },
  { id: "prospect", label: "Find a prospect", start: 204, end: 320, activeNav: "Seer" },
  { id: "move", label: "Make your move", start: 320, end: 436, activeNav: "Seer" },
  { id: "chat", label: "Ask Kliseer", start: 436, end: 560, activeNav: "Home" },
  { id: "end", label: "Opening title", start: 560, end: 600, activeNav: "" },
];

const easing = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing };

const reveal = (frame: number, start: number, duration = 18) =>
  interpolate(frame, [start, start + duration], [0, 1], clamp);

const typeText = (value: string, progress: number) =>
  value.slice(0, Math.ceil(value.length * progress));

const sceneStyle = (frame: number, scene: Scene) => {
  const entering = interpolate(frame, [scene.start - 14, scene.start + 14], [0, 1], clamp);
  const leaving = scene.id === "end" ? 1 : interpolate(frame, [scene.end - 14, scene.end + 14], [1, 0], clamp);
  const opacity = Math.min(entering, leaving);
  const lift = interpolate(frame, [scene.start - 14, scene.start + 14], [16, 0], clamp);
  return { opacity, translate: `0px ${lift}px`, scale: 0.992 + opacity * 0.008 };
};

const itemStyle = (frame: number, start: number, duration = 16) => {
  const progress = reveal(frame, start, duration);
  const lift = interpolate(progress, [0, 1], [12, 0], { ...clamp, easing });
  return { opacity: progress, translate: `0px ${lift}px` };
};

function BrandMark({ className = "" }: { className?: string }) {
  return (
    <Img
      className={className}
      src={staticFile("kliseer-lockup.svg")}
      alt="Kliseer"
    />
  );
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "violet" | "green" }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

function FileRow({
  name,
  kind,
  frame,
  appearAt,
}: {
  name: string;
  kind: "MD" | "PDF";
  frame: number;
  appearAt: number;
}) {
  const rowStyle = itemStyle(frame, appearAt, 16);
  const ready = reveal(frame, appearAt + 18, 14) > 0.65;
  return (
    <div className="file-row" style={rowStyle}>
      <div className={`file-icon file-icon--${kind.toLowerCase()}`}>{kind}</div>
      <div className="file-meta">
        <strong>{name}</strong>
        <span>{kind === "MD" ? "Company overview" : "Product catalog"}</span>
      </div>
      <Badge tone={ready ? "green" : "neutral"}>{ready ? "Ready" : "Reading"}</Badge>
    </div>
  );
}

function Sidebar({ active }: { active: string }) {
  const items = ["Home", "Klise", "Target", "Seer", "Signals", "Competitors", "Contacts"];
  return (
    <aside className="sidebar">
      <div className="brand-box"><BrandMark className="brand-lockup" /></div>
      <div className="nav-label">WORKSPACE</div>
      <nav className="nav-list">
        {items.map((item, index) => (
          <div className={`nav-item ${item === active ? "nav-item--active" : ""}`} key={item}>
            <span className={`nav-glyph nav-glyph--${index}`} aria-hidden="true" />
            <span>{item}</span>
            {item === active && <span className="nav-active-dot" />}
          </div>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <span className="workspace-avatar">H</span>
        <div><strong>Harborline</strong><small>Fictional study case</small></div>
      </div>
    </aside>
  );
}

function WindowChrome() {
  return (
    <div className="window-chrome">
      <div className="window-controls"><i /><i /><i /></div>
      <span className="chrome-divider" />
      <span className="workspace-path">Kliseer <b>/</b> Workspace</span>
      <div className="chrome-right"><span className="demo-dot" /> DEMO WORKSPACE</div>
    </div>
  );
}

function PageHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="page-heading">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}

function CompanyScene({ frame }: FrameProps) {
  const name = "Harborline Electrical Supply";
  const draftName = typeText(name, reveal(frame, 50, 32));
  const uploadScale = interpolate(frame, [8, 11, 15], [1, 0.96, 1], clamp);
  return (
    <div className="scene-grid">
      <main className="main-pane">
        <PageHeading
          eyebrow="KLIESE / COMPANY BACKGROUND"
          title="Start with the context you already have."
          subtitle="Bring your company material in. Kliseer turns it into a profile draft you can review."
        />
        <div className="company-grid">
          <section className="surface-card upload-card">
            <div className="card-heading">
              <div><span className="mini-label">SOURCE FILES</span><h2>Company background</h2></div>
              <button className="upload-action" style={{ scale: uploadScale }} type="button">↑ Upload files</button>
            </div>
            <div className="file-list">
              <FileRow name="company-overview.md" kind="MD" frame={frame} appearAt={20} />
              <FileRow name="product-catalog.pdf" kind="PDF" frame={frame} appearAt={35} />
            </div>
            <div className="upload-foot"><span className="small-check">✓</span> Drafts need your review before saving.</div>
          </section>
          <section className="surface-card draft-card" style={itemStyle(frame, 45, 20)}>
            <div className="card-heading">
              <div><span className="mini-label">PROFILE DRAFT</span><h2>Company name</h2></div>
              <Badge tone="violet">Review draft</Badge>
            </div>
            <div className="draft-field"><span>Suggested name</span><strong>{draftName}<span className="caret" /></strong></div>
            <div className="source-line"><span className="source-dot" /> Quoted from <b>company-overview.md</b></div>
            <div className="draft-note">Fictional seller example · original files are not retained.</div>
          </section>
        </div>
      </main>
      <ContextAside className="context-aside" frame={frame}>
        <div className="aside-kicker"><span className="aside-icon">✳</span> FROM YOUR MATERIAL</div>
        <h2>Harborline<br />Electrical Supply</h2>
        <p className="aside-copy">Company name suggested from <b>company-overview.md</b>.</p>
        <div className="aside-rule" />
        <div className="aside-footnote"><span className="violet-dot" /> Editable draft · not auto-approved</div>
      </ContextAside>
    </div>
  );
}

function ContextAside({
  children,
  className = "",
  frame,
}: {
  children: React.ReactNode;
  className?: string;
  frame: number;
}) {
  return <aside className={`context-aside ${className}`} style={itemStyle(frame, 18, 18)}>{children}</aside>;
}

function TargetScene({ frame }: FrameProps) {
  const regionProgress = reveal(frame, 20, 25);
  const roleProgress = reveal(frame, 40, 22);
  return (
    <div className="scene-grid">
      <main className="main-pane">
        <PageHeading
          eyebrow="TARGET / MARKET"
          title="Choose the companies you want to reach."
          subtitle="Set the regions, company types, and buyer roles that describe your market."
        />
        <section className="surface-card target-card">
          <div className="target-header"><div><span className="mini-label">TARGET CRITERIA</span><h2>Define your market</h2></div><Badge tone="violet">Editable</Badge></div>
          <div className="target-fields">
            <div className="target-field" style={itemStyle(frame, 14)}>
              <label>Regions</label>
              <div className={`field-input ${regionProgress > 0 ? "field-input--focus" : ""}`}>
                {typeText("New York, New Jersey", regionProgress)}{regionProgress > 0 && regionProgress < 1 && <span className="caret" />}
              </div>
              <span className="field-hint">States and metro areas</span>
            </div>
            <div className="target-field" style={itemStyle(frame, 35)}>
              <label>Buyer roles</label>
              <div className={`field-input ${roleProgress > 0 ? "field-input--focus" : ""}`}>
                {typeText("Operations Manager", roleProgress)}{roleProgress > 0 && roleProgress < 1 && <span className="caret" />}
              </div>
              <span className="field-hint">People involved in the buying process</span>
            </div>
            <div className="target-field" style={itemStyle(frame, 54)}>
              <label>Company types</label>
              <div className="field-input field-input--muted">Not specified in this snapshot</div>
              <span className="field-hint">Leave blank until you define the fit</span>
            </div>
          </div>
        </section>
      </main>
      <ContextAside frame={frame}>
        <div className="aside-kicker"><span className="aside-icon">◎</span> TARGETING NOTE</div>
        <h2>A clearer target.<br />Still your call.</h2>
        <p className="aside-copy">Regions and buyer roles shape what you look for. Buyer roles do not add score points.</p>
        <div className="aside-rule" />
        <div className="aside-footnote"><span className="violet-dot" /> Company types are not set here</div>
      </ContextAside>
    </div>
  );
}

const scoreRows = [
  { label: "Keyword", value: 5 },
  { label: "Freshness", value: 5 },
  { label: "Place", value: 5 },
  { label: "Target fit", value: 1 },
];

function ScoreFactors({ frame }: FrameProps) {
  return (
    <div className="score-factors">
      {scoreRows.map((row, index) => {
        const progress = reveal(frame, 32 + index * 8, 14);
        return (
          <div className="score-row" key={row.label} style={itemStyle(frame, 26 + index * 8, 14)}>
            <span>{row.label}</span>
            <span className="factor-dots" aria-hidden="true">
              {Array.from({ length: 5 }, (_, dot) => <i className={dot < row.value && progress > 0.55 ? "factor-dot factor-dot--on" : "factor-dot"} key={dot} />)}
            </span>
            <b>{row.value}/5</b>
          </div>
        );
      })}
    </div>
  );
}

function ProspectScene({ frame }: FrameProps) {
  return (
    <div className="scene-grid">
      <main className="main-pane">
        <PageHeading
          eyebrow="SEER / PROSPECTS"
          title="Find the signal behind a prospect."
          subtitle="Select a company to see the dated public evidence behind its historical score."
        />
        <section className="surface-card prospect-card" style={itemStyle(frame, 12, 20)}>
          <div className="prospect-topline"><span className="mini-label">SELECTED PROSPECT</span><Badge tone="neutral">Historical sample · November 7, 2026</Badge></div>
          <div className="prospect-identity">
            <div><h2>Hivolts Electrical Inc</h2><p>hivoltselectrical.com <span>·</span> Brooklyn, NY</p></div>
            <div className="score-total"><span>OVERALL</span><strong>16 <small>/ 20</small></strong><Badge tone="green">Tier S</Badge></div>
          </div>
          <div className="score-section"><div className="section-label">SCORE FACTORS <span>0–5 each</span></div><ScoreFactors frame={frame} /></div>
          <div className="signal-inline"><span className="signal-pin" /><div><b>NYC DOB signal</b><span>Temporary power and generator-hoist work · Nov 1, 2026</span></div><span className="signal-id">B01483138-I1-EL</span></div>
        </section>
      </main>
      <ContextAside frame={frame}>
        <div className="aside-kicker"><span className="aside-icon">↗</span> PUBLIC SIGNAL</div>
        <h2>Worth a closer look.<br />Not proof of intent.</h2>
        <p className="aside-copy">DOB record <b>B01483138-I1-EL</b> describes temporary power / generator-hoist work dated November 1, 2026.</p>
        <div className="aside-rule" />
        <div className="aside-footnote"><span className="violet-dot" /> Public signal ≠ confirmed purchase intent</div>
      </ContextAside>
    </div>
  );
}

function MoveScene({ frame }: FrameProps) {
  const body = "Would it be useful to discuss electrical supply requirements for upcoming work?";
  const bodyProgress = reveal(frame, 52, 38);
  const generated = reveal(frame, 36, 14) > 0.9;
  const buttonScale = interpolate(frame, [28, 31, 35], [1, 0.96, 1], clamp);
  return (
    <div className="scene-grid">
      <main className="main-pane">
        <PageHeading
          eyebrow="SEER / Hivolts / EMAIL DRAFT"
          title="Make your move—with a draft you control."
          subtitle="Choose an available contact, review the source, then shape a focused first message."
        />
        <section className="surface-card email-card" style={itemStyle(frame, 12, 20)}>
          <div className="email-head">
            <div><span className="mini-label">EMAIL DRAFT</span><h2>Build a focused first draft.</h2></div>
            <button className={`draft-generate ${generated ? "draft-generate--ready" : ""}`} style={{ scale: buttonScale }} type="button">
              {generated ? "Draft prepared. Not sent." : "Generate draft"}
            </button>
          </div>
          <div className="email-field"><label>To</label><div className="recipient-inline"><strong>Moishy Rosman</strong><span>Operations Manager</span><span className="email-address">moishy@hivoltselectrical.com</span></div></div>
          <div className="email-field" style={itemStyle(frame, 42, 12)}><label>Subject</label><strong className="subject-line">Electrical supply coordination</strong></div>
          <div className="email-body" style={itemStyle(frame, 48, 12)}><p>Hi Moishy Rosman,</p><p>{typeText(body, bodyProgress)}{bodyProgress > 0 && bodyProgress < 1 && <span className="caret" />}</p></div>
          <div className="email-footer" style={itemStyle(frame, 88, 12)}><span className="violet-dot" /> Illustrative copy · Kliseer does not send this email.</div>
        </section>
      </main>
      <ContextAside frame={frame}>
        <div className="aside-kicker"><span className="aside-icon">@</span> AVAILABLE CONTACT</div>
        <h2>Moishy<br />Rosman</h2>
        <p className="contact-role">Operations Manager · Hivolts</p>
        <p className="contact-email">moishy@hivoltselectrical.com</p>
        <div className="provenance-tag"><span className="provenance-dot" /> Provider-supplied · not verified</div>
        <div className="aside-rule" />
        <div className="aside-footnote">Review the source and recipient before outreach.</div>
      </ContextAside>
    </div>
  );
}

function ChatScene({ frame }: FrameProps) {
  const answer = "Hivolts is a historical Tier S sample (16/20). The DOB record shows temporary power / generator-hoist work dated November 1, 2026; that signal does not confirm purchase intent. Target fit was 1/5 in this snapshot because company types were not specified. Verify the contact source before outreach.";
  const answerProgress = reveal(frame, 28, 48);
  return (
    <div className="scene-grid scene-grid--chat">
      <main className="main-pane">
        <PageHeading
          eyebrow="HOME / KLIESEER CHAT"
          title="Ask why this prospect—and what to verify."
          subtitle="The conversation stays grounded in the selected company, dated signal, score, and contact source."
        />
        <section className="surface-card chat-context-card" style={itemStyle(frame, 12, 18)}>
          <div className="chat-context-header"><span className="context-avatar">H</span><div><span className="mini-label">CURRENT PROSPECT</span><strong>Hivolts Electrical Inc</strong></div><Badge tone="green">Tier S</Badge></div>
          <div className="chat-context-stats"><div><span>Historical score</span><b>16 / 20 <small>· Nov 7, 2026</small></b></div><div><span>Signal date</span><b>Nov 1, 2026</b></div></div>
          <div className="chat-context-source"><span className="signal-pin" /><span>NYC DOB · B01483138-I1-EL · temporary power / generator-hoist work</span></div>
          <div className="chat-context-disclaimer">Public signal, not confirmed purchase intent.</div>
        </section>
      </main>
      <aside className="chat-aside" style={itemStyle(frame, 12, 18)}>
        <div className="chat-aside-header"><span className="chat-avatar">K</span><div><strong>Kliseer chat</strong><small>Prospect context</small></div><span className="chat-online" /></div>
        <div className="chat-messages">
          <div className="chat-user" style={itemStyle(frame, 18, 14)}>Why this prospect—and what should I verify before I reach out?</div>
          <div className="chat-assistant" style={itemStyle(frame, 32, 16)}>
            <span className="assistant-label">KLIESEER</span>
            <p>{typeText(answer, answerProgress)}{answerProgress > 0 && answerProgress < 1 && <span className="caret" />}</p>
          </div>
        </div>
        <div className="chat-composer"><span>Ask about this prospect…</span><span className="composer-send">↑</span></div>
      </aside>
    </div>
  );
}

function Filmstrip({ frame }: FrameProps) {
  const progress = interpolate(frame, [0, 600], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const activeIndex = scenes.findIndex((scene) => frame >= scene.start && frame < scene.end);
  return (
    <div className="filmstrip-wrap">
      <div className="filmstrip">
        {scenes.slice(0, 5).map((scene, index) => (
          <div className={`film-frame ${index === activeIndex ? "film-frame--active" : ""}`} key={scene.id}>
            <div className="film-perfs"><i /><i /><i /><i /><i /></div>
            <span className={`film-glyph film-glyph--${index}`} />
            <span className="film-label">{scene.label}</span>
            <div className="film-perfs film-perfs--bottom"><i /><i /><i /><i /><i /></div>
          </div>
        ))}
        <div className="film-playhead" style={{ left: `${progress}%` }}><span /></div>
      </div>
    </div>
  );
}

function OpeningContent({ frame }: FrameProps) {
  const appVisible = interpolate(frame, [0, 10, 552, 574], [0.72, 1, 1, 0], clamp);
  const titleProgress = reveal(frame, 562, 24);
  const titleLift = interpolate(titleProgress, [0, 1], [18, 0], clamp);
  const activeScenes = scenes.slice(0, 5);
  const ending = scenes[5];
  return (
    <AbsoluteFill className="canvas">
      <div className="canvas-mark canvas-mark--one" />
      <div className="canvas-mark canvas-mark--two" />
      <div className="app-window" style={{ opacity: appVisible, scale: 0.99 + appVisible * 0.01 }}>
        <WindowChrome />
        <div className="workspace">
          <Sidebar active={activeScenes.find((scene) => frame >= scene.start && frame < scene.end)?.activeNav ?? "Klise"} />
          <div className="scene-area">
            {activeScenes.map((scene, index) => {
              const style = sceneStyle(frame, scene);
              const localFrame = frame - scene.start;
              const components = [
                <CompanyScene key="company" frame={localFrame} />,
                <TargetScene key="target" frame={localFrame} />,
                <ProspectScene key="prospect" frame={localFrame} />,
                <MoveScene key="move" frame={localFrame} />,
                <ChatScene key="chat" frame={localFrame} />,
              ];
              return <div className="stage-layer" style={{ ...style, zIndex: index + 1 }} key={scene.id}>{components[index]}</div>;
            })}
          </div>
        </div>
      </div>
      <div className="filmstrip-layer" style={{ opacity: interpolate(frame, [0, 10, 552, 570], [0.45, 1, 1, 0], clamp) }}>
        <Filmstrip frame={frame} />
      </div>
      <div className="ending-card" style={{ ...sceneStyle(frame, ending), translate: `0px ${titleLift}px` }}>
        <BrandMark className="ending-logo" />
        <div className="ending-rule"><span /></div>
        <h1>Stop guessing.<br /><em>Start aiming.</em></h1>
        <p>Business context → target → signal → contact → conversation.</p>
        <span className="ending-label">KLIESEER · PROSPECT WORKSPACE</span>
      </div>
      <div className="frame-counter">KLIESEER / PRODUCT WALKTHROUGH</div>
    </AbsoluteFill>
  );
}

export const OpeningVideo = () => {
  const frame = useCurrentFrame();
  return <OpeningContent frame={frame} />;
};

export const OpeningStill = ({ frame }: FrameProps) => <OpeningContent frame={frame} />;
