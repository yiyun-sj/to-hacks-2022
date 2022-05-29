import { Button, Pane, Spinner, TextInputField, toaster } from 'evergreen-ui'
import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AgoraCall from '../../components/AgoraCall'
import { UserContext } from '../../context'
import { createParticipant, getMeetingById } from '../../functions/firebase'
import ErrorPage from '../404Page'

export default function Meeting() {
  const user = useContext(UserContext)
  const { id } = useParams()
  const [meeting, setMeeting] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const [participantId, setParticipantId] = useState<string | undefined>()
  const [username, setUsername] = useState<string | undefined>()
  const [usernameInput, setUsernameInput] = useState('')
  const [remoteParticipantIds, setRemoteParticipantIds] = useState<string[]>([])

  const handleRemoteParticipantIds = (participantIds: string[]) => {
    setRemoteParticipantIds(participantIds)
  }

  const handleUsernameInput = () => {
    if (usernameInput) {
      setUsername(usernameInput)
    } else {
      toaster.danger('please enter a display name')
    }
  }

  useEffect(() => {
    if (id) {
      setIsLoading(true)
      getMeetingById({ meetingId: id }).then((doc) => {
        setMeeting(doc)
        setIsLoading(false)
      })
    }
  }, [id])

  useEffect(() => {
    if (user && id) {
      setUsername(user.username)
      setParticipantId(user.id)
      createParticipant({
        meetingId: id,
        username: user.username,
        participantId: user.id,
      })
    }
  }, [user, id])

  useEffect(() => {
    if (!user && username && id) {
      createParticipant({ meetingId: id, username }).then((res) => {
        setParticipantId(res)
      })
    }
  }, [user, username, id])

  if (isLoading) {
    return (
      <Pane
        background="purple100"
        width="100%"
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner />
      </Pane>
    )
  }

  if (!meeting || !id) {
    return <ErrorPage />
  }

  if (!username) {
    return (
      <Pane
        background="purple100"
        width="100%"
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        id="meet"
      >
        <TextInputField
          label="Display Name"
          placeholder="Enter display name here"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setUsernameInput(e.target.value)
          }
          value={usernameInput}
        />
        <Button onClick={handleUsernameInput}>Join</Button>
      </Pane>
    )
  }

  return (
    <Pane
      background="purple100"
      width="100%"
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      id="meet"
    >
      {participantId && (
        <AgoraCall
          participantId={participantId}
          handleRemoteParticipantIds={handleRemoteParticipantIds}
        />
      )}
    </Pane>
  )
}
