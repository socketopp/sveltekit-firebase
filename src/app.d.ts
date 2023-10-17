// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

// import type { UserRecord } from 'firebase-admin/auth'
// import { RecaptchaVerifier } from 'firebase/auth'
import type { User } from '$lib/types'

declare global {
  namespace App {
    interface Error {}
    interface Locals {
      user: User | null
    }
    interface PageData {}
    interface Platform {
      env: {}
      context: {
        waitUntil(promise: Promise<any>): void
      }
      caches: CacheStorage & { default: Cache }
    }

    interface Window {}
  }
  interface Window {
    recaptchaWidgetId: number
  }
}

export {}
