import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  ConfirmIcon,
  DeleteIcon,
  IconButton,
  Pane,
  Paragraph,
  SidebarTab,
  Tab,
  Tablist,
  Text,
  TextInput,
  useTheme,
} from 'evergreen-ui'
import { Divider } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth'
import { UserContext } from '../../context'
import { createMeeting, updateUsername } from '../../functions/firebase'

function StartMeeting() {
  const user = useContext(UserContext)
  const [meetingLink, setMeetingLink] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleMeetingCreation = async () => {
    const meetingId = await createMeeting({ userId: user?.id })
    navigate(`/meeting/${meetingId}`)
  }

  return (
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Button onClick={handleMeetingCreation}>Create a meeting</Button>
    </Pane>
  )
}

function UserProfile() {
  const user = useContext(UserContext)
  const [username, setUsername] = useState(user?.username)

  const handleChangeUsername = () => {
    updateUsername({ userId: user?.id, username })
  }

  return (
    <Pane display="flex" flexDirection="column" gap={16}>
      <Avatar size={64} name={username} marginBottom={16} src={user?.photo} />
      <Pane>
        <Text>Email: </Text>
        <Text>{user?.email}</Text>
      </Pane>
      <Pane>
        <Text>Username: </Text>
        <TextInput
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
          placeholder="Set username"
          value={username}
        />
        <IconButton
          icon={ConfirmIcon}
          display={user?.username === username ? 'none' : 'inline'}
          intent="success"
          onClick={() => handleChangeUsername()}
        />
        <IconButton
          icon={DeleteIcon}
          display={user?.username === username ? 'none' : 'inline'}
          intent="danger"
          onClick={() => setUsername(user?.username)}
        />
      </Pane>
    </Pane>
  )
}

function MeetingAnalytics() {
  const user = useContext(UserContext)
  return (
    <Pane>
      <Text>Meeting Analytics</Text>
    </Pane>
  )
}

const Home = () => {
  const auth = getAuth()
  const [selectedTab, setSelectedTab] = useState('Start a Meeting')
  const tabs = ['Start a Meeting', 'User Profile', 'Meeting Analytics']

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      })
  }

  const switchTabs = (tab: string) => {
    switch (tab) {
      case 'Start a Meeting':
        return <StartMeeting />
      case 'User Profile':
        return <UserProfile />
      case 'Meeting Analytics':
        return <MeetingAnalytics />
    }
  }

  return (
    <Pane background="purple100" width="100%" minHeight="100vh" display="flex">
      <Pane width="30%" padding={20}>
        <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
          {tabs.map((tab, index) => (
            <Tab
              key={tab}
              id={tab}
              onSelect={() => setSelectedTab(tab)}
              isSelected={tab === selectedTab}
              direction="vertical"
              paddingX={16}
              paddingY={20}
            >
              {tab}
            </Tab>
          ))}
        </Tablist>
        <Divider />
        <Button
          appearance="minimal"
          intent="danger"
          onClick={handleSignOut}
          width="100%"
          paddingY={20}
        >
          Sign Out
        </Button>
      </Pane>
      <Pane width="70%" minHeight="100vh" background="tint1" flex="1">
        {tabs.map((tab, index) => (
          <Pane
            key={tab}
            id={`panel-${tab}`}
            role="tabpanel"
            display={tab === selectedTab ? 'block' : 'none'}
            padding={32}
            height="100%"
          >
            {switchTabs(tab)}
          </Pane>
        ))}
      </Pane>
    </Pane>
  )
}

export default Home
