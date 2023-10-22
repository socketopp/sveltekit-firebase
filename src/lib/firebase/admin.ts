/**
 * admin.ts uses firebase server side libraries.
 */

import {
  FIREBASE_ADMIN_CLIENT_EMAIL,
  FIREBASE_ADMIN_PRIVATE_KEY,
} from '$env/static/private'
import { PUBLIC_FIREBASE_PROJECT_ID } from '$env/static/public'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import type { RequestEvent } from '@sveltejs/kit'
import type { User } from '$lib/types'

function makeApp() {
  const apps = getApps()
  if (apps.length > 0) {
    return apps[0]!
  }

  return initializeApp({
    credential: cert({
      privateKey: FIREBASE_ADMIN_PRIVATE_KEY,
      clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
      projectId: PUBLIC_FIREBASE_PROJECT_ID,
    }),
    databaseURL: `https://${PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
  })
}

const firebase = makeApp()
const auth = getAuth(firebase)
const firestore = getFirestore()

const authenticateUser = async (event: RequestEvent) => {
  try {
    const { cookies } = event
    const token = cookies.get('token')
    const decodedToken: DecodedIdToken | null = token
      ? await auth.verifyIdToken(token)
      : null

    if (decodedToken?.uid) {
      const { phoneNumber, uid } = await auth.getUser(decodedToken.uid)
      const user: User = { phoneNumber, uid }
      return user
    }
  } catch (error) {
    console.error('Error authenticateUser', error)
  }

  return null
}

export { firebase, auth, firestore, authenticateUser }
