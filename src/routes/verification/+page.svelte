<script lang="ts">
  import type { PageData } from './$types'
  export let data: PageData
  import { superForm } from 'sveltekit-superforms/client'
  import type { OTPSchema } from '$lib/schemas'
  import { goto } from '$app/navigation'
  import { initRecaptcha } from '$lib/stores/recaptcha'
  import type { CodeResponse } from '$lib/types'
  import { verifyCode } from '$lib/firebase/client'
  import Loader from '$lib/components/Loader.svelte'

  let codeResponse: CodeResponse = { status: true, message: 'error' }
  const errorCollection: Record<string, any> = {
    error: 'Code have not been sent. Please try again',
    'auth/internal-error': 'Internal Server Error. Please try again',
    'auth/invalid-verification-code': 'Wrong Code. Please try again.',
  }

  const { form, enhance, delayed, submitting, constraints } =
    superForm<OTPSchema>(data.form, {
      async onUpdated({ form }) {
        if (form.valid) {
          const code = Object.values(form.data).reduce(
            (acc, digit) => acc + digit,
          )
          const response = await verifyCode(code)
          if (response.status) {
            $initRecaptcha.clear()
            goto('/profile')
          } else {
            codeResponse = response
          }
        }
      },
    })

  const onKeyDown = (event: any) => {
    if (event.code === 'Backspace') {
      form.set({ ...$form, [event.target.id]: '' })
      const previousSibling = event?.target?.previousElementSibling
      if (previousSibling) {
        ;(previousSibling as HTMLElement).focus()
      }
    }
  }

  const onKeyPress = (event: any) => {
    const nextSibling = event.target.nextElementSibling
    if (nextSibling) {
      ;(nextSibling as HTMLElement).focus()
    }
  }
</script>

<svelte:window on:keypress={onKeyPress} on:keydown={onKeyDown} />
<svelte:head>
  <title>Verification</title>
  <meta name="description" content="Natural Cycles App" />
</svelte:head>

<form method="POST" use:enhance>
  <div class="flex justify-center">
    <div
      class="my-4 w-[35rem] max-lg-md px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8 mt-[7%]"
    >
      <div
        class="bg-white rounded-xl flex flex-col justify-center overflow-hidden py-12"
      >
        <div class="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div
            class="flex flex-col items-center justify-center text-center space-y-2"
          >
            <div class="text-3xl">
              <p class="font-semibold text-black">Email Verification</p>
            </div>
            <div class="flex flex-row text-sm font-medium text-black">
              <p>We have sent a code to your phone</p>
            </div>
          </div>

          <div>
            <div class="flex flex-col space-y-16">
              <div
                class="flex flex-row items-center justify-evenly mx-auto w-full text-black gap-x-2"
              >
                <input
                  {...$constraints.key1}
                  maxlength="1"
                  class="w-10 sm:w-16 h-16 flex flex-col items-center justify-center text-center px-1 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                  type="text"
                  name="key1"
                  id="key1"
                  bind:value={$form.key1}
                />

                <input
                  {...$constraints.key2}
                  maxlength="1"
                  class="w-10 sm:w-16 h-16 flex flex-col items-center justify-center text-center px-1 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                  type="text"
                  name="key2"
                  id="key2"
                  bind:value={$form.key2}
                />
                <input
                  {...$constraints.key3}
                  maxlength="1"
                  class="w-10 sm:w-16 h-16 flex flex-col items-center justify-center text-center px-1 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                  type="text"
                  name="key3"
                  id="key3"
                  bind:value={$form.key3}
                />
                <input
                  {...$constraints.key4}
                  maxlength="1"
                  class="w-10 sm:w-16 h-16 flex flex-col items-center justify-center text-center px-1 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                  type="text"
                  name="key4"
                  id="key4"
                  bind:value={$form.key4}
                />

                <input
                  {...$constraints.key5}
                  maxlength="1"
                  class="w-10 sm:w-16 h-16 flex flex-col items-center justify-center text-center px-1 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                  type="text"
                  name="key5"
                  id="key5"
                  bind:value={$form.key5}
                />

                <input
                  {...$constraints.key6}
                  maxlength="1"
                  class="w-10 sm:w-16 h-16 flex flex-col items-center justify-center text-center px-1 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                  type="text"
                  name="key6"
                  id="key6"
                  bind:value={$form.key6}
                />
              </div>

              <div class="flex flex-col space-y-5">
                <div>
                  <button
                    type="submit"
                    class="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none font-semibold text-white text-sm shadow-sm"
                  >
                    {#if $submitting || $delayed}
                      <Loader />
                    {/if}
                    Verify Account
                  </button>
                </div>

                {#if !codeResponse?.status}
                  <div
                    class="flex flex-col items-center justify-center text-center text-md space-x-1 text-red-500"
                  >
                    <p class="font-semibold">Error message</p>
                    <p class="flex flex-row items-center text-red-500">
                      {errorCollection[codeResponse?.message]}
                    </p>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</form>

<style>
</style>
