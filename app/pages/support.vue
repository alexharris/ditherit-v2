<script setup lang="ts">
definePageMeta({ layout: 'content' })
useSeoMeta({ title: 'Support — Dither it!' })
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-4">
      <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
        Dither it! is a free, open-source, ad-free tool built and maintained in my spare time.
        If you find it useful, any support is genuinely appreciated — it helps keep the project alive and motivated.
      </p>

      <div class="pt-2">
        <UButton
          label="Support on Ko-fi"
          to="https://ko-fi.com/alexharris6"
          target="_blank"
          size="lg"
          color="primary"
          trailing-icon="i-lucide-arrow-up-right"
        />
      </div>
    </div>

    <USeparator />

    <div class="space-y-3">
      <h2 class="text-base font-semibold text-gray-800 dark:text-gray-100">
        Other ways to help
      </h2>
      <ul class="space-y-2 text-sm text-gray-500 dark:text-gray-400">
        <li class="flex items-start gap-2">
          <UIcon name="i-lucide-star" class="mt-0.5 size-4 shrink-0 text-gray-500" />
          <span>Star or share the <a href="https://github.com/alexharris/ditherit-v3" target="_blank" rel="noopener noreferrer" class="text-[--ui-primary] underline underline-offset-2 hover:opacity-80">GitHub repo</a></span>
        </li>
        <li class="flex items-start gap-2">
          <UIcon name="i-lucide-bug" class="mt-0.5 size-4 shrink-0 text-gray-500" />
          <span>Report bugs or suggest features on <a href="https://github.com/alexharris/ditherit-v3/issues" target="_blank" rel="noopener noreferrer" class="text-[--ui-primary] underline underline-offset-2 hover:opacity-80">GitHub Issues</a></span>
        </li>
        <li class="flex items-start gap-2">
          <UIcon name="i-lucide-share-2" class="mt-0.5 size-4 shrink-0 text-gray-500" />
          <span>Share something you made with Dither it!</span>
        </li>
      </ul>
    </div>
  </div>
</template>
