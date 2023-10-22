import { derived, type Readable } from 'svelte/store'
import { browser } from '$app/environment'
import type { FirebaseApp } from 'firebase/app'
import { app } from '$lib/stores/app'
import type { Firestore } from 'firebase/firestore'

const createFirestore = () => {
  let db: Firestore
  const { subscribe } = derived<Readable<FirebaseApp>, Firestore>(
    app,
    ($app, set) => {
      async function init() {
        if ($app && !db) {
          const { getFirestore } = await import('firebase/firestore')
          db = getFirestore($app)
          set(db)
        }
      }
      if (browser) init()
    },
  )

  return {
    subscribe,
  }
}

export const firestore = createFirestore()
