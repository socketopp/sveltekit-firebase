import type { LayoutServerLoadEvent } from './$types'

export async function load({ locals }: LayoutServerLoadEvent) {
  return {
    user: locals.user,
  }
}
