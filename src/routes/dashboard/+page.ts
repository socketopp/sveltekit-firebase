import type { PageLoadEvent } from './$types'

export async function load({ parent }: PageLoadEvent) {
  console.log('dashboard page.ts load')
  // const { user } = await parent()
  return { user: '' }
}

// import { redirect } from '@sveltejs/kit'
// import { auth, authStore, userStore } from '$lib/firebase'
// import { userStore as sveltefire } from 'sveltefire'
// import type { User } from 'firebase/auth'

// /** @type {import('./$types').PageLoad} */
// export function load({ params, url }) {
//   const user = sveltefire(auth)

//   console.log('1')
//   const unsubscribe = auth.onAuthStateChanged((authUser) => {
//     console.log('onAuthStateChanged', authUser)
//     if (!user) {
//       console.log('')
//       throw redirect(302, '/')
//     }
//     console.log('2')
//     userStore.set(authUser)
//   })

//   console.log('3')
//   unsubscribe()

//   return {}
// }

// const user = userStore(auth)
// const unsubscribe = user.subscribe((user) => {
//   console.log('user wtf', user)
//   if (!user) throw redirect(302, '/')
// })
// unsubscribe()
