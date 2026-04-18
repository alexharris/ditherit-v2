<script setup lang="ts">
import type { DitherMode } from '~/composables/useDithering'
import { DIFFUSION_ALGORITHMS } from '~/composables/useDithering'
import { BAYER_SIZES } from '~/utils/dithering'

const {
  ditherMode,
  algorithm,
  serpentine,
  bayerSize
} = useDithering()

const ditherModes: Array<{ label: string; value: DitherMode }> = [
  { label: 'Error Diffusion', value: 'diffusion' },
  { label: 'Bayer (Ordered)', value: 'bayer' },
  { label: 'Blue Noise', value: 'blue-noise' },
  { label: 'Riemersma', value: 'riemersma' }
]
</script>

<template>
  <div class="space-y-4 px-4 py-4">
    <HelpTooltip>
      <template #label>
        <span class="text-sm font-medium text-highlighted">Dither Mode</span>
      </template>
      <template #help>
        These methods are different ways to spread around the quantization
        error introduced by reducing an image's color palette. They look quite
        different, try them out!
      </template>
      <USelect
        v-model="ditherMode"
        :items="ditherModes"
        class="mt-2 w-full"
        :ui="{ base: 'text-left' }"
      />
    </HelpTooltip>

    <!-- Algorithm (for diffusion mode) -->
    <USelect
      v-if="ditherMode === 'diffusion'"
      v-model="algorithm"
      :items="DIFFUSION_ALGORITHMS"
      class="w-full"
    />

    <!-- Matrix Size (for bayer mode) -->
    <USelect
      v-if="ditherMode === 'bayer'"
      v-model="bayerSize"
      :items="BAYER_SIZES"
      class="w-full"
    />

    <!-- Serpentine (for diffusion mode) -->
    <HelpTooltip v-if="ditherMode === 'diffusion'">
      <template #label>
        <UCheckbox
          v-model="serpentine"
          label="Serpentine"
        />
      </template>
      <template #help>
        This determines if the dithering just goes left to right, top to
        bottom, or does a snake wiggle.
      </template>
    </HelpTooltip>
  </div>
</template>
