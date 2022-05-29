import {
  ILocalVideoTrack,
  IRemoteVideoTrack,
  ILocalAudioTrack,
  IRemoteAudioTrack,
} from 'agora-rtc-sdk-ng'
import { Pane } from 'evergreen-ui'
import React, { useRef, useEffect } from 'react'

export interface VideoPlayerProps {
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined
  audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined
}

const MediaPlayer = (props: VideoPlayerProps) => {
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!container.current) return
    props.videoTrack?.play(container.current)
    return () => {
      props.videoTrack?.stop()
    }
  }, [container, props.videoTrack])
  useEffect(() => {
    if (props.audioTrack) {
      props.audioTrack?.play()
    }
    return () => {
      props.audioTrack?.stop()
    }
  }, [props.audioTrack])

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
    </Pane>
  )
}

export default MediaPlayer
