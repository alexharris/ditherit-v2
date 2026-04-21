<script setup lang="ts">
const { data: post } = await useAsyncData('latest-post', () =>
  queryCollection('blog').order('date', 'DESC').first()
)
</script>

<template>
  <NuxtLink
    v-if="post"
    to="/blog"
    class="block rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:hover:bg-gray-800"
  >
    <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
      From the blog
    </p>
    <p class="text-sm font-medium text-gray-800 dark:text-gray-200">
      {{ post.title }}
    </p>
    <p class="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
      {{ post.description }}
    </p>
  </NuxtLink>
</template>
