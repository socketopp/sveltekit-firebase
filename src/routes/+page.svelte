<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client'
  import Loader from '$lib/components/Loader.svelte'
  import type { AuthSchema } from '$lib/schemas'
  import type { PageData } from './$types'
  import {
    disableSubmit,
    user,
    initRecaptcha,
    recaptchaSolved,
  } from '$lib/stores/recaptcha'
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { phoneSignIn } from '$lib/firebase/client'
  import { page } from '$app/stores'
  export let data: PageData
  let errorMessage: string | undefined
  const errorCollection: Record<string, any> = {
    error: 'Unexpected error. Please try again',
    'auth/quota-exceeded':
      'Too many attemps. To prevent abuse, new projects currently have an SMS daily quota of 50/day.',
  }
  const quota = $page.url.searchParams.get('quota')
  if (quota) {
    errorMessage = 'auth/quota-exceeded'
  }
  onMount(() => {
    recaptchaSolved.set(false)
    disableSubmit.set(true)
    if (!$initRecaptcha && $recaptchaSolved) {
      $initRecaptcha
    }
  })

  const { form, enhance, errors, reset, delayed, submitting } =
    superForm<AuthSchema>(data.form, {
      async onUpdated({ form }) {
        errorMessage = undefined
        if (form.valid && Boolean($initRecaptcha) && !$user) {
          const { status, error } = await phoneSignIn(form.data.phoneNumber)
          if (error === 'auth/quota-exceeded') {
            goto('/?quota=true')
          }
          if (status) {
            reset()
            goto('/verification')
          }
          reset()
          errorMessage = error
        }
      },
    })
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Natural Cycles App" />
</svelte:head>

<form method="POST" use:enhance>
  <div class="flex justify-center">
    <div class="my-4 max-w-[35rem] max-lg-md px-4 sm:px-6 lg:px-8 mt-[5%]">
      <h2 class="text-xl font-bold text-white my-4">Authentication Page</h2>
      <p class="max-w-xl text-base leading-7 text-white font-base lg:max-w-lg">
        We'll send you a SMS code verification that you will use in the next
        page.
      </p>
      <div class="mt-2 flex flex-col gap-4 mb-4">
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

          {#if errorMessage}
            <div
              class="my-2 flex flex-row text-red-500 font-semibold text-medium"
            >
              <p class="pr-1">Error:</p>
              <p>
                {errorCollection[errorMessage]}
              </p>
            </div>
          {/if}
          {#if $errors?.phoneNumber}
            <div
              class="my-2 flex flex-row text-red-500 font-semibold text-medium"
            >
              <p class="pr-1">Error:</p>
              <p>
                {$errors?.phoneNumber}
              </p>
            </div>
          {/if}
        </div>
      </div>

      <div class="flex justify-end">
        <button
          class:cursor-not-allowed={$disableSubmit}
          class:bg-stone-400={$disableSubmit}
          class:bg-nc={!$disableSubmit}
          type="submit"
          class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm border-[1px] border-white rounded-3xl text-white transition ease-in-out duration-150"
          disabled={$disableSubmit}
          class:hover:bg-white={!$disableSubmit}
          class:hover:text-nc={!$disableSubmit}
        >
          {#if $submitting || $delayed}
            <Loader />
          {/if}

          Send verification code
        </button>
      </div>
    </div>
  </div>
</form>

<!-- 
  TODO
  how to reinitalize RecaptchaVerifier
  reinitalize the whole page afte calling clear(), it destroys the element from the page
  https://stackoverflow.com/questions/75007825/reset-google-recaptcha-v3-in-angular-firebase-application
 -->

<style>
</style>
