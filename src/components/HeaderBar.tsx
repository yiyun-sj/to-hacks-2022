import React from 'react'
import {
  IconButton,
  Image,
  LogOutIcon,
  Pane,
  Tooltip,
  useTheme,
} from 'evergreen-ui'
import logo from '../logo.png'
import { getAuth } from 'firebase/auth'

export default function HeaderBar() {
  const auth = getAuth()

  const user = auth.currentUser
  const theme = useTheme()

  return (
    <Pane
      display="flex"
      justifyContent={user ? 'space-between' : 'center'}
      alignItems="center"
      height="5vh"
      padding={8}
      backgroundColor={theme.colors.purple600}
    >
      <Image src={logo} width="4vh" height="4vh" />
      {user && (
        <Tooltip content="Sign Out">
          <IconButton
            icon={LogOutIcon}
            onClick={() => auth.signOut()}
            width="4vh"
            height="4vh"
          />
        </Tooltip>
      )}
    </Pane>
  )
}
