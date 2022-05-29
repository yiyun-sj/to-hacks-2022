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
  query,
  where,
  getDocs,
  Timestamp,
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

export async function createMeeting(props: { userId: string; title: string }) {
  const { userId, title } = props

  const createdAt = Timestamp.now()

  const meetingRef = await addDoc(collection(db(), 'meetings'), {
    host: userId,
    title,
    createdAt,
  })

  return meetingRef.id
}

export async function getMeetingById(props: { meetingId: string }) {
  const { meetingId } = props
  const meetingDoc = await getDoc(doc(db(), 'meetings', meetingId))
  return meetingDoc.data()
}

export async function createParticipant(props: {
  meetingId: string
  username: string
  participantId?: string
}) {
  const { meetingId, username, participantId } = props

  const participantDoc = await getDoc(
    doc(db(), 'meetings', meetingId, 'participants', participantId || 'none')
  )

  if (participantDoc.exists()) {
    return
  }

  if (participantId) {
    await setDoc(
      doc(db(), 'meetings', meetingId, 'participants', participantId),
      {
        username: username,
        isInCall: true,
      }
    )
    return
  }

  const participantRef = await addDoc(
    collection(db(), 'meetings', meetingId, 'participants'),
    {
      username: username,
      isInCall: true,
    }
  )

  return participantRef.id
}

export async function getParticipantById(props: {
  meetingId: string
  participantId?: string
}) {
  const { meetingId, participantId } = props
  const participantDoc = await getDoc(
    doc(db(), 'meetings', meetingId, 'participants', participantId || 'none')
  )
  return participantDoc.data()
}

export async function getMeetingsById(props: { id: string }) {
  const { id } = props
  const meetingDocs = query(
    collection(db(), 'meetings'),
    where('host', '==', id)
  )
  const meetingsSnapshot = await getDocs(meetingDocs)
  const meetings: any = []
  meetingsSnapshot.forEach((doc) =>
    meetings.push({ id: doc.id, ...doc.data() })
  )
  return meetings
}
