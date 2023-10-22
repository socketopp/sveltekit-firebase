import type { PageLoadEvent } from './$types'
export async function load({ parent, data }: PageLoadEvent) {
  const { user } = await parent()
  return { ...data, user }
}
