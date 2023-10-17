import { phoneSchema } from '$lib/schemas'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  const form = await superValidate(phoneSchema)
  return { form }
}

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, phoneSchema)
    if (!form.valid) {
      return fail(400, { form })
    }
    return { form }
  },
}
