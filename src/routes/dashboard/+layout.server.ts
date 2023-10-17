import { auth } from '$lib/firebase/admin'
import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoadEvent } from './$types'

export async function load({ cookies, locals }: LayoutServerLoadEvent) {
  console.log('dashboard layout load')
  return {
    user: locals.user,
  }
}
