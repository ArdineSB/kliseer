import { Composition, Folder, Still } from "remotion";
import { OpeningStill, OpeningVideo } from "./Opening";
import { FocusedProspect } from "./FocusedProspect";
import { NarratedPresentation, narrationDurationInFrames } from "./NarratedTimeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="KliseerAllInOneOpening"
        component={OpeningVideo}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="KliseerFocusedProspectV2"
        component={FocusedProspect}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="KliseerNarratedPresentationEN"
        component={NarratedPresentation}
        durationInFrames={narrationDurationInFrames}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="Review-Stills">
        <Still id="01-Company-context" component={OpeningStill} width={1920} height={1080} defaultProps={{ frame: 82 }} />
        <Still id="02-Define-target" component={OpeningStill} width={1920} height={1080} defaultProps={{ frame: 180 }} />
        <Still id="03-Find-prospect" component={OpeningStill} width={1920} height={1080} defaultProps={{ frame: 272 }} />
        <Still id="04-Make-your-move" component={OpeningStill} width={1920} height={1080} defaultProps={{ frame: 420 }} />
        <Still id="05-Prospect-chat" component={OpeningStill} width={1920} height={1080} defaultProps={{ frame: 520 }} />
      </Folder>
    </>
  );
};
