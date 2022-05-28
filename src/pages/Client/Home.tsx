import React, { ChangeEvent, ChangeEventHandler, useState } from 'react'
import { Button, Pane, Text, TextInput, useTheme } from 'evergreen-ui'
import { Divider } from 'antd'
import { Link } from 'react-router-dom'

const Home = () => {
  const theme = useTheme()
  const [meetingLink, setMeetingLink] = useState('')

  return (
    <Pane
      background="purple100"
      width="100%"
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Pane display="flex" alignItems="center" justifyContent="center">
        <Button is={Link} to="/host">
          Host a meeting
        </Button>
        <Divider type="vertical"></Divider>
        <TextInput
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMeetingLink(e.target.value)
          }
          placeholder="Join with meeting link"
          value={meetingLink}
        />
        <Button is={Link} to={`/meeting/${meetingLink}`}>
          Join
        </Button>
      </Pane>
    </Pane>
  )
}

export default Home
