import {
  ILocalVideoTrack,
  IRemoteVideoTrack,
  ILocalAudioTrack,
  IRemoteAudioTrack,
} from 'agora-rtc-sdk-ng'
import { Pane, Strong, Text } from 'evergreen-ui'
import React, { useRef, useEffect, useState } from 'react'
import { getParticipantById } from '../functions/firebase'

export interface VideoPlayerProps {
  uid: string
  meetingId: string
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined
  audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined
}

const MediaPlayer = (props: VideoPlayerProps) => {
  const { uid, videoTrack, audioTrack, meetingId } = props

  const [participant, setParticipant] = useState<any>()

  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getParticipantById({ meetingId, participantId: uid }).then(setParticipant)
  }, [uid])

  useEffect(() => {
    if (!container.current) return
    videoTrack?.play(container.current)
    return () => {
      videoTrack?.stop()
    }
  }, [container, videoTrack])
  useEffect(() => {
    if (audioTrack) {
      audioTrack?.play()
    }
    return () => {
      audioTrack?.stop()
    }
  }, [audioTrack])

  return (
    <Pane position="relative" elevation={4} marginBottom={16}>
      <Pane ref={container} width={320} height={180} margin={0}></Pane>
      <Pane
        position="absolute"
        width="100%"
        height="100%"
        top={0}
        left={0}
      ></Pane>
      <Pane
        position="absolute"
        bottom={0}
        background={'linear-gradient(rgba(0, 0, 0, 0), #fff)'}
        width="100%"
        height="25%"
        display="flex"
        alignItems="end"
        justifyContent="center"
      >
        <Strong size={500} marginBottom={4}>
          {participant?.username}
        </Strong>
      </Pane>
    </Pane>
  )
}

export default MediaPlayer
