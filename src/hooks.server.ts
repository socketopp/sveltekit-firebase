import { redirect } from '@sveltejs/kit'
import { authenticateUser } from '$lib/firebase/admin'

const authRoutes: string[] = ['/profile']
const routes: string[] = ['/', '/verification']

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  event.locals.user = await authenticateUser(event)
  if (routes.includes(event.url.pathname) && event.locals.user) {
    throw redirect(307, '/profile')
  }
  if (authRoutes.includes(event.url.pathname) && !event.locals.user) {
    event.cookies.set('token', '', {
      maxAge: -1,
      sameSite: 'strict',
      path: '/',
    })
    throw redirect(307, '/')
  }

  const response = await resolve(event)
  return response
}
