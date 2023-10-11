import React, {
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useState
} from 'react'
import { AbsoluteFill, Audio, Img, Series, useVideoConfig } from 'remotion'
import { z } from 'zod'
import First from './sequences/SlideInFromBottom'
import { loadFont as loadInterFont } from '@remotion/google-fonts/Inter'
import SlidingDoors from './sequences/SlidingDoors'
import TextFadeInFromBottom from './sequences/TextFadeInFromBottom'
import GridPattern from './sequences/GridPattern'
import FadeOutExit from './sequences/FadeOutExit'
import clsx from 'clsx'
import ConditionalWrap from './sequences/ConditionalWrap'
import SlideExitToTop from './sequences/SlideExitToTop'
import FadingOutAudio from './sequences/FadeOutExit'
import { videoSchema } from '@/types/videoInfo'
import { getAudioDurationInSeconds } from '@remotion/media-utils'
import { continueRender, delayRender } from 'remotion'
import ScrollingTextList from './sequences/ScrollingTextList'
import TextAppearWithHeight from './sequences/TextAppearWithHeight'
import Bounce from './sequences/Bounce'

const parsedPropsSchemaBase = {
  input: videoSchema,
  audioLengths: z.array(
    z.array(
      z.object({
        start: z.number(),
        end: z.number()
      })
    )
  )
}
export { parsedPropsSchemaBase }
const parsedPropsSchema = z.object(parsedPropsSchemaBase)
export type ParsedPropsSchema = z.infer<typeof parsedPropsSchema>

export const baseCompSchema = z.object({
  ...parsedPropsSchemaBase
})
export type BaseCompProps = z.infer<typeof baseCompSchema>

loadInterFont('normal', {
  weights: ['400', '500', '600', '700', '800', '900']
})

const colorSetClasses = [
  ['text-white', 'bg-sky-500'],
  ['text-white', 'bg-teal-600'],
  ['text-white', 'bg-indigo-500'],
  ['text-white', 'bg-blue-500'],
  ['text-white', 'bg-purple-600'],
  ['text-white', 'bg-fuchsia-600']
] satisfies [string, string][]

const EdComposer = ({
  input,
  audioLengths
}: z.infer<typeof baseCompSchema> & HTMLAttributes<HTMLDivElement>) => {
  const { fps } = useVideoConfig()
  const [handle] = useState(() => delayRender())

  const animations = [
    (children: ReactNode) => <SlidingDoors>{children}</SlidingDoors>,
    (children: ReactNode) => (
      <TextFadeInFromBottom noExit>{children}</TextFadeInFromBottom>
    ),
    (children: ReactNode) => <GridPattern>{children}</GridPattern>,
    (children: ReactNode) => <SlideExitToTop>{children}</SlideExitToTop>,
    (children: ReactNode) => (
      <TextAppearWithHeight>{children}</TextAppearWithHeight>
    )
  ]

  const [otherAudioLengths, setOtherAudioLengths] = useState<[number, number]>([
    1, 1
  ])

  useEffect(() => {
    // just get the length of title and toc audio
    async function getOtherAudioLengths() {
      const titleLength = await getAudioDurationInSeconds(
        input.metadata.title_audio_url
      )
      const tocLength = await getAudioDurationInSeconds(
        input.metadata.toc_audio_url
      )
      setOtherAudioLengths([titleLength, tocLength])
      continueRender(handle)
    }
    getOtherAudioLengths()
  }, [handle, input])

  let accumulatedOffset = 0

  return (
    <AbsoluteFill className="bg-black">
      {/* Audio */}
      <FadingOutAudio />

      {input.sequences.map((sequence, i) => (
        <Series key={i}>
          {sequence.map((change, j) => (
            <Series.Sequence
              durationInFrames={
                (audioLengths[i][j].end - audioLengths[i][j].start) * fps ?? 1
              }
              key={j}
            >
              <Audio
                src={change.audio}
                startFrom={audioLengths[i][j].start}
                endAt={audioLengths[i][j].end}
              />
            </Series.Sequence>
          ))}
        </Series>
      ))}

      {/* Video */}
      <Series>
        <Series.Sequence
          durationInFrames={otherAudioLengths[0] * fps ?? 1}
          className="text-white"
          name="Vercel/NextJS"
        >
          <SlidingDoors>
            <First className="bg-black">
              <h1 className="text-9xl font-black">{input.metadata.title}</h1>
              <Audio src={input.metadata.title_audio_url} />
            </First>
          </SlidingDoors>
        </Series.Sequence>

        <Series.Sequence
          durationInFrames={otherAudioLengths[1] * fps ?? 1}
          // offset={otherAudioLengths[0] * fps}
          className="text-black"
          name={'Vercel/NextJS | 13.4.2'}
        >
          <SlidingDoors>
            <First className="bg-white text-center">
              <div className="flex items-start justify-start gap-10 flex-col text-left">
                <span className="text-3xl">In this video, we will learn:</span>
                {input.metadata.table_of_contents.map((value) => (
                  <h1
                    key={value}
                    className="text-6xl font-black max-w-[75%] self-start"
                  >
                    -{'  '}
                    {value}
                  </h1>
                ))}
                <Audio src={input.metadata.toc_audio_url} />
              </div>
            </First>
          </SlidingDoors>
        </Series.Sequence>

        {input.sequences.map((sequence, i) => {
          accumulatedOffset += 3 * fps

          return (
            <React.Fragment key={`fragment-${i}`}>
              {/* Display title slide for each subtopic */}
              <Series.Sequence
                durationInFrames={3 * fps}
                offset={Math.round(accumulatedOffset / fps)}
                key={`title-${i}`}
                name={input.metadata.table_of_contents[i]}
              >
                <ConditionalWrap condition={true} wrap={animations[2]}>
                  <First className="bg-white text-center">
                    <h1 className="text-9xl font-black">
                      {input.metadata.table_of_contents[i]}
                    </h1>
                  </First>
                </ConditionalWrap>
              </Series.Sequence>

              {sequence.map((change, j) => {
                const duration =
                  (audioLengths?.[i]?.[j].end - audioLengths?.[i]?.[j].start) *
                  fps

                accumulatedOffset += duration

                return (
                  <Series.Sequence
                    durationInFrames={fps * 3}
                    offset={-fps * 3}
                    className={clsx("scale-150",
                      colorSetClasses[i % colorSetClasses.length]
                    )}
                    key={`change-${i}-${j}`}
                  >
                    <TextFadeInFromBottom
                      noExit
                      className="gap-10 flex flex-col items-center -mb-20"
                    >
                      <p className="text-4xl font-bold w-3/4">
                        {change.caption}
                      </p>

                      {/* Image */}
                      <Img src={change.image} className="w-[75%] h-auto" />
                    </TextFadeInFromBottom>
                  </Series.Sequence>
                )
              })}
            </React.Fragment>
          )
        })}

        <Series.Sequence
          durationInFrames={fps * 3}
          offset={-20}
          className="text-white"
          name={'Here are the top changes!'}
        >
          <SlidingDoors>
            <First className="bg-black text-center">
              <h1 className="text-9xl font-black">Learn using EdComposer</h1>
            </First>
          </SlidingDoors>
        </Series.Sequence>

        <Series.Sequence
          durationInFrames={fps * 3}
          offset={-30}
          className="z-0"
          name="Checkout the latest release"
        >
          <Series.Sequence
            durationInFrames={fps * 1.5}
            offset={-20}
            className="text-white"
          >
            <SlidingDoors>
              <First className="bg-blue-500 text-white flex flex-col items-center justify-center text-center">
                <h1 className="text-9xl font-black">
                  Hope you liked this video!
                </h1>
                <p className="text-5xl mt-10 text-white/70">
                  Try another prompt now.
                </p>
              </First>
            </SlidingDoors>
          </Series.Sequence>
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  )
}

export default EdComposer
