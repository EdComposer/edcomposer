import Edcomposer, { baseCompSchema } from './AIVideoGen'
import { Composition } from 'remotion'
import { remotionConfig } from '@/config/remotion'
import { getAudioDurationInSeconds } from '@remotion/media-utils'
import { useEffect, useState } from 'react'
import { videoSchema } from '@/types/videoInfo'
import { z } from 'zod'

const defaultJson = {
  input: {
    sequences: [
      [
        {
          caption:
            'The climax of the French revolution was the Reign of Terror.',
          audio:
            'https://i.dhr.wtf/r/ElevenLabs_2023-10-11T06_14_03_Daniel.mp3',
          image:
            'https://oaidalleapiprodscus.blob.core.windows.net/private/org-geHv2LL2XzYHfL7gv4Koht6o/user-6YkgTu5OaiHQLkY5ujuRKBOL/img-5UuG5aIhm6SF8tmF9Qls04NC.png?st=2023-10-11T02%3A13%3A51Z&se=2023-10-11T04%3A13%3A51Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-10-10T17%3A50%3A13Z&ske=2023-10-11T17%3A50%3A13Z&sks=b&skv=2021-08-06&sig=MPOl/eitvcjwzjufPz%2Bv0A2Q4sIcA%2BKqjQvCBGtQMIg%3D'
        },
        {
          caption:
            'It was a period of violence that occurred after the onset of the French Revolution, incited by conflict between two rival political factions, the Girondins and the Jacobins.',
          audio:
            'https://i.dhr.wtf/r/ElevenLabs_2023-10-11T06_14_03_Daniel.mp3',
          image:
            'https://oaidalleapiprodscus.blob.core.windows.net/private/org-geHv2LL2XzYHfL7gv4Koht6o/user-6YkgTu5OaiHQLkY5ujuRKBOL/img-JGl7LNsM8Y0F8tcNRTklRPrm.png?st=2023-10-11T02%3A14%3A00Z&se=2023-10-11T04%3A14%3A00Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-10-10T18%3A11%3A26Z&ske=2023-10-11T18%3A11%3A26Z&sks=b&skv=2021-08-06&sig=EDAtH619AzMU%2BOU1k65kiC9Jk7giO1lP6KmYo8J6JQw%3D'
        },
        {
          caption:
            'During this period, many people perceived as enemies of the Revolution were publicly executed by guillotine.',
          audio:
            'https://i.dhr.wtf/r/ElevenLabs_2023-10-11T06_14_03_Daniel.mp3',
          image:
            'https://oaidalleapiprodscus.blob.core.windows.net/private/org-geHv2LL2XzYHfL7gv4Koht6o/user-6YkgTu5OaiHQLkY5ujuRKBOL/img-oYYjYhqA8sKGcZYMd6EAHcoX.png?st=2023-10-11T02%3A14%3A08Z&se=2023-10-11T04%3A14%3A08Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-10-10T18%3A46%3A01Z&ske=2023-10-11T18%3A46%3A01Z&sks=b&skv=2021-08-06&sig=bcp2c05btfEwjqI9Brt%2BHQPlv/PwWSzHcAAiKSgrwJQ%3D'
        }
      ],
      [
        {
          caption:
            'The climax of the French revolution was the Reign of Terror.',
          audio:
            'https://i.dhr.wtf/r/ElevenLabs_2023-10-11T06_14_03_Daniel.mp3',
          image:
            'https://oaidalleapiprodscus.blob.core.windows.net/private/org-geHv2LL2XzYHfL7gv4Koht6o/user-6YkgTu5OaiHQLkY5ujuRKBOL/img-5UuG5aIhm6SF8tmF9Qls04NC.png?st=2023-10-11T02%3A13%3A51Z&se=2023-10-11T04%3A13%3A51Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-10-10T17%3A50%3A13Z&ske=2023-10-11T17%3A50%3A13Z&sks=b&skv=2021-08-06&sig=MPOl/eitvcjwzjufPz%2Bv0A2Q4sIcA%2BKqjQvCBGtQMIg%3D'
        },
        {
          caption:
            'It was a period of violence that occurred after the onset of the French Revolution, incited by conflict between two rival political factions, the Girondins and the Jacobins.',
          audio:
            'https://i.dhr.wtf/r/ElevenLabs_2023-10-11T06_14_03_Daniel.mp3',
          image:
            'https://oaidalleapiprodscus.blob.core.windows.net/private/org-geHv2LL2XzYHfL7gv4Koht6o/user-6YkgTu5OaiHQLkY5ujuRKBOL/img-JGl7LNsM8Y0F8tcNRTklRPrm.png?st=2023-10-11T02%3A14%3A00Z&se=2023-10-11T04%3A14%3A00Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-10-10T18%3A11%3A26Z&ske=2023-10-11T18%3A11%3A26Z&sks=b&skv=2021-08-06&sig=EDAtH619AzMU%2BOU1k65kiC9Jk7giO1lP6KmYo8J6JQw%3D'
        },
        {
          caption:
            'During this period, many people perceived as enemies of the Revolution were publicly executed by guillotine.',
          audio:
            'https://i.dhr.wtf/r/ElevenLabs_2023-10-11T06_14_03_Daniel.mp3',
          image:
            'https://oaidalleapiprodscus.blob.core.windows.net/private/org-geHv2LL2XzYHfL7gv4Koht6o/user-6YkgTu5OaiHQLkY5ujuRKBOL/img-oYYjYhqA8sKGcZYMd6EAHcoX.png?st=2023-10-11T02%3A14%3A08Z&se=2023-10-11T04%3A14%3A08Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-10-10T18%3A46%3A01Z&ske=2023-10-11T18%3A46%3A01Z&sks=b&skv=2021-08-06&sig=bcp2c05btfEwjqI9Brt%2BHQPlv/PwWSzHcAAiKSgrwJQ%3D'
        }
      ]
    ],
    metadata: {
      title: 'French Revolution',
      title_audio_url:
        'https://i.dhr.wtf/r/ElevenLabs_2023-10-11T06_11_01_Daniel.mp3',
      toc_audio_url:
        'https://i.dhr.wtf/r/ElevenLabs_2023-10-11T06_12_55_Daniel.mp3',
      table_of_contents: ['Introduction', 'Causes'],
      end_of_url: 'https://edcomposer.s3.amazonaws.com/1696994077.008891.mp3'
    }
  },
  audioLengths: [
    [
      {
        start: 0,
        end: 3.5265
      },
      {
        start: 3.5265,
        end: 7.053
      },
      {
        start: 7.053,
        end: 10.5795
      }
    ],
    [
      {
        start: 0,
        end: 3.5265
      },
      {
        start: 3.5265,
        end: 7.053
      },
      {
        start: 7.053,
        end: 10.5795
      }
    ]
  ]
}

export default function Root() {
  return (
    <>
      <Composition
        id="Edcomposer"
        schema={baseCompSchema}
        defaultProps={defaultJson}
        component={Edcomposer as React.FC}
        durationInFrames={3000}
        fps={remotionConfig.fps}
        height={1920}
        width={1080}
        calculateMetadata={async ({ props: { input } }) => {
          let totalDuration = 0

          for (const sequence of input.sequences) {
            const audio = sequence[0].audio
            if (audio) {
              const length = await getAudioDurationInSeconds(audio)
              totalDuration += length

              totalDuration += 2
            }
          }

          return {
            durationInFrames: Math.ceil(totalDuration * remotionConfig.fps),
            width: 1080,
            height: 1920
          }
        }}
      />
    </>
  )
}
