<script setup lang="ts">
const { data: post } = await useFetch('/blog-latest.json')
</script>

<template>
  <NuxtLink
    v-if="post"
    to="/blog"
    class="block"
  >
    <UCard
      variant="soft"
      :ui="{ root: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer shadow-sm', body: 'p-3 sm:p-3' }"
    >
      <p class="mb-1 text-sm font-medium text-highlighted">
        ✏️ From the blog
      </p>
      <p class="text-sm font-medium text-gray-800 dark:text-gray-100">
        {{ post.title }}
      </p>
      <p class="mt-0.5 line-clamp-2 text-xs text-gray-800 dark:text-gray-100">
        {{ post.description }}
      </p>
    </UCard>
  </NuxtLink>
</template>
