<script setup lang="ts">
const { data: post } = await useAsyncData('latest-post', () =>
  queryCollection('blog').order('date', 'DESC').first()
)
</script>

<template>
  <UCard
    v-if="post"
    to="/blog"
    variant="soft"
    :ui="{ root: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors', body: 'p-3 sm:p-3' }"
  >
    <p class="mb-1 text-sm font-medium text-highlighted">
      ✏️ From the blog
    </p>
    <p class="text-sm font-medium text-gray-800 dark:text-gray-100">
      {{ post.title }}
    </p>
    <p class="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
      {{ post.description }}
    </p>
  </UCard>
</template>
