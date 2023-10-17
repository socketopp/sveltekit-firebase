<script lang="ts">
  import { page } from '$app/stores'

  let title: string = 'There is a glitch in the system'
  let text: string = 'Something unexpected occured'

  $: {
    if ($page.status === 404) {
      title = 'Opps, 404 not found'
    }
    if ($page.error?.message) {
      text = $page.error?.message
    }
  }
  const img: string =
    'https://media.giphy.com/media/g01ZnwAUvutuK8GIQn/giphy.gif'
</script>

<main class="grid min-h-full place-items-center px-6 py-6 lg:px-8">
  <div class="text-center">
    <div class="flex justify-center mb-2">
      <img
        alt="four0four"
        loading="lazy"
        decoding="async"
        data-nimg="1"
        class="aspect-square rounded-2xl bg-zinc-100 h-max object-cover w-max sm:w-[350px] px-4"
        src={img}
      />
    </div>
    <p class="text-base font-semibold text-white">404</p>
    <h1 class="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
      Page not found
    </h1>
    <p class="mt-6 text-base leading-7 text-white">
      Sorry, we couldn’t find the page you’re looking for.
    </p>
    <p class="mt-6 text-base leading-7 text-gray-600">
      We received: {$page.status}: {text}
    </p>
    <div class="mt-10 flex items-center justify-center gap-x-6">
      <a
        href="/"
        class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >Go back home</a
      >
    </div>
  </div>
</main>
