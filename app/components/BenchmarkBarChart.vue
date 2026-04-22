<script setup lang="ts">
import type { BenchmarkResult } from '~/composables/useBenchmark'

const props = defineProps<{
  results: BenchmarkResult[]
  metric: 'processingTimeMs' | 'outputFileSizeBytes' | 'sizeReductionPct' | 'mse'
  groupBy: 'algorithm' | 'colorCount' | 'pixelScale'
}>()

const metricLabel = computed(() => {
  switch (props.metric) {
    case 'processingTimeMs': return 'Processing Time (ms)'
    case 'outputFileSizeBytes': return 'Output Size (KB)'
    case 'sizeReductionPct': return 'Size Reduction (%)'
    case 'mse': return 'Mean Squared Error'
    default: return ''
  }
})

function getMetricValue(r: BenchmarkResult): number {
  if (props.metric === 'outputFileSizeBytes') return r.outputFileSizeBytes / 1024
  return r[props.metric] as number
}

// Group results, average the metric per group
const groups = computed(() => {
  const map = new Map<string, { sum: number, count: number, mode: string }>()
  for (const r of props.results) {
    const key = String(r[props.groupBy])
    const existing = map.get(key)
    if (existing) {
      existing.sum += getMetricValue(r)
      existing.count++
    } else {
      map.set(key, { sum: getMetricValue(r), count: 1, mode: r.ditherMode })
    }
  }
  return Array.from(map.entries())
    .map(([key, { sum, count, mode }]) => ({
      key,
      avg: sum / count,
      mode
    }))
    .sort((a, b) => a.avg - b.avg)
})

const maxValue = computed(() => Math.max(...groups.value.map(g => g.avg), 1))

const BAR_HEIGHT = 22
const BAR_GAP = 5
const LABEL_WIDTH = 150
const CHART_WIDTH = 380
const VALUE_WIDTH = 70

const svgHeight = computed(() => groups.value.length * (BAR_HEIGHT + BAR_GAP) + 10)
const svgWidth = LABEL_WIDTH + CHART_WIDTH + VALUE_WIDTH

function barColor(mode: string, avg: number): string {
  if (mode === 'bayer') return '#f59e0b'
  // Shade blue by relative value
  return avg / maxValue.value > 0.7 ? '#1d4ed8' : '#3b82f6'
}

function formatValue(v: number): string {
  switch (props.metric) {
    case 'processingTimeMs': return `${v.toFixed(1)} ms`
    case 'outputFileSizeBytes': return `${v.toFixed(1)} KB`
    case 'sizeReductionPct': return `${v.toFixed(1)}%`
    case 'mse': return v.toFixed(1)
  }
}
</script>

<template>
  <div>
    <p class="mb-3 text-xs font-medium text-gray-500 dark:text-gray-400">
      {{ metricLabel }} — averaged per group, sorted ascending
    </p>

    <div
      v-if="groups.length === 0"
      class="py-8 text-center text-sm text-gray-500"
    >
      No results yet. Run a benchmark to see data.
    </div>

    <div
      v-else
      class="overflow-x-auto"
    >
      <svg
        :width="svgWidth"
        :height="svgHeight"
        class="block"
      >
        <g
          v-for="(group, i) in groups"
          :key="group.key"
          :transform="`translate(0, ${i * (BAR_HEIGHT + BAR_GAP)})`"
        >
          <!-- Label -->
          <text
            :x="LABEL_WIDTH - 8"
            :y="BAR_HEIGHT / 2 + 4"
            text-anchor="end"
            class="fill-gray-500 dark:fill-gray-100"
            style="font-size: 11px; font-family: ui-monospace, monospace;"
          >{{ group.key }}</text>

          <!-- Track -->
          <rect
            :x="LABEL_WIDTH"
            y="2"
            :width="CHART_WIDTH"
            :height="BAR_HEIGHT - 4"
            rx="3"
            class="fill-gray-100 dark:fill-gray-800"
          />

          <!-- Fill bar -->
          <rect
            :x="LABEL_WIDTH"
            y="2"
            :width="Math.max(6, (group.avg / maxValue) * CHART_WIDTH)"
            :height="BAR_HEIGHT - 4"
            rx="3"
            :fill="barColor(group.mode, group.avg)"
            opacity="0.85"
          />

          <!-- Value -->
          <text
            :x="LABEL_WIDTH + CHART_WIDTH + 8"
            :y="BAR_HEIGHT / 2 + 4"
            text-anchor="start"
            class="fill-gray-800 dark:fill-gray-100"
            style="font-size: 11px; font-family: ui-monospace, monospace;"
          >{{ formatValue(group.avg) }}</text>
        </g>
      </svg>
    </div>

    <!-- Legend -->
    <div class="mt-3 flex items-center gap-4">
      <div class="flex items-center gap-1.5">
        <div class="h-2.5 w-4 rounded-lg bg-blue-500" />
        <span class="text-xs text-gray-500 dark:text-gray-400">Diffusion</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="h-2.5 w-4 rounded-lg bg-amber-500" />
        <span class="text-xs text-gray-500 dark:text-gray-400">Bayer</span>
      </div>
    </div>
  </div>
</template>
