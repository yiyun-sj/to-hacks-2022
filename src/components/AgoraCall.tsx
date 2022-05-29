import React, { useContext, useEffect, useState } from 'react'
import AgoraRTC, { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng'
import useAgora from '../functions/useAgora'
import MediaPlayer from './MediaPlayer'
import { appId } from '../constants/agoraConstants'
import { Button, Pane } from 'evergreen-ui'
import { useNavigate, useParams } from 'react-router-dom'
import { toString } from 'lodash'
import { UserContext } from '../context'
import Assembly from './Assembly'

const client = AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' })

// join(appId, channel, token)
// leave()

export default function AgoraCall(props: {
  participantId: string
  handleRemoteParticipantIds: (participants: string[]) => void
}) {
  const { participantId, handleRemoteParticipantIds } = props

  const user = useContext(UserContext)

  const { id } = useParams()
  const navigate = useNavigate()

  const {
    localAudioTrack,
    localVideoTrack,
    leave,
    join,
    joinState,
    remoteUsers,
  } = useAgora(client)

  useEffect(() => {
    join({ appid: appId, channel: id, uid: participantId })
  }, [])

  useEffect(() => {
    const remoteUserIds = remoteUsers.map((user: IAgoraRTCRemoteUser) =>
      toString(user.uid)
    )
    handleRemoteParticipantIds(remoteUserIds)
  }, [remoteUsers])

  const handleLeave = () => {
    leave()
    if (user) {
      navigate('/host')
    } else {
      navigate('/')
    }
  }
  return (
    <Pane display="flex" flexDirection="column" width="80%">
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(320px, 1fr))"
        gridAutoRows="1fr"
        flexWrap="wrap"
        justifyItems="center"
        alignItems="center"
        width="100%"
      >
        <MediaPlayer
          meetingId={id || ''}
          uid={toString(client.uid)}
          videoTrack={localVideoTrack}
          audioTrack={undefined}
        ></MediaPlayer>
        {remoteUsers.map((user) => (
          <MediaPlayer
            meetingId={id || ''}
            uid={toString(user.uid)}
            videoTrack={user.videoTrack}
            audioTrack={user.audioTrack}
          ></MediaPlayer>
        ))}
      </Pane>
      <Button onClick={() => handleLeave()}>Leave</Button>
      <Assembly />
    </Pane>
  )
}
