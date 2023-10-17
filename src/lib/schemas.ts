import { z } from 'zod'

import { isValidPhoneNumber } from 'libphonenumber-js'

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
)

const phoneSchema = z
  .object({
    phoneNumber: z
      .string({ required_error: 'Phone number is required' })
      .refine((value) => isValidPhoneNumber(value), {
        message: 'Invalid phone number',
      }),
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

export { phoneSchema, otpSchema, type AuthSchema, type OTPSchema }

// import parsePhoneNumber from 'libphonenumber-js'

// const phoneSchema = z.string().refine((value) => isValidPhoneNumber(value), {
//   message: 'Invalid phone number',
// })

// const phoneSchema = z
//   .object({
//     phoneNumber: z
//       .string({ required_error: 'Phone number is required' })
//       .regex(phoneRegex, 'Phone number is malformed'),
//   })
//   .required()
