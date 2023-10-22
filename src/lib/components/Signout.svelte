<script lang="ts">
  import { auth } from '$lib/stores/auth'
  import { browser } from '$app/environment'
  import { recaptchaSolved } from '$lib/stores/recaptcha'
  import { goto } from '$app/navigation'

  const logout = async () => {
    if (browser) {
      await auth.signOut()
      document.cookie =
        'token' +
        '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict;'
      recaptchaSolved.set(false)
      goto('/')
    }
  }
</script>

<div class="flex flex-col justify-center px-4 items-center">
  <button
    on:click={logout}
    type="button"
    class=" bg-nc border-[1px] border-white rounded-full w-32 sm:w-36 px-3.5 py-2.5 text-sm font- text-white shadow-sm hover:bg-white hover:text-nc focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >Sign out</button
  >
</div>
