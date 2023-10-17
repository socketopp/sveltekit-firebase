import type { LayoutServerLoadEvent } from './$types'

export async function load({ cookies, locals }: LayoutServerLoadEvent) {
  return {
    user: locals.user,
  }
}
