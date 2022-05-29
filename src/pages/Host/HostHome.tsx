import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  ConfirmIcon,
  DeleteIcon,
  DesktopIcon,
  Dialog,
  Heading,
  HeadsetIcon,
  IconButton,
  Pane,
  SideSheet,
  Spinner,
  Tab,
  Table,
  Tablist,
  Text,
  TextInput,
  TextInputField,
  toaster,
} from 'evergreen-ui'
import { Divider } from 'antd'
import { useNavigate } from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth'
import { UserContext } from '../../context'
import {
  createMeeting,
  getMeetingsById,
  getParticipantById,
  getParticipantsByMeeting,
  updateUsername,
} from '../../functions/firebase'
import { isFunction, toString } from 'lodash'

function StartMeeting() {
  const user = useContext(UserContext)
  const navigate = useNavigate()

  const [title, setTitle] = useState('')

  const handleMeetingCreation = async () => {
    if (!title) return toaster.danger('Please enter a meeting name')
    const meetingId = await createMeeting({ userId: user?.id, title })
    navigate(`/meeting/${meetingId}`)
  }

  return (
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100%"
      flexDirection="column"
      gap={16}
    >
      <Heading size={700}>Meeting Name</Heading>
      <TextInput
        placeholder="Enter meeting title here"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setTitle(e.target.value)
        }
        value={title}
        marginBottom={16}
      />
      <Button
        onClick={handleMeetingCreation}
        size="large"
        intent="success"
        appearance="primary"
        iconAfter={DesktopIcon}
      >
        Create a meeting
      </Button>
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
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100%"
      flexDirection="column"
      gap={16}
    >
      <Avatar size={64} name={username} marginBottom={16} src={user?.photo} />
      <Pane
        display="flex"
        alignItems="start"
        justifyContent="center"
        flexDirection="column"
        gap={16}
      >
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
    </Pane>
  )
}

function MeetingAnalytics() {
  const user = useContext(UserContext)

  const [meetings, setMeetings] = useState<any>([])
  const [selectedMeeting, setSelectedMeeting] = useState<any>(false)
  const [participants, setParticipants] = useState<any>()
  const [selectedParticipant, setSelectedParticipant] = useState<any>(false)

  useEffect(() => {
    if (user?.id) {
      const unsubscribe = getMeetingsById({ id: user?.id, cb: setMeetings })
      return () => isFunction(unsubscribe) && unsubscribe()
    }
  }, [user?.id])

  useEffect(() => {
    if (selectedMeeting) {
      getParticipantsByMeeting({ meetingId: selectedMeeting?.id }).then(
        setParticipants
      )
    }
  }, [selectedMeeting])

  useEffect(() => {
    if (selectedParticipant) {
      console.log(selectedParticipant)
    }
  }, [selectedParticipant])

  return (
    <Pane>
      <Table>
        <Table.Head>
          <Table.TextHeaderCell>Meeting Name</Table.TextHeaderCell>
          <Table.TextHeaderCell>Created At</Table.TextHeaderCell>
        </Table.Head>
        <Table.Body>
          {meetings.map((meeting: any) => (
            <Table.Row
              key={meeting.id}
              isSelectable
              onSelect={() => setSelectedMeeting(meeting)}
            >
              <Table.TextCell>{meeting.title}</Table.TextCell>
              <Table.TextCell>
                {toString(meeting.createdAt.toDate())}
              </Table.TextCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <SideSheet
        onCloseComplete={() => setSelectedMeeting(false)}
        width="50vw"
        isShown={!!selectedMeeting}
        preventBodyScrolling
      >
        <Pane display="flex" flexDirection="column" gap={16}>
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            margin={16}
          >
            <Heading>Analytics for {selectedMeeting.title}</Heading>
            <Divider />
            <Table width="100%">
              <Table.Head>
                <Table.TextHeaderCell>Username</Table.TextHeaderCell>
              </Table.Head>
              <Table.Body>
                {participants?.map((participant: any) => {
                  return (
                    <Table.Row
                      key={participant.id}
                      isSelectable
                      onSelect={() => {
                        setSelectedParticipant(participant)
                      }}
                    >
                      <Table.TextCell>{participant.username}</Table.TextCell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table>
          </Pane>
        </Pane>
      </SideSheet>
      <Dialog
        isShown={!!selectedParticipant}
        onCloseComplete={() => setSelectedParticipant(false)}
        title={`${selectedParticipant.username}'s Logs`}
        hasFooter={false}
        width="80vw"
      >
        <Table width="100%">
          <Table.Head>
            <Table.TextHeaderCell>Input</Table.TextHeaderCell>
            <Table.TextHeaderCell>Prediction</Table.TextHeaderCell>
          </Table.Head>
          <Table.Body>
            {selectedParticipant?.cohere?.map((cohere: any, index: number) => {
              return (
                <Table.Row key={selectedParticipant.index}>
                  <Table.TextCell>{cohere.input}</Table.TextCell>
                  <Table.TextCell>{cohere.prediction}</Table.TextCell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </Dialog>
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
      <Pane
        width="30%"
        padding={20}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
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
        <Pane>
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
