import React, { ChangeEvent, useState } from 'react'
import { Button, Heading, Pane, Text, TextInput } from 'evergreen-ui'
import { Divider } from 'antd'
import { Link } from 'react-router-dom'
import Assembly from '../../components/Assembly'

const Home = () => {
  const [meetingLink, setMeetingLink] = useState('')

  return (
    <Pane
      background="purple100"
      width="100%"
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexDirection="column"
    >
      <Pane
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap={16}
        margin={32}
      >
        <Heading size={900}>Vidlytics</Heading>
        <Text>Your go-to video call sentiment analysis app</Text>
      </Pane>
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
        <Assembly />
      </Pane>
      <Pane padding={48}></Pane>
    </Pane>
  )
}

export default Home
