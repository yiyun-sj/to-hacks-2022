import React, { useEffect, useState } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng'
import useAgora from '../functions/useAgora'
import MediaPlayer from './MediaPlayer'
import { appId } from '../constants/agoraConstants'
import { Button, Pane } from 'evergreen-ui'
import { useNavigate, useParams } from 'react-router-dom'

const client = AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' })

// join(appId, channel, token)
// leave()

export default function AgoraCall() {
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
    join(appId, id)
  }, [])

  useEffect(() => {
    console.log(remoteUsers)
  }, [remoteUsers])

  // useEffect(() => {
  //   console.log(client.connectionState)
  // }, [client.connectionState])

  const handleLeave = () => {
    leave()
    navigate('/')
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
          videoTrack={localVideoTrack}
          audioTrack={undefined}
        ></MediaPlayer>
        {remoteUsers.map((user) => (
          <MediaPlayer
            videoTrack={user.videoTrack}
            audioTrack={user.audioTrack}
          ></MediaPlayer>
        ))}
      </Pane>
      <Button onClick={() => handleLeave()}>Leave</Button>
    </Pane>
  )
}
