<script lang="ts">
  import { fly } from 'svelte/transition'
  import { cubicIn, cubicOut } from 'svelte/easing'
  export let url: string
</script>

{#key url}
  <div
    in:fly={{ easing: cubicOut, x: -200, duration: 300, delay: 300 }}
    out:fly={{ easing: cubicIn, x: 200, duration: 300 }}
  >
    <slot />
  </div>
{/key}
