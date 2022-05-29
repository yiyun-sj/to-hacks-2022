import { Heading, Pane } from 'evergreen-ui'
import React from 'react'

export default function ErrorPage() {
  return (
    <Pane
      background="purple100"
      width="100%"
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Heading>404 Not Found</Heading>
    </Pane>
  )
}
