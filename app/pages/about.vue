<script setup lang="ts">
definePageMeta({ layout: 'content' })
useSeoMeta({ title: 'About — Dither it!' })

const featureCards = [
  {
    icon: '🔒',
    title: 'Privacy First',
    description: '100% client-side. Your images never leave your device — no uploads, no servers.',
  },
  {
    icon: '🏁',
    title: 'Multiple Dithering Methods',
    description: 'Supported dithering methods include: error diffusion, Bayer ordered, blue noise, and Riemersma.',
  },
  {
    icon: '🎨',
    title: 'Custom Palette Editor',
    description: '16 built-in presets plus a full editor to build, save, import, and export your own palettes.',
  },
  {
    icon: '🖼️',
    title: 'Multi-Image Gallery',
    description: 'Upload and process multiple images at once, then bulk download as a ZIP.',
  },
  {
    icon: '🕹️',
    title: 'Pixeliness Control',
    description: 'Increase pixel chunkiness for pixel art effects.',
  },
  {
    icon: '📁',
    title: 'File Format Support',
    description: 'Accepts any image format your browser supports, including animated GIFs. Export as PNG, JPG, SVG, or GIF.',
  },
]
</script>

<template>
  <div class="space-y-10">
    <!-- Intro -->
    <p class="text-base leading-relaxed text-gray-600 dark:text-gray-400">
      Dither it! is a free website for dithering images, an image processing technique that reduces the number of colors used to render an image.
    </p>

    <!-- Features Grid -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Features
      </h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <UCard
          v-for="card in featureCards"
          :key="card.title"
        >
          <div class="flex items-start gap-3">
            <span v-if="card.icon.startsWith('i-')" class="mt-0.5 shrink-0">
              <UIcon :name="card.icon" class="size-5 text-[--ui-primary]" />
            </span>
            <span v-else class="mt-0.5 shrink-0 text-lg leading-none">{{ card.icon }}</span>
            <div>
              <p class="font-semibold text-gray-900 dark:text-gray-100">
                {{ card.title }}
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ card.description }}
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </section>

    <!-- What is Dithering -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        What is Dithering?
      </h2>
      <p class="text-base leading-relaxed text-gray-600 dark:text-gray-400">
        Dithering is a method for trying to make an image look good while reducing the number of colors it uses, or as Wikipedia puts it:
      </p>
      <blockquote class="border-l-4 border-gray-200 pl-4 dark:border-gray-700">
        <p class="italic leading-relaxed text-gray-500 dark:text-gray-400">
          Dithering is used in computer graphics to create the illusion of "color depth" in images with a limited color palette — a technique also known as color quantization. In a dithered image, colors that are not available in the palette are approximated by a diffusion of colored pixels from within the available palette. The human eye perceives the diffusion as a mixture of the colors within it. Dithered images, particularly those with relatively few colors, can often be distinguished by a characteristic graininess or speckled appearance.
        </p>
      </blockquote>
      <p class="text-base text-gray-600 dark:text-gray-400">
        For more information, see this
        <NuxtLink to="/resources" class="text-[--ui-primary] underline underline-offset-2 hover:opacity-80">
          list of dithering resources
        </NuxtLink>
        from around the web: explainers, algorithms, examples, and more.
      </p>
    </section>

    <USeparator />

    <!-- About this site -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        About this site
      </h2>
      <div class="space-y-3 text-base leading-relaxed text-gray-600 dark:text-gray-400">
        <p>
          Dither it! is built by Alex Harris.
        </p>
        <p>
          It was inspired by a blog post from
          <a href="https://solar.lowtechmagazine.com" target="_blank" rel="noopener noreferrer" class="text-[--ui-primary] underline underline-offset-2 hover:opacity-80">Low-tech Magazine</a>
          about how to reduce the energy usage associated with running websites. One method discussed was to reduce full color images to dithered images with very few colors and subsequently smaller file sizes. Ensuing discussion clarified that there are other, more modern ways to compress images (try
          <a href="https://squoosh.app" target="_blank" rel="noopener noreferrer" class="text-[--ui-primary] underline underline-offset-2 hover:opacity-80">Squoosh</a>) which achieve reduced file sizes while maintaining color. Nonetheless, dithering is a fun technique that looks cool and is interesting to learn about.
        </p>
        <p>
          The Dither it! source code is freely available on the
          <a href="https://github.com/alexharris/ditherit-v3" target="_blank" rel="noopener noreferrer" class="text-[--ui-primary] underline underline-offset-2 hover:opacity-80">Dither it! Github page</a>.
          Please feel free to contribute, share or pilfer.
        </p>
        <p>
          Thanks to
          <a href="https://github.com/leeoniya/RgbQuant.js" target="_blank" rel="noopener noreferrer" class="text-[--ui-primary] underline underline-offset-2 hover:opacity-80">Leon Sorokin</a>
          for making RgbQuant.js.
        </p>
      </div>
    </section>

    <USeparator />

    <!-- Newsletter -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Stay Updated
      </h2>
      <p class="text-base text-gray-600 dark:text-gray-400">
        Subscribe for occasional updates about new features.
      </p>
      <form
        action="https://buttondown.com/api/emails/embed-subscribe/ditherit"
        method="post"
        class="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div class="flex flex-col gap-1">
          <label for="bd-email" class="text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
          <UInput type="email" name="email" id="bd-email" placeholder="you@example.com" class="w-full sm:w-72" />
        </div>
        <UButton type="submit" label="Subscribe" />
      </form>
    </section>
  </div>
</template>
