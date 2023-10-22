import { browser } from '$app/environment'
import { auth } from '$lib/stores/auth'
import {
  type User,
  type ConfirmationResult,
  RecaptchaVerifier,
  useDeviceLanguage,
  type Auth,
} from 'firebase/auth'
import { derived, writable, type Readable, get } from 'svelte/store'

export const disableSubmit = writable<boolean>(true)
export const recaptchaSolved = writable<boolean>(false)
export const user = writable<User | null>(null)
export const confirmationResultStore = writable<ConfirmationResult | null>()
export const recaptchaStore = writable<RecaptchaVerifier | null>()

const clear = (verifier: RecaptchaVerifier) => {
  verifier.clear()
}

const createRecaptcha = () => {
  const { subscribe } = derived<Readable<Auth>, RecaptchaVerifier>(
    auth,
    ($auth, set) => {
      let recaptchaVerifier: RecaptchaVerifier
      function init() {
        try {
          if ($auth) {
            useDeviceLanguage($auth)

            recaptchaVerifier = new RecaptchaVerifier(
              $auth,
              'recaptcha-container',
              {
                size: 'normal',
                callback: () => {
                  recaptchaSolved.set(true)
                  disableSubmit.set(false)
                },
                'expired-callback': () => {
                  console.error('expired-callback')
                  clear(recaptchaVerifier)
                },
                'error-callback': (err: Error) => {
                  console.error('error-callback', err)
                  clear(recaptchaVerifier)
                },
              },
            )
            /**
             * Called when user is done with recaptcha
             *  recaptchaVerifier.verify().then((e: unknown) => {
             *  })
             */
            recaptchaVerifier.render().then((widgetId) => {
              window['recaptchaWidgetId'] = widgetId
            })
            set(recaptchaVerifier)
          }
        } catch (error) {
          if (recaptchaVerifier) clear(recaptchaVerifier)
          console.error('createRecaptcha error', error)
        }
      }

      const recaptchaSolvedStore = get(recaptchaSolved)
      if (browser && !recaptchaSolvedStore) {
        init()
      }
    },
  )
  return {
    subscribe,
  }
}

export const initRecaptcha = createRecaptcha()
