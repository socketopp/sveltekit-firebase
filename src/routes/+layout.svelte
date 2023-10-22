<script lang="ts">
  import '../app.css'
  import Header from '$lib/components/Header.svelte'
  import { recaptchaSolved } from '$lib/stores/recaptcha'
  import { user } from '$lib/stores/user'
  import Spinner from '$lib/components/Spinner.svelte'
  import PageTransition from '$lib/components/Transition.svelte'
  import { beforeNavigate, afterNavigate } from '$app/navigation'
  import Signout from '$lib/components/Signout.svelte'
  import { page } from '$app/stores'
  import type { PageData } from './$types'

  export let data: PageData
  let isLoading = false

  beforeNavigate(({ to }) => {
    if (to?.route.id) {
      isLoading = true
    }
  })
  afterNavigate(() => (isLoading = false))
  if ($page.url.pathname === '/verification') recaptchaSolved.set(true)
</script>

<main>
  <Header />

  <PageTransition url={data.url}>
    {#if isLoading}
      <Spinner message="Loading... 🌎" />
    {:else}
      <slot />
      {#if $user}
        <Signout />
      {/if}
    {/if}
  </PageTransition>
  <div class="flex w-full justify-center" class:hidden={$recaptchaSolved}>
    <div class="flex w-full justify-center">
      <div id="recaptcha-container" />
    </div>
  </div>
</main>

<style>
</style>
