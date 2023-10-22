import { browser } from '$app/environment'
import type { FirebaseApp, FirebaseOptions } from 'firebase/app'
import { readable } from 'svelte/store'
import {
  PUBLIC_FIREBASE_API_KEY,
  PUBLIC_FIREBASE_AUTH_DOMAIN,
  PUBLIC_FIREBASE_PROJECT_ID,
  PUBLIC_FIREBASE_STORAGE_BUCKET,
  PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
  PUBLIC_FIREBASE_APP_ID,
} from '$env/static/public'

const firebaseConfig = {
  apiKey: PUBLIC_FIREBASE_API_KEY,
  authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
  appId: PUBLIC_FIREBASE_APP_ID,
}

/**
 * Initalize fire since v9
 * https://dev.to/gthinh/how-to-initialize-a-firebase-app-in-the-new-modular-web-sdk-in-nextjs-187i
 */

async function createFirebaseApp(config: FirebaseOptions) {
  const { initializeApp, getApp } = await import('firebase/app')
  try {
    return getApp()
  } catch {
    return initializeApp(config)
  }
}

/**
 * Initalizes firebase app on the demand as a store that
 * can then be used in derived stores for auth, firestore, and other services
 */
function createApp() {
  let app: FirebaseApp

  const { subscribe } = readable<FirebaseApp>(undefined, (set) => {
    async function init() {
      if (!app) {
        app = await createFirebaseApp(firebaseConfig)
      }
      set(app)
    }

    if (browser) init()
  })

  return { subscribe }
}

export const app = createApp()
