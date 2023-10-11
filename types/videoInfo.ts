import { z } from "zod"

export const videoSchema = z.object({
  sequences: z.array(
    z.array(
      z.object({ caption: z.string(), audio: z.string(), image: z.string() })
    )
  ),
  metadata: z.object({
    title: z.string(),
    title_audio_url: z.string(),
    toc_audio_url: z.string(),
    end_of_url: z.string(),
    table_of_contents: z.array(z.string())
  })
})
