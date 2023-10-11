import { ReactNode } from 'react'
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill
} from 'remotion'

export default function Bounce({ children, className }: { children?: ReactNode, className?: string }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Create a spring animation that bounces between 0 and 1
  const bounce = spring({
    fps,
    frame: frame % fps, // Loop the animation every second
    config: {
      damping: 2,
      stiffness: 200,
      mass: 0.5
    }
  })

  // Interpolate the bounce value to a scale range for a slight bounce effect
  const translateY = interpolate(bounce, [0, 1], [1, 1.05])

  return (
    <AbsoluteFill style={{ transform: `translateY(${translateY}px)` }}>
      {children}
    </AbsoluteFill>
  )
}
