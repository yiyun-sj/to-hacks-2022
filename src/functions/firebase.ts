import { getAuth, User } from 'firebase/auth'
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
} from 'firebase/firestore'
import { Dispatch, SetStateAction } from 'react'

const db = () => getFirestore()

export async function ListenToOrCreateUserById(props: {
  id: string
  cb: Dispatch<SetStateAction<any>>
}) {
  const { id, cb } = props
  if (!id) return null
  onSnapshot(doc(db(), 'users', id), (doc) => {
    if (doc.exists()) {
      cb(doc.data())
    } else {
      createUser()
    }
  })
}

export async function createUser() {
  const auth = getAuth()
  const authUser = auth.currentUser
  if (!authUser) return
  const { uid, email, photoURL, displayName } = authUser

  const existingUser = await getDoc(doc(db(), 'users', uid))

  if (!existingUser.exists()) {
    await setDoc(doc(db(), 'users', uid), {
      username: displayName,
      photo: photoURL,
      email: email,
      id: uid,
    })
  }
}

export async function updateUsername(props: {
  userId: string
  username: string
}) {
  const { userId, username } = props

  await updateDoc(doc(db(), 'users', userId), {
    username: username,
  })
}

export async function createMeeting(props: { userId: string }) {
  const { userId } = props

  const meetingRef = await addDoc(collection(db(), 'meetings'), {
    isLive: true,
    host: userId,
  })

  return meetingRef.id
}

export async function getMeetingById(props: { meetingId: string }) {
  const { meetingId } = props
  const meetingDoc = await getDoc(doc(db(), 'meetings', meetingId))
  return meetingDoc.data()
}

export async function ListenToOrCreateParticipant(props: {
  meetingId: string
  user?: any
  participant: string
  cb: Dispatch<SetStateAction<any>>
}) {
  const { meetingId, user, cb, participant } = props
  if (!meetingId || !cb) return null
  onSnapshot(
    doc(db(), 'meetings', meetingId, 'participants', participant),
    (doc) => {
      if (doc.exists()) {
        cb(doc.id)
      } else {
        if (user) {
          createParticipant({ meetingId, user })
        } else {
          createParticipant({ meetingId })
        }
      }
    }
  )
}

export async function createParticipant(props: {
  meetingId: string
  user?: any
}) {
  const { meetingId, user } = props

  if (user) {
    await setDoc(doc(db(), 'meetings', meetingId, 'participants', user?.id), {
      username: user.username,
      isInCall: true,
    })
    return user.id
  }

  await addDoc(collection(db(), 'meetings', meetingId, 'participants'), {
    isInCall: true,
  })
}
