import { Composition, registerRoot } from "remotion";
import { OpeningVideo } from "./Opening";

const OpeningRenderRoot = () => (
  <Composition
    id="KliseerAllInOneOpening"
    component={OpeningVideo}
    durationInFrames={600}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(OpeningRenderRoot);
