<script setup>
useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Dither it!'
const description = 'Free online image dithering tool. Floyd-Steinberg, Atkinson, Bayer ordered dithering, animated GIFs, and multi-image upload — processed locally in your browser.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image',
  twitterImage: '/og-image.png'
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
