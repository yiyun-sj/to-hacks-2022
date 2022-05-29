import { Pane, Spinner } from 'evergreen-ui'
import { isFunction } from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { UserContext } from '../../context'
import {
  getMeetingById,
  ListenToOrCreateParticipant,
} from '../../functions/firebase'
import ErrorPage from '../404Page'

export default function Meeting() {
  const user = useContext(UserContext)
  const { id } = useParams()
  const [meeting, setMeeting] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const [participant, setParticipant] = useState('none')

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
    if (!meeting || !id) return
    const unsubscribe = ListenToOrCreateParticipant({
      meetingId: id,
      user,
      participant,
      cb: setParticipant,
    })
    return () => isFunction(unsubscribe) && unsubscribe()
  }, [meeting, user, id, participant])

  useEffect(() => {
    // console.log(participant)
  }, [participant])

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

  if (!meeting) {
    return <ErrorPage />
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
    ></Pane>
  )
}
