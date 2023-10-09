'use client'

import { Player } from '@remotion/player'
import { useState } from 'react'
import { remotionConfig } from '@/config/remotion'
import { edcomposerConfig } from '@/remotion/AIVideoGen'
import { useRender } from '@/hooks/useRender'

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

  const [prompt, setPrompt] = useState('Your prompt here')

  return (
    <div className="flex flex-col gap-2 items-stretch w-full">
      Editor comes here!

      {/* Ask for prompt */}
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <div className="flex w-full h-full grow">
        <Player
          controls
          clickToPlay
          inputProps={{ prompt }}
          component={edcomposerConfig.component as any}
          compositionHeight={1920}
          compositionWidth={1080}
          fps={remotionConfig.fps}
          durationInFrames={edcomposerConfig?.durationInFrames ?? 100}
          style={{ width: '100%', height: '100%', minHeight: 500 }}
        />
      </div>
      <button
        disabled={renderStatus !== 'ready'}
        onClick={() =>
          startRender({
            inputProps: {
              prompt
            },
            compId: 'edcomposer'
          })
        }
      >
        Render: {renderStatus} {progressPercent && `${progressPercent}%`}
      </button>
    </div>
  )
}
