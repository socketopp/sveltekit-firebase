type User = {
  uid: string | undefined
  phoneNumber: string | undefined
}

type CodeResponse = {
  status: boolean
  message: string
}

export type { User, CodeResponse }
