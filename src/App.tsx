import React from 'react'
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

initializeApp(firebaseConfig)

function Client() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<h1>Nothing Here</h1>} />
    </Routes>
  )
}

function Host() {
  const auth = getAuth()
  const [user] = useAuthState(auth)

  return (
    <>
      {user ? (
        <Routes>
          <Route path="/" element={<HostHome />} />
          <Route path="*" element={<HostHome />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/*" element={<SignIn />} />
        </Routes>
      )}
    </>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Client />} />
        <Route path="/host" element={<Host />} />
        <Route path="*" element={<h1>Nothing Here</h1>} />
      </Routes>
    </Router>
  )
}
