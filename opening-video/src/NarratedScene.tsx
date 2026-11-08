import React from "react";
import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/fonts";

void loadFont({
  family: "Presentation Inter",
  url: staticFile("presentation/Inter-Variable.ttf"),
  weight: "100 900",
});
const c = {
  ink: "#202431",
  muted: "#5F6673",
  purple: "#6D28D9",
  tint: "#F3ECFF",
  soft: "#F6F8FA",
  line: "#E5E7EB",
  dark: "#302B49",
  green: "#207B55",
};
const ease = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.16, 1, 0.3, 1),
} as const;
type Cue = { text: string; seconds: number };
type Props = {
  slide: number;
  durationInFrames: number;
  title: string;
  section: string;
  cues: Cue[];
};

const Reveal: React.FC<{
  children: React.ReactNode;
  at?: number;
  style?: React.CSSProperties;
}> = ({ children, at = 0.2, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        opacity: interpolate(
          frame,
          [at * fps, (at + 0.65) * fps],
          [0, 1],
          ease,
        ),
        translate: interpolate(
          frame,
          [at * fps, (at + 0.65) * fps],
          ["0px 28px", "0px 0px"],
          ease,
        ),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
const Kicker: React.FC<{ children: React.ReactNode; light?: boolean }> = ({
  children,
  light,
}) => (
  <div
    style={{
      fontSize: 22,
      fontWeight: 750,
      letterSpacing: 3,
      color: light ? "#C4B5FD" : c.purple,
      textTransform: "uppercase",
      lineHeight: 1.3,
    }}
  >
    {children}
  </div>
);
const Badge: React.FC<{ children: React.ReactNode; green?: boolean }> = ({
  children,
  green,
}) => (
  <span
    style={{
      display: "inline-block",
      padding: "12px 19px",
      background: green ? "#E8F5EE" : c.tint,
      color: green ? c.green : c.purple,
      fontWeight: 700,
      fontSize: 21,
      lineHeight: 1.2,
    }}
  >
    {children}
  </span>
);
const Panel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      padding: 38,
      background: c.soft,
      border: `1px solid ${c.line}`,
      borderRadius: 10,
      ...style,
    }}
  >
    {children}
  </div>
);
const Title: React.FC<{
  children: React.ReactNode;
  size?: number;
  light?: boolean;
}> = ({ children, size = 72, light }) => (
  <h1
    style={{
      margin: 0,
      fontSize: size,
      lineHeight: 1.07,
      letterSpacing: -3,
      fontWeight: 740,
      color: light ? "white" : c.ink,
    }}
  >
    {children}
  </h1>
);
const Body: React.FC<{
  children: React.ReactNode;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 34, style }) => (
  <div style={{ fontSize: size, lineHeight: 1.43, color: c.muted, ...style }}>
    {children}
  </div>
);
const TypeLine: React.FC<{
  text: string;
  at: number;
  seconds?: number;
  style?: React.CSSProperties;
}> = ({ text, at, seconds = 2, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const count = Math.floor(
    interpolate(frame, [at * fps, (at + seconds) * fps], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  return (
    <div style={{ whiteSpace: "pre-wrap", ...style }}>
      {text.slice(0, count)}
    </div>
  );
};
const Header: React.FC<{ slide: number; section: string; dark: boolean }> = ({
  slide,
  section,
  dark,
}) => (
  <>
    <div
      style={{
        position: "absolute",
        left: 100,
        top: 48,
        background: dark ? "white" : "transparent",
        padding: dark ? "10px 14px" : 0,
      }}
    >
      <CanvasImage
        src={staticFile("presentation/logo.png")}
        style={{
          display: "block",
          width: 185,
          height: 55,
          objectFit: "contain",
        }}
      />
    </div>
    <div
      style={{
        position: "absolute",
        right: 100,
        top: 66,
        fontSize: 18,
        letterSpacing: 2,
        color: dark ? "#DDD7ED" : c.muted,
      }}
    >
      VULTR AGENT RUSH / FUTURE OF WORK
    </div>
    <div
      style={{
        position: "absolute",
        left: 100,
        right: 100,
        bottom: 26,
        display: "flex",
        justifyContent: "space-between",
        fontSize: 16,
        letterSpacing: 2,
        color: dark ? "#DDD7ED" : c.muted,
      }}
    >
      <span>{section}</span>
      <span>{String(slide).padStart(2, "0")} / 12</span>
    </div>
  </>
);
const Progress: React.FC<{ duration: number; dark: boolean }> = ({
  duration,
  dark,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 100,
        right: 100,
        bottom: 57,
        height: 3,
        background: dark ? "#514866" : c.line,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${interpolate(frame, [0, duration - 1], [0, 100])}%`,
          background: dark ? "#C4B5FD" : c.purple,
        }}
      />
    </div>
  );
};
const SceneFade: React.FC<{ duration: number; children: React.ReactNode }> = ({
  duration,
  children,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(
          frame,
          [0, 10, duration - 10, duration - 1],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        ),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
const Intro = () => (
  <>
    <Reveal at={0.15}>
      <Kicker>Evidence-led sales prospecting</Kicker>
    </Reveal>
    <Reveal at={0.6} style={{ marginTop: 40, width: 1400 }}>
      <Title size={110}>
        From public signals
        <br />
        to a smarter
        <br />
        <span style={{ color: c.purple }}>first move.</span>
      </Title>
    </Reveal>
    <Reveal at={3.1} style={{ marginTop: 42 }}>
      <Body size={36}>For building-material and electrical suppliers.</Body>
    </Reveal>
    <Reveal at={6.2} style={{ position: "absolute", right: 0, top: 180 }}>
      <CanvasImage
        src={staticFile("presentation/icon.png")}
        style={{ width: 300, height: 300 }}
      />
    </Reveal>
  </>
);
const Problem: React.FC<{
  cue: (text: string, fallback: number) => number;
}> = ({ cue }) => (
  <>
    <Reveal>
      <Title>
        A prospect list is not
        <br />a reason to reach out.
      </Title>
    </Reveal>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 50,
        marginTop: 76,
      }}
    >
      <Reveal at={1.2}>
        <Kicker>01 / Context</Kicker>
        <h2 style={{ fontSize: 42, margin: "26px 0" }}>What do we sell?</h2>
        <Body>
          Products, regions,
          <br />
          and the buyers we serve.
        </Body>
      </Reveal>
      <Reveal at={cue("which companies", 3.2)}>
        <Kicker>02 / Evidence</Kicker>
        <h2 style={{ fontSize: 42, margin: "26px 0" }}>What happened?</h2>
        <Body>
          Dated public activity,
          <br />
          with a source to inspect.
        </Body>
      </Reveal>
      <Reveal at={cue("A public permit", 7)}>
        <Kicker>03 / Decision</Kicker>
        <h2 style={{ fontSize: 42, margin: "26px 0" }}>Why reach out?</h2>
        <Body>
          A defensible next step,
          <br />
          not assumed demand.
        </Body>
      </Reveal>
    </div>
    <Reveal at={cue("without pretending", 13)} style={{ marginTop: 64 }}>
      <Badge>Activity is not buying intent.</Badge>
    </Reveal>
  </>
);
const Solution: React.FC<{
  cue: (text: string, fallback: number) => number;
}> = ({ cue }) => (
  <>
    <Reveal>
      <Title>
        Klise understands you.
        <br />
        Seer finds the signal.
      </Title>
    </Reveal>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 32,
        marginTop: 48,
      }}
    >
      <Reveal at={cue("Klise helps", 1.3)}>
        <Panel style={{ background: c.tint, height: 300 }}>
          <Kicker>Klise / Seller context</Kicker>
          <h2 style={{ fontSize: 45, margin: "30px 0 18px" }}>
            A reviewed company profile.
          </h2>
          <Body>Company · ICP · Target criteria</Body>
        </Panel>
      </Reveal>
      <Reveal at={cue("Seer surfaces", 7)}>
        <Panel style={{ height: 300 }}>
          <Kicker>Seer / Prospect evidence</Kicker>
          <h2 style={{ fontSize: 45, margin: "30px 0 18px" }}>
            A reason to look closer.
          </h2>
          <Body>Signals · Scores · Sourced contacts</Body>
        </Panel>
      </Reveal>
    </div>
    <Reveal at={cue("From there", 11)} style={{ marginTop: 36 }}>
      <Body style={{ color: c.purple, fontWeight: 650 }}>
        Shared chat. Editable outreach. Human review.
      </Body>
    </Reveal>
  </>
);
const Profile: React.FC<{
  cue: (text: string, fallback: number) => number;
}> = ({ cue }) => (
  <>
    <Reveal>
      <Kicker>01 / Understand the seller</Kicker>
      <div style={{ marginTop: 23 }}>
        <Title>Start with the business you know.</Title>
      </div>
    </Reveal>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "650px 1fr",
        gap: 50,
        marginTop: 48,
      }}
    >
      <Reveal at={0.7}>
        <Badge>Fictional seller study case</Badge>
        <h2 style={{ fontSize: 56, lineHeight: 1.1, margin: "34px 0" }}>
          Harborline
          <br />
          Electrical Supply
        </h2>
        <Body>NY / NJ electrical distributor</Body>
        <div style={{ marginTop: 40 }}>
          <Body>
            Upload or describe.
            <br />
            Review before approval.
          </Body>
        </div>
      </Reveal>
      <Reveal at={cue("The seller can upload", 5)}>
        <Panel style={{ height: 495, background: "white" }}>
          <Kicker>Illustrative editable profile</Kicker>
          <div style={{ marginTop: 24, borderTop: `1px solid ${c.line}` }}>
            {[
              ["Company", "Harborline Electrical Supply"],
              ["Products", "Generators · Switchboards · ATS"],
              ["Service region", "New York · New Jersey"],
            ].map(([key, value], i) => (
              <Reveal
                key={key}
                at={cue("Klise prepares", 9) + i * 0.65}
                style={{
                  padding: "17px 0",
                  borderBottom: `1px solid ${c.line}`,
                }}
              >
                <div style={{ fontSize: 19, color: c.muted, marginBottom: 7 }}>
                  {key}
                </div>
                <div style={{ fontSize: 30, fontWeight: 600 }}>{value}</div>
              </Reveal>
            ))}
          </div>
          <Reveal at={cue("Each setup", 14)} style={{ marginTop: 23 }}>
            <Badge>Review each section before approval</Badge>
          </Reveal>
        </Panel>
      </Reveal>
    </div>
  </>
);
const Discovery: React.FC<{
  cue: (text: string, fallback: number) => number;
}> = ({ cue }) => (
  <>
    <Reveal>
      <Kicker>02 / Find relevant prospects</Kicker>
      <div style={{ marginTop: 23 }}>
        <Title>Turn public activity into a shortlist.</Title>
      </div>
    </Reveal>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "540px 1fr",
        gap: 70,
        marginTop: 54,
      }}
    >
      <Reveal at={0.7}>
        <Panel style={{ background: c.tint, height: 380 }}>
          <Kicker>Public permit sources</Kicker>
          <div
            style={{
              fontSize: 48,
              fontWeight: 650,
              lineHeight: 1.6,
              marginTop: 27,
            }}
          >
            New York City
            <br />
            Austin
            <br />
            Seattle
          </div>
        </Panel>
      </Reveal>
      <div>
        <Kicker>Rule-based prioritization</Kicker>
        {[
          ["Keyword match", "Relevant product terms"],
          ["Freshness", "Recency of activity"],
          ["Place", "Seller and target regions"],
          ["Target fit", "Configured company types"],
        ].map(([name, desc], i) => (
          <Reveal
            key={name}
            at={cue("then applies", 5) + i * 0.55}
            style={{
              display: "grid",
              gridTemplateColumns: "295px 1fr",
              gap: 20,
              padding: "19px 0",
              borderBottom: `1px solid ${c.line}`,
            }}
          >
            <strong style={{ fontSize: 32 }}>{name}</strong>
            <span style={{ fontSize: 30, color: c.muted }}>{desc}</span>
          </Reveal>
        ))}
      </div>
    </div>
    <Reveal at={cue("The language model", 13)} style={{ marginTop: 34 }}>
      <Badge>The LLM does not assign scores or tiers.</Badge>
    </Reveal>
  </>
);
const Evidence: React.FC<{
  cue: (text: string, fallback: number) => number;
}> = ({ cue }) => (
  <>
    <Reveal>
      <Kicker>03 / Inspect the evidence</Kicker>
      <div style={{ marginTop: 23 }}>
        <Title>Show the reason behind the priority.</Title>
      </div>
    </Reveal>
    <Reveal at={0.5} style={{ marginTop: 28 }}>
      <Badge>Historical snapshot / November 7, 2026</Badge>
    </Reveal>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "700px 1fr",
        gap: 60,
        marginTop: 28,
      }}
    >
      <Panel style={{ height: 355 }}>
        <h2 style={{ fontSize: 40, margin: "0 0 10px" }}>
          Hivolts Electrical Inc
        </h2>
        <Body size={27}>Brooklyn, New York</Body>
        <Reveal
          at={cue("In the November", 3)}
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 20,
            marginTop: 14,
          }}
        >
          <span
            style={{
              fontSize: 142,
              fontWeight: 760,
              color: c.purple,
              lineHeight: 1,
            }}
          >
            16
          </span>
          <span style={{ fontSize: 48, color: c.muted }}>/ 20</span>
          <Badge green>Tier S</Badge>
        </Reveal>
        <Reveal
          at={cue("Target fit", 17)}
          style={{ fontSize: 22, marginTop: 21, color: c.muted }}
        >
          Keyword 5 · Freshness 5 · Place 5 · Target fit 1
        </Reveal>
      </Panel>
      <Reveal at={cue("The cited", 7)}>
        <Kicker>Dated public signal</Kicker>
        <h2 style={{ fontSize: 48, lineHeight: 1.16, margin: "28px 0" }}>
          Temporary power and
          <br />
          generator-hoist work.
        </h2>
        <Body size={28}>
          NYC DOB · November 1, 2026
          <br />
          Record B01483138-I1-EL
        </Body>
      </Reveal>
    </div>
    <Reveal at={cue("not a confirmed", 13)} style={{ marginTop: 28 }}>
      <Body size={31} style={{ color: c.purple, fontWeight: 650 }}>
        Relevant to investigate. Not a confirmed purchase.
      </Body>
    </Reveal>
  </>
);
const Outreach: React.FC<{
  cue: (text: string, fallback: number) => number;
}> = ({ cue }) => (
  <>
    <Reveal>
      <Kicker>04 / Prepare the first conversation</Kicker>
      <div style={{ marginTop: 23 }}>
        <Title>A next step you can review.</Title>
      </div>
    </Reveal>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "640px 1fr",
        gap: 60,
        marginTop: 50,
      }}
    >
      <div>
        <Reveal at={0.6}>
          <Title size={60}>Not autopilot.</Title>
          <div style={{ marginTop: 35 }}>
            <Body>
              Check the contact.
              <br />
              Inspect its source.
              <br />
              Edit the message.
            </Body>
          </div>
        </Reveal>
        <Reveal at={cue("Provider-supplied", 12)} style={{ marginTop: 40 }}>
          <Badge>Sourced does not mean verified.</Badge>
        </Reveal>
      </div>
      <Reveal at={cue("Kliseer can then", 4)}>
        <Panel style={{ background: "white", height: 495 }}>
          <Kicker>Illustrative first-touch draft</Kicker>
          <div
            style={{
              fontSize: 25,
              marginTop: 25,
              paddingBottom: 18,
              borderBottom: `1px solid ${c.line}`,
            }}
          >
            Subject: Electrical supply coordination
          </div>
          <TypeLine
            at={cue("Kliseer can then", 4) + 0.7}
            seconds={3.2}
            text={
              "Hello,\n\nWe supply electrical equipment for upcoming work. Would a short discussion about your requirements be useful?\n\nHarborline Electrical Supply"
            }
            style={{ fontSize: 28, lineHeight: 1.43, marginTop: 22 }}
          />
          <Reveal at={cue("does not send", 9)} style={{ marginTop: 22 }}>
            <Badge green>Prepared for review. Not sent.</Badge>
          </Reveal>
        </Panel>
      </Reveal>
    </div>
  </>
);
const Chat: React.FC<{ cue: (text: string, fallback: number) => number }> = ({
  cue,
}) => (
  <>
    <Reveal>
      <Kicker>05 / Ask against the evidence</Kicker>
      <div style={{ marginTop: 23 }}>
        <Title>Ask questions against your workspace.</Title>
      </div>
    </Reveal>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "650px 1fr",
        gap: 50,
        marginTop: 50,
      }}
    >
      <Reveal at={0.7}>
        <Body size={40} style={{ fontWeight: 650, color: c.ink }}>
          Compare candidates.
          <br />
          Find available contacts.
          <br />
          Spot research gaps.
        </Body>
        <div style={{ marginTop: 45 }}>
          <Body size={29}>
            Context: seller profile,
            <br />
            top Seer prospects, and
            <br />
            sourced contact records.
          </Body>
        </div>
      </Reveal>
      <Panel style={{ height: 400, background: "white" }}>
        <Kicker>Illustrative chat / Historical example</Kicker>
        <Reveal
          at={cue("A rep can compare", 5)}
          style={{
            background: c.purple,
            color: "white",
            padding: 24,
            borderRadius: 8,
            fontSize: 29,
            marginTop: 27,
          }}
        >
          Why should I look at Hivolts?
        </Reveal>
        <Reveal
          at={cue("A rep can compare", 5) + 2}
          style={{
            background: c.tint,
            padding: 24,
            borderRadius: 8,
            fontSize: 27,
            lineHeight: 1.42,
            marginTop: 18,
          }}
        >
          The Nov 7 snapshot shows Tier S, 16/20. A dated permit suggests
          relevant electrical work—not confirmed buying intent. Verify the
          contact before outreach.
        </Reveal>
      </Panel>
    </div>
    <Reveal at={cue("Missing details", 12)} style={{ marginTop: 31 }}>
      <Badge>Missing contact details stay missing.</Badge>
    </Reveal>
  </>
);
const Technology: React.FC<{
  cue: (text: string, fallback: number) => number;
}> = ({ cue }) => (
  <>
    <Reveal>
      <Kicker>Built on Vultr</Kicker>
      <div style={{ marginTop: 23 }}>
        <Title>Vultr powers the working system.</Title>
      </div>
      <div style={{ marginTop: 25 }}>
        <Body>Compute. Persistent data. Inference.</Body>
      </div>
    </Reveal>
    <div style={{ marginTop: 48 }}>
      {[
        [
          "Cloud Compute",
          "Next.js app, workflows, scheduled ingestion",
          "Cloud Compute",
          3,
        ],
        [
          "Supabase on Marketplace",
          "Postgres: profiles, chat, companies, signals",
          "Supabase",
          9,
        ],
        [
          "Serverless Inference",
          "AI-assisted setup, responses, outreach drafts",
          "Serverless",
          15,
        ],
      ].map(([name, desc, term, fallback]) => (
        <Reveal
          key={name}
          at={cue(String(term), Number(fallback))}
          style={{
            display: "grid",
            gridTemplateColumns: "650px 1fr",
            gap: 40,
            padding: "28px 0",
            borderBottom: `1px solid ${c.line}`,
          }}
        >
          <strong style={{ fontSize: 37 }}>{name}</strong>
          <span style={{ fontSize: 32, color: c.muted }}>{desc}</span>
        </Reveal>
      ))}
    </div>
    <Reveal at={cue("important separation", 21)} style={{ marginTop: 36 }}>
      <Badge>
        Application rules calculate scores. The model interprets and drafts.
      </Badge>
    </Reveal>
  </>
);
const Boundaries: React.FC<{
  cue: (text: string, fallback: number) => number;
}> = ({ cue }) => (
  <>
    <Reveal>
      <Kicker>Trust by design</Kicker>
      <div style={{ marginTop: 23 }}>
        <Title>Useful AI has clear boundaries.</Title>
      </div>
    </Reveal>
    <div style={{ marginTop: 56 }}>
      {[
        ["Relevance score", "Buying intent", "A relevance", 1],
        ["Sourced contact", "Verified contact", "A sourced", 4],
        ["Generated draft", "Sent email", "a generated", 8],
      ].map(([left, right, term, fallback]) => (
        <Reveal
          key={left}
          at={cue(String(term), Number(fallback))}
          style={{
            display: "grid",
            gridTemplateColumns: "700px 100px 1fr",
            padding: "30px 0",
            borderBottom: `1px solid ${c.line}`,
            alignItems: "center",
          }}
        >
          <strong style={{ fontSize: 44 }}>{left}</strong>
          <span style={{ fontSize: 60, color: c.purple, fontWeight: 700 }}>
            ≠
          </span>
          <span style={{ fontSize: 42, color: c.muted }}>{right}</span>
        </Reveal>
      ))}
    </div>
    <Reveal at={cue("keeps review", 13)} style={{ marginTop: 38 }}>
      <Body size={39} style={{ color: c.purple, fontWeight: 650 }}>
        The seller keeps the final decision.
      </Body>
    </Reveal>
  </>
);
const Value: React.FC<{ cue: (text: string, fallback: number) => number }> = ({
  cue,
}) => (
  <>
    <Reveal>
      <Kicker>Business value</Kicker>
      <div style={{ marginTop: 23 }}>
        <Title>
          A clearer decision.
          <br />
          Not just more data.
        </Title>
      </div>
    </Reveal>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 45,
        marginTop: 54,
      }}
    >
      {[
        ["Focused research", "Seller products\nand service regions"],
        ["Defensible priorities", "Dated evidence\nand visible score factors"],
        ["Relevant first contact", "Outreach with context\na rep can review"],
      ].map(([name, desc], i) => (
        <Reveal key={name} at={1 + i * 1.6}>
          <Kicker>0{i + 1}</Kicker>
          <h2 style={{ fontSize: 40, margin: "26px 0 20px" }}>{name}</h2>
          <Body size={30} style={{ whiteSpace: "pre-line" }}>
            {desc}
          </Body>
        </Reveal>
      ))}
    </div>
    <Reveal at={cue("We are not claiming", 7)} style={{ marginTop: 46 }}>
      <Panel style={{ padding: "23px 30px" }}>
        <Kicker>Next to validate — not measured results</Kicker>
        <div style={{ fontSize: 28, marginTop: 15 }}>
          Time to reviewed shortlist · Evidence accuracy · Draft usefulness
        </div>
      </Panel>
    </Reveal>
  </>
);
const Close = () => (
  <>
    <Reveal>
      <Kicker light>Kliseer</Kicker>
    </Reveal>
    <Reveal at={0.7} style={{ marginTop: 45 }}>
      <Title size={108} light>
        Know why.
        <br />
        Then make your move.
      </Title>
    </Reveal>
    <Reveal at={4} style={{ marginTop: 46 }}>
      <Body size={40} style={{ color: "#DDD7ED" }}>
        Seller context. Public evidence. Human judgment.
      </Body>
    </Reveal>
    <Reveal at={7.5} style={{ marginTop: 61 }}>
      <div style={{ fontSize: 26, color: "white", marginBottom: 14 }}>
        Explore the demo
      </div>
      <div style={{ fontSize: 36, color: "#C4B5FD" }}>
        https://64-177-42-81.sslip.io
      </div>
    </Reveal>
  </>
);
export const NarratedScene: React.FC<Props> = ({
  slide,
  durationInFrames,
  section,
  cues,
}) => {
  const dark = slide === 12;
  const cue = (needle: string, fallback: number) =>
    cues.find((c) => c.text.toLowerCase().includes(needle.toLowerCase()))
      ?.seconds ?? fallback;
  return (
    <AbsoluteFill
      style={{
        fontFamily: "Presentation Inter, Inter, Arial, sans-serif",
        background: dark ? c.dark : "white",
        color: c.ink,
      }}
    >
      <Header slide={slide} section={section} dark={dark} />
      <SceneFade duration={durationInFrames}>
        <div
          data-presentation-content
          style={{
            position: "absolute",
            left: 100,
            top: 165,
            width: 1720,
            height: 680,
          }}
        >
          {slide === 1 ? (
            <Intro />
          ) : slide === 2 ? (
            <Problem cue={cue} />
          ) : slide === 3 ? (
            <Solution cue={cue} />
          ) : slide === 4 ? (
            <Profile cue={cue} />
          ) : slide === 5 ? (
            <Discovery cue={cue} />
          ) : slide === 6 ? (
            <Evidence cue={cue} />
          ) : slide === 7 ? (
            <Outreach cue={cue} />
          ) : slide === 8 ? (
            <Chat cue={cue} />
          ) : slide === 9 ? (
            <Technology cue={cue} />
          ) : slide === 10 ? (
            <Boundaries cue={cue} />
          ) : slide === 11 ? (
            <Value cue={cue} />
          ) : (
            <Close />
          )}
        </div>
      </SceneFade>
      <Progress duration={durationInFrames} dark={dark} />
    </AbsoluteFill>
  );
};
