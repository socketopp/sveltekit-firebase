<script lang="ts">
  import '../app.css'
  import Header from '$lib/components/Header.svelte'
  import { goto } from '$app/navigation'
  import { browser } from '$app/environment'
  import { onStateChange, signOut } from '$lib/firebase/client'
  import { showRecaptcha, user } from '$lib/stores/auth'
  import { onMount } from 'svelte'
  import { isLoading } from '$lib/stores/auth'

  const logout = async () => {
    if (browser) {
      await signOut()
      document.cookie =
        'token' +
        '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict;'
      showRecaptcha.set(true)
      user.set(null)
      console.log('goto home')
      goto('/')
    }
  }

  onMount(async () => {
    if (browser) {
      1
      await onStateChange()
    }
  })
  showRecaptcha.set(true)
</script>

<main>
  <Header />
  <slot />
  <div class="flex w-full justify-center" class:hidden={!$showRecaptcha}>
    <div id="recaptcha-container" />
  </div>

  {#if $user && !$isLoading}
    <div class="flex flex-col justify-center px-4 items-center">
      <button
        on:click={logout}
        type="button"
        class=" bg-nc border-[1px] border-white rounded-full w-32 sm:w-36 px-3.5 py-2.5 text-sm font- text-white shadow-sm hover:bg-white hover:text-nc focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >Sign out</button
      >
    </div>
  {/if}
</main>

<style>
</style>
