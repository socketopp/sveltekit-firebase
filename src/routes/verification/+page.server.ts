import { otpSchema } from '$lib/schemas'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'

export const load = async () => {
  const form = await superValidate(otpSchema)
  return { form }
}

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, otpSchema)
    if (!form.valid) {
      return fail(400, { form })
    }
    return { form }
  },
}
