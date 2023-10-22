import { z } from 'zod'

import { isValidPhoneNumber } from 'libphonenumber-js'

const phoneSchema = z
  .object({
    phoneNumber: z
      .string({ required_error: 'Phone number is required' })
      .refine((value) => isValidPhoneNumber(value), {
        message: 'Invalid phone number',
      }),
  })
  .required()

const userSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'One does not simply submit without a name' }),
    email: z.string().email(),
  })
  .required()

const otpSchema = z
  .object({
    key1: z.string().length(1, { message: 'Must be exactly 1 character long' }),
    key2: z.string().length(1, { message: 'Must be exactly 1 character long' }),
    key3: z.string().length(1, { message: 'Must be exactly 1 character long' }),
    key4: z.string().length(1, { message: 'Must be exactly 1 character long' }),
    key5: z.string().length(1, { message: 'Must be exactly 1 character long' }),
    key6: z.string().length(1, { message: 'Must be exactly 1 character long' }),
  })
  .required()

type AuthSchema = typeof phoneSchema
type OTPSchema = typeof otpSchema
type UserSchema = typeof userSchema

export { phoneSchema, otpSchema, userSchema }
export type { AuthSchema, OTPSchema, UserSchema }
