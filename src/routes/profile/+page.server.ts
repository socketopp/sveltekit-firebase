import { userSchema } from '$lib/schemas'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'

export const load = async ({ parent }) => {
  const { user } = await parent()
  const form = await superValidate(userSchema)
  return { form, user }
}

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, userSchema)
    if (!form.valid) {
      return fail(400, { form })
    }
    return { form }
  },
}
