const fs = require('node:fs');
const path = require('node:path');
const PptxGenJS = require('pptxgenjs');
const sharp = require('sharp');
const content = require('./content.json');
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.resolve(__dirname, '..');
const ASSETS = path.join(OUT, 'assets');
const C = { paper:'FFFFFF', ink:'202431', muted:'5F6673', line:'E5E7EB', purple:'6D28D9', tint:'F3ECFF', soft:'F6F8FA', dark:'302B49', green:'207B55', greenTint:'E8F5EE', lavender:'C4B5FD', darkMuted:'DDD7ED', darkRule:'514866' };
const TYPE = { display:'Sora SemiBold', body:'Inter Presentation' };
const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Kliseer';
pptx.subject = 'Vultr Agent Rush — Powering the Future of Work';
pptx.title = 'Kliseer — Know why. Then make your move.';
pptx.company = 'Kliseer';
pptx.lang = 'en-US';
pptx.theme = { headFontFace:TYPE.display, bodyFontFace:TYPE.body, lang:'en-US' };
let objectIndex=0;
const manifest=[];
const time = sec => `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
function text(s, str, x, y, w, h, size = 20, color = C.ink, bold = false, opts = {}) {
  s.addText(str, { x, y, w, h, fontFace:TYPE.body, fontSize:size, color, bold, margin:0,
    valign:'top', fit:'none', paraSpaceAfterPt:0, lang:'en-US',
    objectName:`text-${++objectIndex}`, ...opts });
}
function display(s, str, x, y, w, h, size, color = C.ink) {
  text(s,str,x,y,w,h,size,color,false,{fontFace:TYPE.display,charSpacing:-.35});
}
function rect(s, x, y, w, h, fill = C.soft, stroke = fill) {
  s.addShape(pptx.ShapeType.rect, { x, y, w, h, fill:{color:fill},
    line:{color:stroke,width:0.6}, objectName:`panel-${++objectIndex}` });
}
function rule(s, x, y, w, color = C.line) {
  s.addShape(pptx.ShapeType.line, { x, y, w, h:0,
    line:{color,width:0.8}, objectName:`rule-${++objectIndex}` });
}
function tag(s, str, x, y, w, fill = C.tint, color = C.purple) {
  rect(s,x,y,w,.4,fill);
  text(s,str,x+.13,y+.085,w-.26,.24,10.5,color,true);
}
function base(n, theme = 'light') {
  const dark = theme !== 'light';
  const s = pptx.addSlide();
  s.background = {color:theme === 'violet' ? C.purple : dark ? C.dark : C.paper};
  if (dark) rect(s,.62,.43,1.66,.59,C.paper);
  s.addImage({path:path.join(ASSETS,'logo.png'),x:dark?.72:.64,y:dark?.52:.48,
    w:1.46,h:.432,altText:'Kliseer official logo'});
  text(s,`${String(n).padStart(2,'0')} / 12`,11.56,7.08,1.1,.24,10,
    dark?C.darkMuted:C.muted,false,{align:'right'});
  text(s,content[n-1].section,.65,7.09,9.7,.23,9,dark?C.darkMuted:C.muted,false,{charSpacing:1});
  const start = content.slice(0,n-1).reduce((a,b)=>a+b.duration,0);
  const item = content[n-1];
  s.addNotes(`SLIDE ${n} — ${item.title}\nTIMING: ${time(start)}–${time(start+item.duration)} (${item.duration} seconds)\n\nSAY:\n${item.narration}\n\nRECORDING CUE (DO NOT READ ALOUD):\n${item.cue}\n\nSOURCE / DISCLOSURE:\n${item.sources.join('\n')}`);
  manifest.push({slide:n,title:item.title,start,end:start+item.duration,duration:item.duration});
  return s;
}
async function main() {
  fs.mkdirSync(ASSETS,{recursive:true});
  await sharp(path.join(ROOT,'logo-concepts/kliseer-lockup.svg'),{density:180}).trim().png().toFile(path.join(ASSETS,'logo.png'));
  await sharp(path.join(ROOT,'public/brand/kliseer-icon.svg'),{density:300}).png().toFile(path.join(ASSETS,'icon.png'));
  await sharp(path.join(ROOT,'opening-video/review-01-company.png')).extract({left:370,top:284,width:1020,height:435}).png().toFile(path.join(ASSETS,'company.png'));
  await sharp(path.join(ROOT,'opening-video/review-04-move.png')).extract({left:370,top:285,width:1020,height:455}).png().toFile(path.join(ASSETS,'outreach.png'));
  await sharp(path.join(ROOT,'opening-video/review-05-chat.png')).extract({left:1430,top:245,width:360,height:300}).png().toFile(path.join(ASSETS,'chat.png'));
  // A typographic opening, using the existing brand rather than decorative imagery.
  {
    const s=base(1,'dark');
    text(s,'Vultr Agent Rush\nPowering the Future of Work',9.3,.51,3.38,.62,12,C.darkMuted,false,{align:'right'});
    display(s,'From public signals',.65,1.73,12,1.06,50,C.paper);
    display(s,'to a smarter',.65,2.91,11,1.06,50,C.paper);
    display(s,'first move.',.65,4.0,10.4,1.47,72,C.lavender);
    rule(s,.65,5.89,12.03,C.darkRule);
    text(s,'For building-material and\nelectrical suppliers.',.65,6.14,6.5,.72,21,C.darkMuted);
    text(s,'Know why.\nThen make your move.',8.62,6.16,4.06,.68,19,C.paper,true,{align:'right'});
  }
  // An asymmetric research brief: the central problem and the three questions.
  {
    const s=base(2);
    display(s,'A prospect list\nis not a reason\nto reach out.',.65,1.63,6.62,2.72,41);
    text(s,'The missing link is context—\nnot another list of names.',.65,5.15,5.94,1.0,25,C.purple,true);
    const questions=[
      ['What do we sell?','Products, service regions,\nand the buyers we serve.'],
      ['What happened?','Dated public activity,\nwith a source to inspect.'],
      ['Why reach out?','A relevant next step,\nnot an assumption of demand.']
    ];
    questions.forEach(([title,body],i)=>{
      const y=1.71+i*1.62;
      rule(s,7.75,y-.15,4.93);
      text(s,title,7.75,y+.06,4.93,.54,25,C.ink,true);
      text(s,body,7.75,y+.74,4.93,.72,18,C.muted);
    });
  }
  // The two product roles share one surface; no repeated card grid.
  {
    const s=base(3,'dark');
    display(s,'Klise',.65,1.6,5.52,1.35,72,C.paper);
    display(s,'understands you.',.68,3.02,5.55,.63,27,C.lavender);
    text(s,'Company materials become\na reviewed profile.',.68,4.09,5.6,1.02,24,C.paper);
    text(s,'Company  ·  ICP  ·  Target criteria',.68,5.35,5.6,.4,16,C.darkMuted);
    s.addShape(pptx.ShapeType.line,{x:6.52,y:1.69,w:0,h:4.15,line:{color:C.darkRule,width:1}});
    display(s,'Seer',7.1,1.6,5.58,1.35,72,C.paper);
    display(s,'finds the signal.',7.13,3.02,5.55,.63,27,C.lavender);
    text(s,'Public signals become\na reason to look closer.',7.13,4.09,5.55,1.02,24,C.paper);
    text(s,'Signals  ·  Scores  ·  Sourced contacts',7.13,5.35,5.55,.4,16,C.darkMuted);
    rule(s,.65,6.12,12.03,C.darkRule);
    text(s,'Shared chat and editable outreach. Human review throughout.',.65,6.37,12,.39,19,C.paper);
  }
  // Native editable reconstruction of the existing illustrative company walkthrough.
  {
    const s=base(4);
    display(s,'Start with the business\nyou already know.',.65,1.38,8.45,1.42,36.5);
    text(s,'Harborline\nElectrical Supply',9.31,1.47,3.37,.8,22,C.ink,true);
    text(s,'Fictional seller study case\nNY / NJ electrical distributor',9.31,2.43,3.37,.62,12.5,C.muted);
    rect(s,.65,3.37,5.93,3.4,C.soft,C.line);
    text(s,'Company background',.96,3.7,5.31,.47,22,C.ink,true);
    const files=[['MD','company-overview.md','Company overview'],['PDF','product-catalog.pdf','Product catalog']];
    files.forEach(([type,name,description],i)=>{
      const y=4.42+i*.86;
      rule(s,.96,y-.16,5.31);
      text(s,type,.96,y+.06,.67,.34,12.5,C.muted,true);
      text(s,name,1.77,y,3.45,.37,16,C.ink,true);
      text(s,description,1.77,y+.43,3.45,.28,12,C.muted);
      tag(s,'Ready',5.29,y,.98,C.greenTint,C.green);
    });
    text(s,'Drafts need your review before saving.',.96,6.37,5.31,.29,13,C.muted);
    rect(s,6.88,3.37,5.8,3.4,C.paper,C.line);
    text(s,'Company name',7.21,3.7,3.48,.47,22,C.ink,true);
    tag(s,'Review draft',10.9,3.72,1.47);
    text(s,'Suggested name',7.21,4.41,5.13,.3,13,C.muted);
    rect(s,7.21,4.9,5.13,.59,C.tint,C.lavender);
    text(s,'Harborline Electrical Supply',7.4,5.055,4.75,.33,16,C.ink,true);
    text(s,'Quoted from company-overview.md',7.21,5.76,5.13,.31,12.5,C.muted);
    text(s,'Fictional seller example. Original files are not retained.',7.21,6.33,5.13,.34,11.5,C.muted);
    text(s,'Upload or describe. Review before approval.',.65,2.86,8.4,.32,16.5,C.purple,true);
  }
  // Sources and scoring are deliberately distinct visual groups.
  {
    const s=base(5);
    display(s,'Turn public activity\ninto a shortlist.',.65,1.36,11.6,1.5,41);
    rect(s,.65,3.25,3.58,3.35,C.purple);
    text(s,'New York City\nAustin\nSeattle',.94,3.66,3.05,1.97,28,C.paper,true,{paraSpaceAfterPt:13});
    text(s,'Public permit sources',.94,6.02,3.05,.38,13.5,C.paper);
    const rows=[['Keyword match','Relevant product terms'],['Freshness','How recent the signal is'],['Place','Seller and target regions'],['Target fit','Configured company-type match']];
    rows.forEach(([name,body],i)=>{
      const y=3.37+i*.66;
      rule(s,4.87,y-.12,7.81);
      text(s,name,4.87,y,2.76,.4,20,C.ink,true);
      text(s,body,7.99,y+.035,4.69,.44,16.5,C.muted);
    });
    text(s,'Scores and tiers are computed by rules—not the LLM.',4.87,6.26,7.81,.48,17,C.purple,true);
  }
  // Evidence leads the case study; the score is presented alongside its limits.
  {
    const s=base(6,'dark');
    display(s,'Show the evidence\nbehind the priority.',.65,1.39,12,1.41,37,C.paper);
    text(s,'Hivolts Electrical Inc',.65,3.14,5.2,.51,25,C.paper,true);
    text(s,'Brooklyn, New York',.65,3.75,5.2,.34,16,C.darkMuted);
    text(s,'16 / 20',.65,4.29,3.15,.84,42,C.lavender,true);
    tag(s,'TIER S',4.13,4.58,1.23,C.greenTint,C.green);
    const factors=[['Keyword','5 / 5'],['Freshness','5 / 5'],['Place','5 / 5'],['Target fit','1 / 5']];
    factors.forEach(([factor,value],i)=>{
      const y=5.28+i*.31;
      text(s,factor,.65,y,3.5,.28,13.5,C.darkMuted);
      text(s,value,4.13,y,1.23,.28,13.5,C.paper,true,{align:'right'});
    });
    rect(s,6.04,3.14,6.64,3.57,C.paper);
    display(s,'Temporary power and\ngenerator-hoist work.',6.38,3.52,5.96,1.12,27);
    text(s,'NYC DOB  ·  November 1, 2026',6.38,4.9,5.96,.39,17,C.muted);
    text(s,'Record B01483138-I1-EL',6.38,5.4,5.96,.35,14,C.muted);
    text(s,'Open public source',6.38,6.08,3.5,.36,16,C.purple,true,{hyperlink:{url:content[5].sources[2]}});
    text(s,'Historical snapshot · Nov 7, 2026. Relevance is not confirmed purchase intent.',.65,6.8,12,.23,10.5,C.darkMuted);
  }
  // Native editable email illustration, enlarged from the original walkthrough.
  {
    const s=base(7);
    display(s,'A next step\nyou can review.',.65,1.53,5.15,1.87,37);
    display(s,'Not autopilot.',.65,3.53,5.15,.8,33);
    text(s,'Check the contact.\nInspect its source.\nEdit the message.',.65,4.62,4.85,1.24,21,C.ink,false,{paraSpaceAfterPt:7});
    text(s,'Provider-supplied details\nare not verified contacts.',.65,6.2,4.85,.66,16,C.muted);
    rect(s,6.04,1.49,6.64,5.31,C.soft,C.line);
    text(s,'Build a focused first draft.',6.39,1.86,5.94,.53,23,C.ink,true);
    tag(s,'Prepared. Not sent.',6.39,2.53,2.39,C.greenTint,C.green);
    rule(s,6.39,3.19,5.94);
    text(s,'To',6.39,3.39,.46,.3,13,C.muted);
    text(s,'Moishy Rosman',7.02,3.35,5.3,.36,17,C.ink,true);
    text(s,'Operations Manager · Provider-supplied, unverified',7.02,3.83,5.3,.29,11,C.muted);
    text(s,'Electrical supply coordination',6.39,4.45,5.94,.44,19,C.ink,true);
    text(s,'Hi Moishy Rosman,\n\nWould it be useful to discuss electrical supply requirements for upcoming work?',6.39,5.09,5.94,1.32,18,C.muted);
    text(s,'Illustrative copy · Kliseer does not send this email.',6.39,6.46,5.94,.23,10,C.muted);
  }
  // A conversational composition, with an editable and legible evidence response.
  {
    const s=base(8,'dark');
    display(s,'Ask questions\nagainst your\nworkspace.',.65,1.58,5.4,2.55,40,C.paper);
    text(s,'Compare candidates.\nFind available contacts.\nSpot research gaps.',.65,4.62,5.35,1.25,21,C.darkMuted,false,{paraSpaceAfterPt:7});
    text(s,'Seller profile · Top Seer prospects\nSourced contact records',.65,6.19,5.35,.63,13.5,C.lavender);
    rect(s,6.2,1.53,6.48,1.09,C.purple);
    text(s,'Why this prospect—and what should I\nverify before I reach out?',6.53,1.79,5.82,.67,19,C.paper,true);
    rect(s,6.2,2.86,6.48,3.96,C.paper);
    s.addImage({path:path.join(ASSETS,'icon.png'),x:6.52,y:3.18,w:.4,h:.4,altText:'Kliseer assistant'});
    text(s,'Kliseer',7.07,3.22,5.28,.35,16,C.purple,true);
    text(s,'Hivolts is a historical Tier S sample (16/20). The DOB record shows temporary power / generator-hoist work dated November 1, 2026; that signal does not confirm purchase intent.\n\nTarget fit was 1/5 in this snapshot because company types were not specified. Verify the contact source before outreach.',6.53,3.91,5.82,2.35,17.5,C.ink);
    text(s,'Illustrative response · Historical Nov 7 snapshot',6.53,6.43,5.82,.25,10.5,C.muted);
  }
  // Editorial technology ledger; no decorative infrastructure diagram.
  {
    const s=base(9);
    display(s,'Vultr powers\nthe working\nsystem.',.65,1.59,5.26,2.65,40);
    text(s,'Compute, persistent data,\nand inference each have\na distinct job.',.65,4.91,5.26,1.13,20,C.muted);
    const services=[
      ['Cloud Compute','Next.js app, workflows, and\nscheduled permit ingestion'],
      ['Supabase on Marketplace','Postgres records: profiles,\nchat, companies, signals'],
      ['Serverless Inference','AI-assisted setup, contextual\nresponses, outreach drafts']
    ];
    services.forEach(([name,body],i)=>{
      const y=1.71+i*1.4;
      rule(s,6.36,y-.15,6.32);
      text(s,name,6.36,y+.05,6.32,.49,23,C.ink,true);
      text(s,body,6.36,y+.66,6.32,.64,16.5,C.muted);
    });
    rect(s,6.36,6.07,6.32,.77,C.tint);
    text(s,'Rules calculate scores.\nThe model interprets and drafts.',6.6,6.21,5.84,.52,15,C.purple,true);
  }
  // The violet chapter is a deliberate emphasis on the human-review boundary.
  {
    const s=base(10,'violet');
    display(s,'Useful AI has\nclear boundaries.',.65,1.43,12,1.5,42,C.paper);
    const rows=[['Relevance score','Buying intent'],['Sourced contact','Verified contact'],['Generated draft','Sent email']];
    rows.forEach(([left,right],i)=>{
      const y=3.35+i*.84;
      rule(s,.65,y-.17,12.03,C.lavender);
      text(s,left,.65,y,5.25,.58,29,C.paper,true);
      text(s,'≠',6.01,y-.045,.82,.65,35,C.paper,true,{align:'center'});
      text(s,right,7.47,y+.04,5.21,.53,27,C.paper);
    });
    text(s,'The seller keeps the final decision.',.65,6.36,12,.47,23,C.paper,true);
  }
  // Preserve the value hypothesis without manufactured traction.
  {
    const s=base(11);
    display(s,'A clearer decision,',.65,1.42,12,.98,46);
    display(s,'not just more data.',.65,2.5,12,.98,46,C.purple);
    const values=[
      ['Focused research','Start from the seller’s\nproducts and regions.'],
      ['Defensible priorities','Inspect the dated evidence\nand the scoring factors.'],
      ['Relevant first contact','Prepare outreach with\ncontext the rep can review.']
    ];
    values.forEach(([title,body],i)=>{
      const x=.65+i*4.15;
      rule(s,x,4.12,3.73);
      text(s,title,x,4.43,3.73,.82,23,C.ink,true);
      text(s,body,x,5.38,3.73,.68,16.5,C.muted);
    });
    text(s,'Next to validate—not measured results:',.65,6.47,4.8,.31,13,C.ink,true);
    text(s,'Time to reviewed shortlist · Evidence accuracy · Draft usefulness',5.37,6.47,7.31,.31,12.3,C.muted);
  }
  // Closing reprises the cover typography, with a single clickable destination.
  {
    const s=base(12,'dark');
    display(s,'Know why.',.65,1.62,12,1.46,72,C.lavender);
    display(s,'Then make\nyour move.',.65,3.18,8.2,2.11,54,C.paper);
    text(s,'Seller context.\nPublic evidence.\nHuman judgment.',9.08,3.4,3.6,1.62,25,C.darkMuted);
    rule(s,.65,5.89,12.03,C.darkRule);
    text(s,'Explore the demo',.65,6.22,4.25,.47,23,C.paper,true,{hyperlink:{url:'https://64-177-42-81.sslip.io'}});
    text(s,'https://64-177-42-81.sslip.io',6.29,6.25,6.39,.39,20,C.lavender,false,{align:'right',hyperlink:{url:'https://64-177-42-81.sslip.io'}});
  }
  const filename=path.join(OUT,'Kliseer-Presentation-EN.pptx');
  await pptx.writeFile({fileName:filename,compression:true});
  const total=manifest.at(-1).end;
  const wordCount=content.reduce((sum,s)=>sum+s.narration.trim().split(/\s+/).length,0);
  const intro=`# Kliseer — English presentation script\n\n12 slides · 16:9 · target runtime ${time(total)} · ${wordCount} spoken words.\n\nOnly read the paragraphs under **Say**. Timing includes short pauses and cursor movements; rehearse once and advance manually. The same text is in PowerPoint Speaker Notes. No audio or video is embedded.\n\n## Recording setup\n\n- Record at 1920 × 1080. Use PowerPoint Record / Record Slide Show with Presenter View so notes stay off the audience display. Export as Full HD video after recording.\n- Slides 4–8 are the demo segment. For a working-product demo, replace those visuals in the video edit with real app footage using the cues below, keeping the same time slots. Walkthrough stills are illustrations, not runtime proof.\n- Start in a blank guest workspace and use **Load demo data** if needed. Harborline is fictional. Do not use private company documents in a public recording.\n- Live signals and scores may differ. Slide 6 explicitly uses the November 7, 2026 snapshot; never call it a live score.\n- Keep passwords, API keys, connection strings, and cloud-console secrets off screen. Do not send outreach.\n- The separate 20-second opening-video project is optional and not embedded. Adding it without trimming puts the target at 5:00; shorten the body if you use it and want to stay under five minutes.\n- Check the demo URL before publishing. No recorded audio, current deployment verification, or measured business results are implied by this deck.\n\n## Timeline\n\n| Slide | Time | Duration | Topic |\n|---|---|---|---|\n${manifest.map(s=>`| ${s.slide} | ${time(s.start)}–${time(s.end)} | ${s.duration}s | ${s.title} |`).join('\n')}\n\n`;
  const sections=content.map((s,i)=>`## ${String(i+1).padStart(2,'0')} — ${s.title}\n\n**Time:** ${time(manifest[i].start)}–${time(manifest[i].end)}\n\n**Say**\n\n${s.narration}\n\n**Recording cue — do not read aloud**\n\n${s.cue}\n\n**Evidence / provenance**\n\n${s.sources.map(source=>`- ${source}`).join('\n')}\n`).join('\n');
  fs.writeFileSync(path.join(OUT,'Kliseer-Script-EN.md'),intro+sections);
  fs.writeFileSync(path.join(OUT,'Kliseer-Teleprompter-EN.txt'),`KLISEER — ENGLISH TELEPROMPTER\nTarget: ${time(total)}. Bracketed slide markers are not spoken.\n\n`+content.map((s,i)=>`[SLIDE ${i+1} | ${time(manifest[i].start)}–${time(manifest[i].end)}]\n\n${s.narration}`).join('\n\n'));
  fs.writeFileSync(path.join(OUT,'timing.json'),JSON.stringify({seconds:total,words:wordCount,slides:manifest},null,2));
  console.log(JSON.stringify({file:filename,slides:content.length,seconds:total,words:wordCount,spokenWordsPerMinute:Math.round(wordCount/total*60)},null,2));
}
main().catch(err=>{console.error(err);process.exitCode=1;});
