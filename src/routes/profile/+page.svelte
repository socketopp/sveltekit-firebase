<script lang="ts">
  import type { UserSchema } from '$lib/schemas'
  import { superForm } from 'sveltekit-superforms/client'
  import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
  import { firestore } from '$lib/stores/firestore'
  import Skeleton from '$lib/components/Skeleton.svelte'
  import type { PageData } from './$types'
  export let data: PageData
  let pageLoading: boolean = true

  const { form, errors, enhance, delayed, restore, constraints } =
    superForm<UserSchema>(data.form, {
      onSubmit() {
        pageLoading = true
      },
      async onUpdated({ form }) {
        pageLoading = false
        if (form.valid && data?.user) {
          firestore.subscribe(async ($firestore) => {
            if (!$firestore) return
            const usersCollection = collection($firestore, 'users')
            const userRef = doc(usersCollection, data.user?.phoneNumber)
            await setDoc(userRef, form.data)
          })
        }
      },
    })

  firestore.subscribe(async ($firestore) => {
    if (!$firestore) return
    try {
      const userDoc = doc($firestore, `users/${data.user?.phoneNumber}`)
      const userSnapshot = await getDoc(userDoc)
      const { email, name } = userSnapshot.data() || {}
      form.update(
        ($form) => {
          $form.email = email
          $form.name = name
          pageLoading = false
          return $form
        },
        { taint: false },
      )
    } catch (error) {
      console.error('Firestore exception', error)
    } finally {
      pageLoading = false
    }
  })
</script>

<svelte:head>
  <title>Profile</title>
  <meta name="description" content="Natural Cycles App" />
</svelte:head>

<div class="flex justify-center">
  <div
    class="my-4 w-[35rem] max-lg-md px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8 mt-[5%]"
  >
    <h1 class="text-xl font-bold text-white my-4">Profile</h1>
    <form method="POST" use:enhance>
      {#if pageLoading || $delayed}
        <Skeleton />
      {:else}
        <div class="flex flex-col gap-4">
          <div>
            <label
              for="email"
              class="block text-sm font-semibold leading-6 text-white"
              >Email</label
            >
            <div class="mt-2">
              <input
                required
                bind:value={$form.email}
                type="email"
                name="email"
                id="email"
                class="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="alice@naturalcycles.com"
              />
            </div>

            {#if $errors.email}
              <p class="mt-2 text-red-500 font-semibold text-medium">
                {$errors.email}
              </p>
            {/if}
          </div>

          <div>
            <label
              for="name"
              class="block text-sm font-semibold leading-6 text-white"
              >Name</label
            >
            <div class="mt-2">
              <input
                bind:value={$form.name}
                type="text"
                name="name"
                id="name"
                class="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Alice"
              />
            </div>
            {#if $errors.name}
              <p class="mt-2 text-red-500 font-semibold text-medium">
                {$errors.name}
              </p>
            {/if}
          </div>
          <div class="flex justify-end w-full">
            <button
              type="submit"
              class="bg-nc border-[1px] border-white rounded-full w-32 sm:w-36 px-3.5 py-2.5 text-sm font- text-white shadow-sm hover:bg-white hover:text-nc focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >Save
            </button>
          </div>
        </div>
      {/if}
    </form>
  </div>
</div>

<style>
</style>
