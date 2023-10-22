import type { FirebaseError } from 'firebase/app'

type User = {
  uid?: string | undefined
  phoneNumber?: string | undefined
  email?: string | undefined
  name?: string | undefined
}

type CodeResponse = {
  status: boolean
  message: string | FirebaseError['code']
}

export type { User, CodeResponse }
