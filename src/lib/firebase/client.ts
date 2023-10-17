/**
 * client.ts uses firebase client side libraries.
 */

import { initializeApp, getApps, FirebaseError } from 'firebase/app'
import cookie from 'cookie'
import {
  getAuth,
  signInWithPhoneNumber,
  signInWithCredential,
  PhoneAuthProvider,
  RecaptchaVerifier,
  useDeviceLanguage,
} from 'firebase/auth'
import {
  PUBLIC_FIREBASE_PROJECT_ID,
  PUBLIC_FIREBASE_API_KEY,
  PUBLIC_FIREBASE_AUTH_DOMAIN,
  PUBLIC_FIREBASE_STORAGE_BUCKET,
  PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
  PUBLIC_FIREBASE_APP_ID,
} from '$env/static/public'
import {
  confirmationResultStore,
  recaptchaStore,
  user,
  showRecaptcha,
  disableSubmit,
} from '$lib/stores/auth'
import { get } from 'svelte/store'
import type { CodeResponse } from '$lib/types'

function makeApp() {
  const apps = getApps()
  if (apps.length > 0) {
    return apps[0]!
  }

  return initializeApp({
    apiKey: PUBLIC_FIREBASE_API_KEY,
    authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
    appId: PUBLIC_FIREBASE_APP_ID,
    databaseURL: `https://${PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
  })
}

const firebase = makeApp()
const auth = getAuth(firebase)
auth.settings.appVerificationDisabledForTesting = true

const initRecaptcha = () => {
  console.log(1)
  try {
    console.log(2)
    showRecaptcha.set(true)
    console.log(3)
    const verifier = get(recaptchaStore)
    console.log(4)
    const recaptcha = get(showRecaptcha)
    console.log(5)

    if (!auth || !recaptcha) {
      console.log('missing stuff')
      return
    }
    console.log(6)
    let recaptchaVerifier = null
    try {
      console.log(7)
      useDeviceLanguage(auth)

      console.log(8)
      const recaptchaParameters = {
        size: 'normal',
        'expired-callback': (e: any) => {
          console.log('expired-callback', e)
        },
        'error-callback': (err: any) => {
          console.log('error-callback', err)
        },
        callback: () => {
          // User clicked the Recaptcha
          console.log('callback')
          disableSubmit.set(false)
          showRecaptcha.set(false)
        },
      }

      console.log(9)
      recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        recaptchaParameters,
      )
      console.log(10)
      recaptchaVerifier.render().then((widgetId) => {
        console.log('widgetId', widgetId)

        window['recaptchaWidgetId'] = widgetId
      })
      console.log(11)
      // await recaptchaVerifier.verify()

      recaptchaVerifier.verify().then((e: any) => {
        console.log('and then:PPP', e)
      })

      recaptchaStore.set(recaptchaVerifier)
    } catch (error) {
      console.log('errr showRecaptcha', recaptcha)
      console.log('initRecaptcha error', error)
    }
  } catch (error) {
    console.log('catching everythuuung', error)
  }
}

async function phoneSignIn(phoneNumber: string) {
  try {
    const recaptchaVerifier = get(recaptchaStore)
    if (!recaptchaVerifier) return

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      recaptchaVerifier,
    )

    recaptchaStore.set(recaptchaVerifier)
    confirmationResultStore.set(confirmationResult)
    return true
  } catch (error) {
    console.log('Error phoneSignIn', error)
    return null
  }
}

async function verifyCode(code: string): Promise<CodeResponse> {
  try {
    console.log(1)
    console.log(2)
    console.log(3)
    const confirmationResult = get(confirmationResultStore)
    console.log(4)
    if (!confirmationResult) return { status: false, message: 'error' }
    console.log(5)

    const { user: data } = await confirmationResult.confirm(code)
    console.log(6)
    const userCredential = PhoneAuthProvider.credential(
      confirmationResult.verificationId,
      code,
    )
    console.log(7)

    signInWithCredential(auth, userCredential).then((user) => {
      console.log('signInWithCredential isee:PP')
    })
    console.log(8)
    user.set(data)
    const recaptchaVerifier = get(recaptchaStore)
    recaptchaVerifier?.clear()
    return { status: true, message: 'success' }
    // const { user: data } = await signInWithCredential(auth, userCredential)

    // console.log('verifyCode user data', data)
  } catch (error: any) {
    console.log('Error verifyCode', error)
    if (error instanceof FirebaseError) {
      return { status: false, message: error?.code }
    }
    return { status: false, message: 'error' }
  }
}

async function signOut() {
  return auth.signOut()
}

const onStateChange = async () => {
  auth.onIdTokenChanged(async (newUser) => {
    const tokenCurrentlySet =
      cookie.parse(document.cookie)['token'] !== undefined
    const token = newUser ? await newUser?.getIdToken() : undefined
    document.cookie = cookie.serialize('token', token ?? '', {
      path: '/',
      maxAge: token ? undefined : 0,
      sameSite: 'strict',
    })
    user.set(newUser)
  })
  // refresh the ID token every 10 minutes
  setInterval(async () => {
    if (auth.currentUser) {
      await auth.currentUser.getIdToken(true)
    }
  }, 10 * 60 * 1000)
}

export {
  firebase,
  auth,
  phoneSignIn,
  verifyCode,
  signOut,
  onStateChange,
  initRecaptcha,
}

// const provider = new PhoneAuthProvider(auth)
// const options = {
//   codeTime: 60000,
// }
// await provider.verifyPhoneNumber(phoneNumber, options, recaptchaVerifier)
// TODO timeout?
// recaptchaVerifier.render().then((widgetId) => {
//   console.log('widgetId', widgetId)
//   window['recaptchaWidgetId'] = widgetId
// })
// callback: function (event: any) {
//   console.log('initRecaptcha callback widgetId?', event)
// },
