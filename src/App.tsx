import React from 'react'
import './App.css'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from './constants/firebaseConstants'
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import axios from "axios"

initializeApp(firebaseConfig)

export default function App() {
  const auth = getAuth()
  const [user] = useAuthState(auth)

  return (
    <>
      {user ? (
        <Router>
          <Routes>
              <Route path='/' element={<Home />} />
              <Route path='*' element={<h1>Nothing Here</h1>} />
            </Routes>
        </Router>
      ) : (
        <Router>
          <Routes>
              <Route path='/' element={<SignIn />} />
              <Route path='*' element={<h1>Nothing Here</h1>} />
            </Routes>
        </Router>
      )}
    </>
  )
}
