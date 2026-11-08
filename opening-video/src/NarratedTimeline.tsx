import {Audio} from '@remotion/media';
import {AbsoluteFill, Sequence, staticFile} from 'remotion';
import {BasicCaptions} from './basic-captions.element';
import {NarratedScene} from './NarratedScene';

// Generated from the real TTS audio and bookmark timestamps by prepare-video.cjs.
export const narrationDurationInFrames=8403;
export const NarratedPresentation=()=> (
  <AbsoluteFill style={{background:'#FFFFFF'}}>
    <Sequence name="01 / THE PITCH" durationInFrames={493}>
      <NarratedScene slide={1} durationInFrames={493} title="From public signals to a smarter first move." section="THE PITCH" cues={[{"text":" Sales teams do not need another list of company names.","seconds":0},{"text":" They need a reason to reach out.","seconds":4.025},{"text":" Kliseer connects seller context, dated public signals, and reviewable outreach,","seconds":6.115},{"text":" helping building-material and electrical suppliers decide where to focus next.","seconds":10.315}]} />
      <Audio name="English narration" src={staticFile('presentation/audio/track-01.wav')} />
      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <BasicCaptions name="English subtitles" width={2400} combineTokensWithinMilliseconds={0} style={{position:'absolute',bottom:70,left:240,scale:0.6,transformOrigin:'left bottom'}} captions={[
  {
    "text": " Sales teams do not need another list of company names.",
    "startMs": 0,
    "endMs": 4025,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " They need a reason to reach out.",
    "startMs": 4025,
    "endMs": 6115,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " Kliseer connects seller context, dated public signals, and reviewable outreach,",
    "startMs": 6115,
    "endMs": 10315,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " helping building-material and electrical suppliers decide where to focus next.",
    "startMs": 10315,
    "endMs": 15220,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  }
]} />
      </div>
    </Sequence>
    <Sequence name="02 / THE PROBLEM" from={493} durationInFrames={636}>
      <NarratedScene slide={2} durationInFrames={636} title="A prospect list is not a reason to reach out." section="THE PROBLEM" cues={[{"text":" For a supplier, prospect research means connecting several pieces: what we sell,","seconds":0},{"text":" which companies fit, and what has recently happened.","seconds":4.68},{"text":" A public permit can be useful, but it still needs context.","seconds":8.245},{"text":" The challenge is turning that scattered information into a clear, defensible next","seconds":12.09},{"text":" step, without pretending that activity equals buying intent.","seconds":15.69}]} />
      <Audio name="English narration" src={staticFile('presentation/audio/track-02.wav')} />
      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <BasicCaptions name="English subtitles" width={2400} combineTokensWithinMilliseconds={0} style={{position:'absolute',bottom:70,left:240,scale:0.6,transformOrigin:'left bottom'}} captions={[
  {
    "text": " For a supplier, prospect research means connecting several pieces: what we sell,",
    "startMs": 0,
    "endMs": 4680,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " which companies fit, and what has recently happened.",
    "startMs": 4680,
    "endMs": 8245,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " A public permit can be useful, but it still needs context.",
    "startMs": 8245,
    "endMs": 12090,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " The challenge is turning that scattered information into a clear, defensible next",
    "startMs": 12090,
    "endMs": 15690,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " step, without pretending that activity equals buying intent.",
    "startMs": 15690,
    "endMs": 19970,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  }
]} />
      </div>
    </Sequence>
    <Sequence name="03 / THE SOLUTION" from={1129} durationInFrames={672}>
      <NarratedScene slide={3} durationInFrames={672} title="Klise understands you. Seer finds the signal." section="THE SOLUTION" cues={[{"text":" Kliseer brings that work into one workspace.","seconds":0},{"text":" Klise helps turn company information into a profile and target criteria that the","seconds":3.6},{"text":" seller reviews. Seer surfaces prospects with dated evidence and explainable scores.","seconds":7.445},{"text":" From there, the seller can inspect contacts, ask questions, and prepare an outreach","seconds":13.15},{"text":" draft, while keeping control of the final decision.","seconds":17.335}]} />
      <Audio name="English narration" src={staticFile('presentation/audio/track-03.wav')} />
      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <BasicCaptions name="English subtitles" width={2400} combineTokensWithinMilliseconds={0} style={{position:'absolute',bottom:70,left:240,scale:0.6,transformOrigin:'left bottom'}} captions={[
  {
    "text": " Kliseer brings that work into one workspace.",
    "startMs": 0,
    "endMs": 3600,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " Klise helps turn company information into a profile and target criteria that the",
    "startMs": 3600,
    "endMs": 7445,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " seller reviews. Seer surfaces prospects with dated evidence and explainable scores.",
    "startMs": 7445,
    "endMs": 13150,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " From there, the seller can inspect contacts, ask questions, and prepare an outreach",
    "startMs": 13150,
    "endMs": 17335,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " draft, while keeping control of the final decision.",
    "startMs": 17335,
    "endMs": 21195,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  }
]} />
      </div>
    </Sequence>
    <Sequence name="04 / DEMO / COMPANY CONTEXT" from={1801} durationInFrames={727}>
      <NarratedScene slide={4} durationInFrames={727} title="Start with the business you already know." section="DEMO / COMPANY CONTEXT" cues={[{"text":" For this walkthrough, we use Harborline Electrical Supply, a fictional distributor","seconds":0},{"text":" serving New York and New Jersey.","seconds":4.635},{"text":" The seller can upload company materials or describe the business in chat.","seconds":7.33},{"text":" Klise prepares editable fields, including products and service regions.","seconds":11.42},{"text":" Each setup section is reviewed separately before approval, so an AI suggestion does","seconds":15.885},{"text":" not silently become an accepted fact.","seconds":20.105}]} />
      <Audio name="English narration" src={staticFile('presentation/audio/track-04.wav')} />
      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <BasicCaptions name="English subtitles" width={2400} combineTokensWithinMilliseconds={0} style={{position:'absolute',bottom:70,left:240,scale:0.6,transformOrigin:'left bottom'}} captions={[
  {
    "text": " For this walkthrough, we use Harborline Electrical Supply, a fictional distributor",
    "startMs": 0,
    "endMs": 4635,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " serving New York and New Jersey.",
    "startMs": 4635,
    "endMs": 7330,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " The seller can upload company materials or describe the business in chat.",
    "startMs": 7330,
    "endMs": 11420,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " Klise prepares editable fields, including products and service regions.",
    "startMs": 11420,
    "endMs": 15885,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " Each setup section is reviewed separately before approval, so an AI suggestion does",
    "startMs": 15885,
    "endMs": 20105,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " not silently become an accepted fact.",
    "startMs": 20105,
    "endMs": 23010,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  }
]} />
      </div>
    </Sequence>
    <Sequence name="05 / DEMO / PROSPECT DISCOVERY" from={2528} durationInFrames={776}>
      <NarratedScene slide={5} durationInFrames={776} title="Turn public activity into a shortlist." section="DEMO / PROSPECT DISCOVERY" cues={[{"text":" Seer uses public permit sources from New York City, Austin, and Seattle.","seconds":0},{"text":" It surfaces companies with a signal in the last year, then applies rules for","seconds":5.11},{"text":" keyword matches, freshness, location, and target fit.","seconds":8.725},{"text":" These factors produce a score and tier.","seconds":13.405},{"text":" The language model does not assign those numbers.","seconds":15.995},{"text":" This is prioritization based on observable evidence, not a prediction that a","seconds":18.995},{"text":" company is ready to buy.","seconds":22.78}]} />
      <Audio name="English narration" src={staticFile('presentation/audio/track-05.wav')} />
      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <BasicCaptions name="English subtitles" width={2400} combineTokensWithinMilliseconds={0} style={{position:'absolute',bottom:70,left:240,scale:0.6,transformOrigin:'left bottom'}} captions={[
  {
    "text": " Seer uses public permit sources from New York City, Austin, and Seattle.",
    "startMs": 0,
    "endMs": 5110,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " It surfaces companies with a signal in the last year, then applies rules for",
    "startMs": 5110,
    "endMs": 8725,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " keyword matches, freshness, location, and target fit.",
    "startMs": 8725,
    "endMs": 13405,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " These factors produce a score and tier.",
    "startMs": 13405,
    "endMs": 15995,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " The language model does not assign those numbers.",
    "startMs": 15995,
    "endMs": 18995,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " This is prioritization based on observable evidence, not a prediction that a",
    "startMs": 18995,
    "endMs": 22780,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " company is ready to buy.",
    "startMs": 22780,
    "endMs": 24640,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  }
]} />
      </div>
    </Sequence>
    <Sequence name="06 / DEMO / ONE CONCRETE EXAMPLE" from={3304} durationInFrames={786}>
      <NarratedScene slide={6} durationInFrames={786} title="Show the evidence behind the priority." section="DEMO / ONE CONCRETE EXAMPLE" cues={[{"text":" Here is a concrete historical example: Hivolts Electrical in Brooklyn.","seconds":0},{"text":" In the November seventh snapshot, its score was sixteen out of twenty, or Tier S.","seconds":5.085},{"text":" The cited November first permit describes temporary power and generator-hoist work.","seconds":9.535},{"text":" That suggests relevance to an electrical supplier, but not a confirmed purchase.","seconds":14.455},{"text":" Target fit was only one out of five, so the seller can see both the supporting","seconds":19.205},{"text":" evidence and the limitation.","seconds":22.645}]} />
      <Audio name="English narration" src={staticFile('presentation/audio/track-06.wav')} />
      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <BasicCaptions name="English subtitles" width={2400} combineTokensWithinMilliseconds={0} style={{position:'absolute',bottom:70,left:240,scale:0.6,transformOrigin:'left bottom'}} captions={[
  {
    "text": " Here is a concrete historical example: Hivolts Electrical in Brooklyn.",
    "startMs": 0,
    "endMs": 5085,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " In the November seventh snapshot, its score was sixteen out of twenty, or Tier S.",
    "startMs": 5085,
    "endMs": 9535,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " The cited November first permit describes temporary power and generator-hoist work.",
    "startMs": 9535,
    "endMs": 14455,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " That suggests relevance to an electrical supplier, but not a confirmed purchase.",
    "startMs": 14455,
    "endMs": 19205,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " Target fit was only one out of five, so the seller can see both the supporting",
    "startMs": 19205,
    "endMs": 22645,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " evidence and the limitation.",
    "startMs": 22645,
    "endMs": 24980,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  }
]} />
      </div>
    </Sequence>
    <Sequence name="07 / DEMO / OUTREACH" from={4090} durationInFrames={756}>
      <NarratedScene slide={7} durationInFrames={756} title="A next step you can review. Not autopilot." section="DEMO / OUTREACH" cues={[{"text":" Once a prospect looks relevant, the seller checks the available contact and its","seconds":0},{"text":" source. Kliseer can then draft a first-touch email using seller information and","seconds":4.24},{"text":" dated signals. The message stays editable, and Kliseer does not send it.","seconds":9.08},{"text":" Provider-supplied contact details are not treated as verified.","seconds":14.505},{"text":" The seller still needs to confirm the recipient, the facts, and whether the","seconds":18.33},{"text":" outreach makes sense.","seconds":22.04}]} />
      <Audio name="English narration" src={staticFile('presentation/audio/track-07.wav')} />
      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <BasicCaptions name="English subtitles" width={2400} combineTokensWithinMilliseconds={0} style={{position:'absolute',bottom:70,left:240,scale:0.6,transformOrigin:'left bottom'}} captions={[
  {
    "text": " Once a prospect looks relevant, the seller checks the available contact and its",
    "startMs": 0,
    "endMs": 4240,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " source. Kliseer can then draft a first-touch email using seller information and",
    "startMs": 4240,
    "endMs": 9080,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " dated signals. The message stays editable, and Kliseer does not send it.",
    "startMs": 9080,
    "endMs": 14505,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " Provider-supplied contact details are not treated as verified.",
    "startMs": 14505,
    "endMs": 18330,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " The seller still needs to confirm the recipient, the facts, and whether the",
    "startMs": 18330,
    "endMs": 22040,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " outreach makes sense.",
    "startMs": 22040,
    "endMs": 23995,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  }
]} />
      </div>
    </Sequence>
    <Sequence name="08 / DEMO / GROUNDED CHAT" from={4846} durationInFrames={715}>
      <NarratedScene slide={8} durationInFrames={715} title="Ask questions against your workspace." section="DEMO / GROUNDED CHAT" cues={[{"text":" The chat also works with the current workspace: the seller profile, top Seer","seconds":0},{"text":" prospects, and sourced contact records.","seconds":4.63},{"text":" A rep can compare candidates, ask who has available contacts, or identify promising","seconds":8.085},{"text":" prospects that still need contact research.","seconds":12.73},{"text":" Missing details should remain missing, rather than being filled with a","seconds":15.985},{"text":" plausible-looking email address or an invented decision-maker.","seconds":19.07}]} />
      <Audio name="English narration" src={staticFile('presentation/audio/track-08.wav')} />
      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <BasicCaptions name="English subtitles" width={2400} combineTokensWithinMilliseconds={0} style={{position:'absolute',bottom:70,left:240,scale:0.6,transformOrigin:'left bottom'}} captions={[
  {
    "text": " The chat also works with the current workspace: the seller profile, top Seer",
    "startMs": 0,
    "endMs": 4630,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " prospects, and sourced contact records.",
    "startMs": 4630,
    "endMs": 8085,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " A rep can compare candidates, ask who has available contacts, or identify promising",
    "startMs": 8085,
    "endMs": 12730,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " prospects that still need contact research.",
    "startMs": 12730,
    "endMs": 15985,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " Missing details should remain missing, rather than being filled with a",
    "startMs": 15985,
    "endMs": 19070,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " plausible-looking email address or an invented decision-maker.",
    "startMs": 19070,
    "endMs": 22625,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  }
]} />
      </div>
    </Sequence>
    <Sequence name="09 / TECHNOLOGY" from={5561} durationInFrames={918}>
      <NarratedScene slide={9} durationInFrames={918} title="Vultr powers the working system." section="TECHNOLOGY" cues={[{"text":" Vultr is central to the backend, not just a place to host a page.","seconds":0},{"text":" Cloud Compute runs the Next.js application and the scheduled public-data ingestion.","seconds":4.735},{"text":" Supabase, deployed through Vultr Marketplace, stores profiles, conversations,","seconds":9.785},{"text":" companies, and signals. Vultr Serverless Inference supports AI drafting and","seconds":14.215},{"text":" contextual responses. The important separation is that application rules calculate","seconds":19.625},{"text":" scores, while the model helps interpret and communicate the supplied information.","seconds":24.085}]} />
      <Audio name="English narration" src={staticFile('presentation/audio/track-09.wav')} />
      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <BasicCaptions name="English subtitles" width={2400} combineTokensWithinMilliseconds={0} style={{position:'absolute',bottom:70,left:240,scale:0.6,transformOrigin:'left bottom'}} captions={[
  {
    "text": " Vultr is central to the backend, not just a place to host a page.",
    "startMs": 0,
    "endMs": 4735,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " Cloud Compute runs the Next.js application and the scheduled public-data ingestion.",
    "startMs": 4735,
    "endMs": 9785,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " Supabase, deployed through Vultr Marketplace, stores profiles, conversations,",
    "startMs": 9785,
    "endMs": 14215,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " companies, and signals. Vultr Serverless Inference supports AI drafting and",
    "startMs": 14215,
    "endMs": 19625,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " contextual responses. The important separation is that application rules calculate",
    "startMs": 19625,
    "endMs": 24085,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " scores, while the model helps interpret and communicate the supplied information.",
    "startMs": 24085,
    "endMs": 29390,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  }
]} />
      </div>
    </Sequence>
    <Sequence name="10 / TRUST BY DESIGN" from={6479} durationInFrames={680}>
      <NarratedScene slide={10} durationInFrames={680} title="Useful AI has clear boundaries." section="TRUST BY DESIGN" cues={[{"text":" Three boundaries matter. A relevance score is not buying intent.","seconds":0},{"text":" A sourced contact is not automatically a verified contact.","seconds":5.01},{"text":" And a generated draft is not a sent email.","seconds":8.77},{"text":" Kliseer makes these distinctions visible and keeps review with the seller.","seconds":11.605},{"text":" That is the product's approach: assist real sales work without disguising","seconds":15.67},{"text":" uncertainty as confidence.","seconds":18.76}]} />
      <Audio name="English narration" src={staticFile('presentation/audio/track-10.wav')} />
      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <BasicCaptions name="English subtitles" width={2400} combineTokensWithinMilliseconds={0} style={{position:'absolute',bottom:70,left:240,scale:0.6,transformOrigin:'left bottom'}} captions={[
  {
    "text": " Three boundaries matter. A relevance score is not buying intent.",
    "startMs": 0,
    "endMs": 5010,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " A sourced contact is not automatically a verified contact.",
    "startMs": 5010,
    "endMs": 8770,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " And a generated draft is not a sent email.",
    "startMs": 8770,
    "endMs": 11605,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " Kliseer makes these distinctions visible and keeps review with the seller.",
    "startMs": 11605,
    "endMs": 15670,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " That is the product's approach: assist real sales work without disguising",
    "startMs": 15670,
    "endMs": 18760,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " uncertainty as confidence.",
    "startMs": 18760,
    "endMs": 21440,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  }
]} />
      </div>
    </Sequence>
    <Sequence name="11 / BUSINESS VALUE" from={7159} durationInFrames={705}>
      <NarratedScene slide={11} durationInFrames={705} title="A clearer decision, not just more data." section="BUSINESS VALUE" cues={[{"text":" The intended value is a more focused research workflow: understand the seller,","seconds":0},{"text":" prioritize with evidence, and prepare a relevant first conversation.","seconds":4.175},{"text":" We are not claiming measured revenue gains or hours saved.","seconds":8.79},{"text":" Those are things to validate. The next evaluation should measure time to a reviewed","seconds":12.26},{"text":" shortlist, evidence accuracy, and whether sales reps find the resulting drafts","seconds":16.285},{"text":" useful.","seconds":20.73}]} />
      <Audio name="English narration" src={staticFile('presentation/audio/track-11.wav')} />
      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <BasicCaptions name="English subtitles" width={2400} combineTokensWithinMilliseconds={0} style={{position:'absolute',bottom:70,left:240,scale:0.6,transformOrigin:'left bottom'}} captions={[
  {
    "text": " The intended value is a more focused research workflow: understand the seller,",
    "startMs": 0,
    "endMs": 4175,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " prioritize with evidence, and prepare a relevant first conversation.",
    "startMs": 4175,
    "endMs": 8790,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " We are not claiming measured revenue gains or hours saved.",
    "startMs": 8790,
    "endMs": 12260,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " Those are things to validate. The next evaluation should measure time to a reviewed",
    "startMs": 12260,
    "endMs": 16285,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " shortlist, evidence accuracy, and whether sales reps find the resulting drafts",
    "startMs": 16285,
    "endMs": 20730,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " useful.",
    "startMs": 20730,
    "endMs": 22265,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  }
]} />
      </div>
    </Sequence>
    <Sequence name="12 / THE CLOSE" from={7864} durationInFrames={539}>
      <NarratedScene slide={12} durationInFrames={539} title="Know why. Then make your move." section="THE CLOSE" cues={[{"text":" Kliseer turns scattered business information into a reviewed path from context to","seconds":0},{"text":" outreach. Built on Vultr, it helps suppliers understand why a prospect deserves","seconds":4.325},{"text":" attention and what still needs checking.","seconds":9.135},{"text":" That is Kliseer: know why, then make your move.","seconds":11.865},{"text":" Thank you.","seconds":15.515}]} />
      <Audio name="English narration" src={staticFile('presentation/audio/track-12.wav')} />
      <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
        <BasicCaptions name="English subtitles" width={2400} combineTokensWithinMilliseconds={0} style={{position:'absolute',bottom:70,left:240,scale:0.6,transformOrigin:'left bottom'}} captions={[
  {
    "text": " Kliseer turns scattered business information into a reviewed path from context to",
    "startMs": 0,
    "endMs": 4325,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " outreach. Built on Vultr, it helps suppliers understand why a prospect deserves",
    "startMs": 4325,
    "endMs": 9135,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " attention and what still needs checking.",
    "startMs": 9135,
    "endMs": 11865,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " That is Kliseer: know why, then make your move.",
    "startMs": 11865,
    "endMs": 15515,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  },
  {
    "text": " Thank you.",
    "startMs": 15515,
    "endMs": 16760,
    "timestampMs": null,
    "confidence": null,
    "pageBreakAfter": true
  }
]} />
      </div>
    </Sequence>
  </AbsoluteFill>
);
