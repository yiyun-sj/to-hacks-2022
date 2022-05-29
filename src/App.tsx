import React, { useEffect, useState } from 'react'
import './App.css'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from './constants/firebaseConstants'
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import axios from 'axios'
import Home from './pages/Client/Home'
import SignIn from './pages/Host/SignIn'
import HostHome from './pages/Host/HostHome'
import { isFunction } from 'lodash'
import { ListenToOrCreateUserById } from './functions/firebase'
import { AuthUserContext, UserContext } from './context'
import Meeting from './pages/Client/Meeting'
import ErrorPage from './pages/404Page'

initializeApp(firebaseConfig)

export default function App() {
  const auth = getAuth()
  const [authUser] = useAuthState(auth)
  const [user, setUser] = useState<any>()

  useEffect(() => {
    if (authUser) {
      const unsubscribe = ListenToOrCreateUserById({
        id: authUser.uid,
        cb: setUser,
      })
      return () => isFunction(unsubscribe) && unsubscribe()
    }
  }, [authUser])

  return (
    <AuthUserContext.Provider value={authUser}>
      <UserContext.Provider value={user}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="meeting">
              <Route path=":id" element={<Meeting />} />
            </Route>
            <Route
              path="host//*"
              element={authUser ? <HostHome /> : <SignIn />}
            ></Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </AuthUserContext.Provider>
  )
}
