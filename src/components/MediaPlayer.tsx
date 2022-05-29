import {
  ILocalVideoTrack,
  IRemoteVideoTrack,
  ILocalAudioTrack,
  IRemoteAudioTrack,
} from 'agora-rtc-sdk-ng'
import { Pane, Strong, Text } from 'evergreen-ui'
import { isFunction } from 'lodash'
import React, { useRef, useEffect, useState, useContext } from 'react'
import {
  getParticipantById,
  ListenToParticipantCohere,
} from '../functions/firebase'
import happy from '../assets/happy.gif'
import sad from '../assets/sad.gif'
import neutral from '../assets/neutral.gif'
import { AudioContext, UserContext, VideoContext } from '../context'

export interface VideoPlayerProps {
  uid: string
  meetingId: string
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined
  audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined
}

const MediaPlayer = (props: VideoPlayerProps) => {
  const { uid, videoTrack, audioTrack, meetingId } = props

  const [participant, setParticipant] = useState<any>()
  const [participantMood, setParticipantMood] = useState<any>()
  const [emoji, setEmoji] = useState<string>(happy)

  const audio = useContext(AudioContext)
  const video = useContext(VideoContext)
  const user = useContext(UserContext)

  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('uid', uid)
    getParticipantById({ meetingId, participantId: uid }).then(setParticipant)
  }, [uid])

  useEffect(() => {
    if (participant && uid) {
      const unsubscribe = ListenToParticipantCohere({
        meetingId,
        participantId: uid,
        cb: setParticipantMood,
      })
      return () => isFunction(unsubscribe) && unsubscribe()
    }
  }, [participant, uid])

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

  useEffect(() => {
    if (container.current && videoTrack && user?.id === uid && audio) {
      videoTrack?.play(container.current)
    }
    if (container.current && videoTrack && user?.id === uid && !audio) {
      videoTrack?.stop()
    }
  }, [videoTrack, audio, user, uid, container])

  useEffect(() => {
    if (audioTrack && user?.id === uid && audio) {
      audioTrack?.play()
    }
    if (audioTrack && user?.id === uid && !audio) {
      audioTrack?.stop()
    }
  }, [audioTrack, audio, user, uid])

  useEffect(() => {
    switch (participantMood) {
      case 'positive review':
        return setEmoji(happy)
      case 'negative review':
        return setEmoji(sad)
      case 'neutral review':
        return setEmoji(neutral)
    }
  }, [participantMood])

  return (
    <Pane position="relative" elevation={4} marginBottom={16}>
      <Pane ref={container} width={320} height={180} margin={0}></Pane>
      <Pane
        position="absolute"
        width="100%"
        height="100%"
        top={0}
        left={0}
        backgroundColor="white"
        backgroundImage={`url(${emoji})`}
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
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
