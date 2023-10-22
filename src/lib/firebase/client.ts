/**
 * client.ts uses firebase client side libraries.
 */
import { FirebaseError } from 'firebase/app'
import cookie from 'cookie'
import { signInWithPhoneNumber } from 'firebase/auth'
import { auth } from '$lib/stores/auth'
import {
  confirmationResultStore,
  recaptchaStore,
  user,
  initRecaptcha,
} from '$lib/stores/recaptcha'
import { get } from 'svelte/store'
import type { CodeResponse } from '$lib/types'
import { browser } from '$app/environment'

const onStateChange = async () => {
  if (!browser) return
  const { onIdTokenChanged } = await import('firebase/auth')

  auth.subscribe(($auth) => {
    if ($auth) {
      onIdTokenChanged($auth, async (newUser) => {
        const token = newUser ? await newUser?.getIdToken() : undefined
        document.cookie = cookie.serialize('token', token ?? '', {
          path: '/',
          maxAge: token ? undefined : 0,
          sameSite: 'strict',
        })
        user.set(newUser)
      })
      setInterval(async () => {
        if ($auth.currentUser) {
          await $auth.currentUser.getIdToken(true)
        }
      }, 10 * 60 * 1000)
    }
  })
}

async function phoneSignIn(phoneNumber: string) {
  const { auth: store } = await import('$lib/stores/auth')
  try {
    const auth = get(store)
    const recaptchaVerifier = get(initRecaptcha)

    if (!recaptchaVerifier) return { status: false, error: 'error' }
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      recaptchaVerifier,
    )

    recaptchaStore.set(recaptchaVerifier)
    confirmationResultStore.set(confirmationResult)
    return { status: true }
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      return { status: false, error: error?.code }
    }
    console.error('Error phoneSignIn', error)
    return {
      status: false,
      error: 'error',
    }
  }
}

async function verifyCode(code: string): Promise<CodeResponse> {
  try {
    const confirmationResult = get(confirmationResultStore)
    if (!confirmationResult) return { status: false, error: 'error' }

    const { user: data } = await confirmationResult.confirm(code)
    user.set(data)
    return { status: true, error: 'success' }
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      return { status: false, error: error?.code }
    }
    console.error('Error verifyCode', error)
    return { status: false, error: 'error' }
  }
}

onStateChange()

export { onStateChange, phoneSignIn, initRecaptcha, verifyCode }

/**
 * Note from docs regarding verifyCode. 
 * If need intermediate AuthCredential object, skip calling .confirm and use PhoneAuthProvider.
 * 
 * Interesting note: it throws (auth/code-expired) for real phone numbers but not fake ones. 

const userCredential = PhoneAuthProvider.credential(
  confirmationResult.verificationId,
  code,
)
const { auth: authStore } = await import('$lib/stores/auth')
const auth = get(authStore)
signInWithCredential(auth, userCredential)
  .then((user: UserCredential) => {})
  .catch((err) => {})
*/
