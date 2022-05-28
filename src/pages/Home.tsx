import React from 'react'
import { Pane, Text, useTheme } from 'evergreen-ui'
import HeaderBar from '../components/HeaderBar'
import Assembly from '../components/Assembly'

const Home = () => {
  const theme = useTheme()

  return (
    <div className='home'>
      <Pane backgroundColor={theme.colors.purple100} width="100vw" height="100vh">
        <HeaderBar />
        <Pane width="100%" height="95vh">
          <Pane width="30vw">
            <Text>Hi eddie</Text>
            <Assembly />
          </Pane>
        </Pane>
      </Pane>
    </div>
  )
}

export default Home