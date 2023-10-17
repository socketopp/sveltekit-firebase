<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client'
  import Spinner from '$lib/components/Spinner.svelte'
  import type { AuthSchema } from '$lib/schemas'
  import type { PageData } from './$types'
  import { initRecaptcha, phoneSignIn } from '$lib/firebase/client'
  import {
    disableSubmit,
    user,
    isLoading,
    recaptchaStore,
    showRecaptcha,
  } from '$lib/stores/auth'
  export let data: PageData
  import { get } from 'svelte/store'
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'

  onMount(() => {
    console.log('home! show recaptcha?', $showRecaptcha)
    // const recaptchaVerifier = get(recaptchaStore)
    // if (recaptchaVerifier) {
    //   console.log('home calling clear')
    //   recaptchaVerifier.clear()
    // }

    if ($showRecaptcha && !$user) {
      isLoading.set(false)
      initRecaptcha()
    }
  })

  const { form, enhance, delayed, errors, reset } = superForm<AuthSchema>(
    data.form,
    {
      onSubmit(event) {
        isLoading.set(true)
      },

      async onUpdated({ form }) {
        isLoading.set(false)
        showRecaptcha.set(false)

        if (!form.valid) {
          disableSubmit.set(false)
          const recaptchaVerifier = get(recaptchaStore)
          if (recaptchaVerifier) {
            recaptchaVerifier.clear()
            initRecaptcha()

            showRecaptcha.set(true)
          }
          return
        }
        if (form.valid && $recaptchaStore && !$user) {
          const codeSent = await phoneSignIn(form.data.phoneNumber)
          if (codeSent) {
            reset()
            console.log('goto verification')

            goto('/verification')
          }
        }
      },
    },
  )
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Natural Cycles App" />
</svelte:head>

<form method="POST" use:enhance>
  <div class="flex justify-center">
    {#if $isLoading}
      <Spinner message="Sending you a 📱 across the 🌎" />
    {:else}
      <div class="my-4 max-w-[35rem] max-lg-md px-4 sm:px-6 lg:px-8 mt-[5%]">
        <h2 class="text-xl font-bold text-white my-4">Authentication Page</h2>
        <p
          class="max-w-xl text-base leading-7 text-white font-base lg:max-w-lg"
        >
          We'll send you a SMS code verification that you will use in the next
          page.
        </p>
        <div class="mt-2 flex flex-col gap-4 mb-8">
          <div>
            <label
              for="phone-number"
              class="block text-sm font-semibold leading-6 text-white"
              >Mobile Number</label
            >
            <div class="relative mt-2 rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 flex items-center">
                <label for="country" class="sr-only">Country</label>
                <select
                  id="country"
                  name="country"
                  autocomplete="country"
                  class="h-full rounded-md border-0 bg-transparent py-0 pl-3 pr-7 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                >
                  <option>SE</option>
                </select>
              </div>
              <input
                required
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                class="block w-full rounded-md border-0 py-1.5 pl-16 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="+46 (76) 123-4567"
                bind:value={$form.phoneNumber}
              />
            </div>

            {#if $errors?.phoneNumber}
              <div class="my-2 flex flex-row">
                <p class="font-bold">Error: &nbsp;</p>
                Phone number is malformed
              </div>
            {/if}
          </div>
        </div>

        <div class="flex gap-4 mt-4 flex-wrap justify-end">
          <div class="flex flex-col self-center">
            <button
              disabled={$disableSubmit}
              type="submit"
              class:cursor-not-allowed={$disableSubmit}
              class:bg-gray-500={$disableSubmit}
              class:hover:bg-white={!$disableSubmit}
              class:hover:text-nc={!$disableSubmit}
              class:border-[1px]={!$disableSubmit}
              class="bg-nc border-white rounded-full px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >Send verification code
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</form>

<!-- // defaultValidator: 'keep',
// validators: {
//   phoneNumber: (number) => {
//     console.log('number', number)
//     if (!number) return 'Missing phone number'
//     if (phoneRegex.test(number)) return 'Phone number is malformed1'
//     return null
//   },
// },

// onSubmit(event) {
//   isLoading.set(true)
// }, -->

<style>
</style>
