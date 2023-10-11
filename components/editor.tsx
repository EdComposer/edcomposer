'use client'

import { Player } from '@remotion/player'
import { useEffect, useState } from 'react'
import { remotionConfig } from '@/config/remotion'
import EdComposer from '@/remotion/AIVideoGen'
import { useRender } from '@/hooks/useRender'
import { videoSchema } from '@/types/videoInfo'
import { z } from 'zod'
import { getAudioDurationInSeconds } from '@remotion/media-utils'
import './editor.css'
import defaultJson from '@/constants/default-props'

async function getAudioLengths(input: z.infer<typeof videoSchema>) {
  const allAudioLengths = await Promise.all(
    input.sequences.map(async (sequence) => {
      let start = 0
      let end = 0
      const sequenceAudioLengths = await Promise.all(
        sequence.map(async (change) => {
          const duration = await getAudioDurationInSeconds(change.audio)
          start = end
          end = start + duration
          return { start, end }
        })
      )
      return sequenceAudioLengths
    })
  )

  return allAudioLengths.sort((a, b) => b.length - a.length)
}

export default function Editor() {
  const {
    start: startRender,
    status: renderStatus,
    progressPercent
  } = useRender({
    onSuccess: (url) => {
      ;(window as any).open(url)
    }
  })

  const [prompt, setPrompt] = useState('')
  const [isGenerated, setIsGenerated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [audioLengths, setAudioLengths] = useState<
    {
      start: number
      end: number
    }[][]
  >()

  async function handleGatheringInput() {
    // TODO CALL TO BACKEND API

    return {
      input: {
        metadata: {
          title: 'My video title',
          title_audio_url: '',
          toc_audio_url: '',
          end_audio_url: '',
          table_of_content: []
        },
        sequences: []
      },
      prompt
    }
  }

  useEffect(() => {
    ;(async () => {
      const audioLengths = await getAudioLengths(defaultJson.input)
      setAudioLengths(audioLengths)
      console.log(audioLengths)
    })()
  }, [])

  return (
    <div className="flex flex-col gap-2 items-stretch w-full">
      <div className="editor-page-content">
        <div id="editor-page">
          <div className="logo"></div>

          {/* Ask for prompt */}
          <h1 className="font-semibold tracking-tight editor-h1 mb-8">
            What do you wanna{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-tr from-purple-200 to-purple-500">
              learn
            </span>{' '}
            about?
          </h1>
          <div className="topic-input-container">
            <p className="teach-me">Teach me </p>
            <input
              placeholder="Write down a topic"
              className="topic-input"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="flex">
              <button className="add-button button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                  />
                </svg>
                Edit content
              </button>
              <button className="add-button button ml-2">+</button>
            </div>
          </div>

          {isEditing ? (
            <textarea
              className="extra-input"
              placeholder="Add more details"
            ></textarea>
          ) : null}

          <div className="loader">
            <div className="loading-bar">
              <div
                style={{
                  width: `${progressPercent}%`
                }}
                className="current-progress"
              ></div>
            </div>

            <button className="cancel-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="4"
                viewBox="0 0 18 4"
                fill="none"
              >
                <path
                  d="M18 3.28566H10.2857H7.71429H0V0.714233H7.71429H10.2857H18V3.28566Z"
                  fill="white"
                />
                <path
                  d="M18 3.28566H10.2857H7.71429H0V0.714233H7.71429H10.2857H18V3.28566Z"
                  fill="url(#paint0_linear_17_64)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_17_64"
                    x1="18"
                    y1="1.99995"
                    x2="-0.383722"
                    y2="1.99995"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#ED6868" />
                    <stop offset="0.520833" stop-color="#F38B8B" />
                    <stop offset="1" stop-color="#ED6868" />
                  </linearGradient>
                </defs>
              </svg>
              Cancel
            </button>
          </div>
        </div>

        <div className="flex w-full h-full grow">
          {isGenerated ? (
            <Player
              controls
              component={EdComposer}
              compositionHeight={1920}
              compositionWidth={1080}
              fps={remotionConfig.fps}
              durationInFrames={3000}
              style={{ width: '100%', height: '100%', minHeight: 500 }}
              inputProps={defaultJson}
            />
          ) : (
            <div className="pre-render video-player ">
              <button
                disabled={renderStatus !== 'ready'}
                onClick={() => {
                  startRender({
                    inputProps: {
                      prompt
                    },
                    compId: 'edcomposer'
                  })
                  setIsGenerated(true)
                }}
                className="render-button button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M6.25005 4.66663L4.16672 5.83329L5.33338 3.74996L4.16672 1.66663L6.25005 2.83329L8.33338 1.66663L7.16672 3.74996L8.33338 5.83329L6.25005 4.66663ZM16.25 12.8333L18.3334 11.6666L17.1667 13.75L18.3334 15.8333L16.25 14.6666L14.1667 15.8333L15.3334 13.75L14.1667 11.6666L16.25 12.8333ZM18.3334 1.66663L17.1667 3.74996L18.3334 5.83329L16.25 4.66663L14.1667 5.83329L15.3334 3.74996L14.1667 1.66663L16.25 2.83329L18.3334 1.66663ZM11.1167 10.65L13.15 8.61663L11.3834 6.84996L9.35005 8.88329L11.1167 10.65ZM11.975 6.07496L13.925 8.02496C14.25 8.33329 14.25 8.87496 13.925 9.19996L4.20005 18.925C3.87505 19.25 3.33338 19.25 3.02505 18.925L1.07505 16.975C0.750049 16.6666 0.750049 16.125 1.07505 15.8L10.8 6.07496C11.125 5.74996 11.6667 5.74996 11.975 6.07496Z"
                    fill="#9E62EF"
                  />
                </svg>
                Render your video
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
