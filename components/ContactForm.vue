<template>
  <div
    id="contact"
    class="mt-8 w-full border-b border-dashed border-red-600 pb-16"
  >
    <h3 class="text-3xl w-full pb-8 font-serif text-center mx-0 px-0">Contact</h3>
    <p class="text-center pb-12">Say hello, report a bug, or make a feature request!</p>
    <div id="letterbird-container"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const script = document.createElement('script')
  script.setAttribute('data-letterbirduser', 'hello-900ea742')
  script.src = 'https://letterbird.co/embed/v1.js'
  const container = document.getElementById('letterbird-container')
  if (container) {
    container.appendChild(script)
  }
})
</script>
