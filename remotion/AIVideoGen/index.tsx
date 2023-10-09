import { remotionConfig } from "@/config/remotion";
import { createCompConfig } from "@/types/remotion";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { z } from "zod";

const schema = z.object({
  prompt: z.string(),
});

function EdComposerComp({ prompt }: z.infer<typeof schema>) {
  // const frame = useCurrentFrame();

  return (
    <AbsoluteFill className="bg-black items-center justify-center">
      <h1 className="text-white text-6xl font-bold">
        Hello {prompt}
      </h1>
    </AbsoluteFill>
  );
}

export const edcomposerConfig = createCompConfig({
  id: "edcomposer",
  durationInFrames: remotionConfig.fps * 10,
  schema,
  component: EdComposerComp as React.FC,
  defaultProps: { prompt: "World!" },
});
