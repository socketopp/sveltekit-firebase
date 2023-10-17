import { redirect } from '@sveltejs/kit'
import { authenticateUser } from '$lib/firebase/admin'

const authRoutes: string[] = ['/dashboard']
const routes: string[] = ['/', '/verification']

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  event.locals.user = await authenticateUser(event)

  if (routes.includes(event.url.pathname) && event.locals.user) {
    throw redirect(307, '/dashboard')
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

//   // console.log('event', event.url)
//   console.log('event.locals.user', event.locals.user)
// if (event.url.pathname.startsWith('/dashboard') && !event.locals.user) {
//   console.log('not validated')
//   event.cookies.set('token', '', {
//     maxAge: -1,
//     sameSite: 'strict',
//     path: '/',
//   })
//   throw redirect(307, '/')
// }

// if (
//   event.url.pathname === '/' ||
//   (event.url.pathname.startsWith('/verification') && event.locals.user)
// ) {
//   console.log('validated')
// }
