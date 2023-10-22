import { derived, type Readable } from 'svelte/store'
import { browser, dev } from '$app/environment'
import type { Auth } from 'firebase/auth'
import type { FirebaseApp } from 'firebase/app'
import { app } from '$lib/stores/app'
/**
 * load the firebase auth client as a store and provide an API to access its methods
 * this depends on the app store and will also only be loaded on demand
 * so no firebase JS loaded unless the page needs it
 */
const createAuth = () => {
  let auth: Auth
  const { subscribe } = derived<Readable<FirebaseApp>, Auth>(
    app,
    ($app, set) => {
      async function init() {
        if ($app && !auth) {
          const { getAuth } = await import('firebase/auth')
          auth = getAuth($app)
          /**
           * used for testing purposes
           */
          if (dev) auth.settings.appVerificationDisabledForTesting = true

          set(auth)
        }
      }
      if (browser) init()
    },
  )

  async function signOut() {
    try {
      const { signOut } = await import('firebase/auth')
      await signOut(auth)
    } catch (error) {
      console.error('signOut error', error)
    }
  }

  return {
    subscribe,
    signOut,
  }
}

export const auth = createAuth()
