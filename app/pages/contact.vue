<script setup lang="ts">
definePageMeta({ layout: 'content' })
useSeoMeta({ title: 'Contact — Dither it!' })

const toast = useToast()
const isSubmitting = ref(false)
const submitted = ref(false)

async function handleSubmit(event: Event) {
  const form = event.target as HTMLFormElement
  isSubmitting.value = true
  try {
    const formData = new FormData(form)
    const response = await fetch('/__forms.html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData as any).toString()
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    submitted.value = true
    form.reset()
  } catch {
    toast.add({
      title: 'Failed to send',
      description: 'Please try again later.',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-5">
    <!-- Hidden form for Netlify detection at build time -->
    <form name="contact" netlify netlify-honeypot="bot-field" hidden>
      <input type="text" name="name" />
      <input type="email" name="email" />
      <textarea name="message"></textarea>
    </form>

    <div
      v-if="submitted"
      class="flex flex-col items-center gap-3 py-10 text-center"
    >
      <div class="flex size-12 items-center justify-center rounded-full bg-green-50 dark:bg-green-950">
        <UIcon name="i-lucide-check" class="size-6 text-green-500" />
      </div>
      <div>
        <p class="text-base font-medium text-gray-800 dark:text-gray-200">
          Message sent!
        </p>
        <p class="mt-1 text-sm text-gray-500">
          Thanks for your feedback. I'll get back to you within a few days.
        </p>
      </div>
      <UButton
        label="Send another"
        color="neutral"
        variant="ghost"
        size="sm"
        @click="submitted = false"
      />
    </div>

    <template v-else>
      <p class="text-base text-gray-600 dark:text-gray-400">
        Have a feature request, found a bug, or just want to say hi?
      </p>

      <form
        name="contact"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        class="space-y-4"
        @submit.prevent="handleSubmit"
      >
        <input type="hidden" name="form-name" value="contact" />
        <p class="hidden">
          <label>Don't fill this out if you're human: <input name="bot-field" /></label>
        </p>

        <div class="space-y-2">
          <label for="contact-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            id="contact-name"
            type="text"
            name="name"
            required
            class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-ditherit dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-ditherit"
          />
        </div>

        <div class="space-y-2">
          <label for="contact-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            id="contact-email"
            type="email"
            name="email"
            required
            class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-ditherit dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-ditherit"
          />
        </div>

        <div class="space-y-2">
          <label for="contact-message" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
          <textarea
            id="contact-message"
            name="message"
            rows="5"
            required
            class="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-ditherit dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-ditherit"
          ></textarea>
        </div>

        <UButton
          type="submit"
          label="Send message"
          icon="i-lucide-send"
          color="primary"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        />
      </form>
    </template>
  </div>
</template>
