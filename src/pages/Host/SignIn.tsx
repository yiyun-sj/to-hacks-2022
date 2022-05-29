import React from 'react'
import { Pane, Button, LogInIcon } from 'evergreen-ui'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

const SignIn = () => {
  const auth = getAuth()

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
  }

  return (
    <Pane
      background="purple100"
      width="100%"
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Button padding={24} iconAfter={LogInIcon} onClick={signInWithGoogle}>
        Sign In With Google
      </Button>
    </Pane>
  )
}

export default SignIn
