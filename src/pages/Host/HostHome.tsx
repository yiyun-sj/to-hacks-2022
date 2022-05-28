import React, { ChangeEvent, useState } from 'react'
import {
  Button,
  Pane,
  Paragraph,
  SidebarTab,
  Tab,
  Tablist,
  TextInput,
  useTheme,
} from 'evergreen-ui'
import { Divider } from 'antd'
import { Link } from 'react-router-dom'

const Home = () => {
  const theme = useTheme()
  const [meetingLink, setMeetingLink] = useState('')
  const [selectedTab, setSelectedTab] = useState('Start a Meeting')
  const tabs = ['Start a Meeting', 'User Profile', 'Meeting Analytics']

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
        <Button appearance="minimal" intent="danger">
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
          >
            <Paragraph>Panel {tab}</Paragraph>
          </Pane>
        ))}
      </Pane>
    </Pane>
  )
}

export default Home
