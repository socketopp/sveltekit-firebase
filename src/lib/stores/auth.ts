import type { User, ConfirmationResult, RecaptchaVerifier } from 'firebase/auth'
import { writable } from 'svelte/store'

export const disableSubmit = writable<boolean>(true)
export const showRecaptcha = writable<boolean>(false)
export const isLoading = writable<boolean>(false)
export const user = writable<User | null>(null)
export const confirmationResultStore = writable<ConfirmationResult | null>()
export const recaptchaStore = writable<RecaptchaVerifier | null>()
