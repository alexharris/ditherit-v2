<template>
  <div class="space-y-3">
    <div>
      <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">
        Stay Updated
      </h2>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Subscribe for occasional updates about new features.
      </p>
    </div>
    <form
      action="https://buttondown.com/api/emails/embed-subscribe/ditherit"
      method="post"
      class="flex flex-col gap-2"
    >
      <label for="bd-email" class="text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
      <UInput type="email" name="email" id="bd-email" placeholder="you@example.com" class="w-full" />
      <UButton type="submit" label="Subscribe" class="w-full justify-center" />
    </form>
  </div>
</template>
