import React from 'react'
import { Pane, Text, useTheme, Button, LogInIcon } from 'evergreen-ui'
import HeaderBar from '../components/HeaderBar'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'


const SignIn = () => {
  const theme = useTheme()
  const auth = getAuth()

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
  }

  return (
    <div className='home'>
      <Pane backgroundColor={theme.colors.purple100} width="100vw" height="100vh">
        <HeaderBar />
        <Pane width="100%" height="95vh">
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Button padding={24} iconAfter={LogInIcon} onClick={signInWithGoogle}>
              Sign In With Google
            </Button>
          </Pane>
        </Pane>
      </Pane>
    </div>
  )
}

export default SignIn