<script setup lang="ts">
import type { BenchmarkResult } from '~/composables/useBenchmark'

const props = defineProps<{
  results: BenchmarkResult[]
}>()

type SortKey = keyof BenchmarkResult

const sortKey = ref<SortKey>('processingTimeMs')
const sortAsc = ref(true)
const hoveredId = ref<string | null>(null)
const thumbStyle = ref({ left: '0px', top: '0px' })

const sorted = computed(() => {
  return [...props.results].sort((a, b) => {
    const av = a[sortKey.value]
    const bv = b[sortKey.value]
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortAsc.value ? av - bv : bv - av
    }
    return sortAsc.value
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av))
  })
})

const hoveredResult = computed(() => sorted.value.find(r => r.id === hoveredId.value))

function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

function onRowMouseMove(e: MouseEvent, id: string) {
  hoveredId.value = id
  thumbStyle.value = {
    left: `${e.clientX + 14}px`,
    top: `${e.clientY + 14}px`
  }
}

function onRowMouseLeave() {
  hoveredId.value = null
}

function copyCSV() {
  const headers = [
    'Algorithm', 'Mode', 'Palette', 'Colors', 'Scale', 'Pixeliness',
    'Serpentine', 'Time (ms)', 'Input KB', 'Output KB', 'Saved %', 'MSE'
  ]
  const rows = sorted.value.map(r => [
    r.algorithm,
    r.ditherMode,
    r.paletteLabel,
    r.colorCount,
    r.pixelScale,
    r.pixeliness,
    r.serpentine ? 'yes' : 'no',
    r.processingTimeMs,
    (r.inputFileSizeBytes / 1024).toFixed(1),
    (r.outputFileSizeBytes / 1024).toFixed(1),
    r.sizeReductionPct,
    r.mse
  ])
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  navigator.clipboard.writeText(csv)
}

function savedPctClass(pct: number): string {
  if (pct >= 50) return 'text-green-600 dark:text-green-400 font-semibold'
  if (pct >= 20) return 'text-green-700 dark:text-green-500'
  if (pct < 0) return 'text-red-600 dark:text-red-400'
  return 'text-gray-500 dark:text-gray-400'
}

const columns: Array<{ key: SortKey, label: string, align?: string }> = [
  { key: 'algorithm', label: 'Algorithm' },
  { key: 'ditherMode', label: 'Mode' },
  { key: 'paletteLabel', label: 'Palette' },
  { key: 'colorCount', label: 'Colors', align: 'right' },
  { key: 'pixelScale', label: 'Scale', align: 'right' },
  { key: 'pixeliness', label: 'Pixeliness', align: 'right' },
  { key: 'processingTimeMs', label: 'Time (ms)', align: 'right' },
  { key: 'outputFileSizeBytes', label: 'Output', align: 'right' },
  { key: 'sizeReductionPct', label: 'Saved %', align: 'right' },
  { key: 'mse', label: 'MSE', align: 'right' }
]
</script>

<template>
  <div>
    <div class="mb-2 flex items-center justify-between">
      <span class="text-sm text-gray-500 dark:text-gray-400">
        {{ results.length }} result{{ results.length !== 1 ? 's' : '' }}
      </span>
      <UButton
        size="sm"
        color="neutral"
        variant="outline"
        icon="i-lucide-clipboard-copy"
        label="Copy CSV"
        @click="copyCSV"
      />
    </div>

    <div class="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-800">
      <table class="w-full min-w-[800px] text-sm">
        <thead class="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th
              v-for="col in columns"
              :key="String(col.key)"
              class="cursor-pointer select-none whitespace-nowrap px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-100"
              :class="col.align === 'right' ? 'text-right' : 'text-left'"
              @click="toggleSort(col.key)"
            >
              <span
                class="inline-flex items-center gap-1"
                :class="col.align === 'right' ? 'flex-row-reverse' : ''"
              >
                {{ col.label }}
                <UIcon
                  v-if="sortKey === col.key"
                  :name="sortAsc ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'"
                  class="size-3 text-[--ui-primary]"
                />
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, i) in sorted"
            :key="row.id"
            class="border-t border-gray-100 transition-colors dark:border-gray-800"
            :class="[
              i % 2 === 1 ? 'bg-gray-100 50 dark:bg-gray-800/30' : '',
              'hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-default'
            ]"
            @mousemove="onRowMouseMove($event, row.id)"
            @mouseleave="onRowMouseLeave"
          >
            <td class="px-3 py-1.5 font-mono text-xs text-gray-800 dark:text-gray-100">
              {{ row.algorithm }}
            </td>
            <td class="px-3 py-1.5">
              <span
                class="rounded px-1.5 py-0.5 text-xs font-medium"
                :class="row.ditherMode === 'bayer'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'"
              >
                {{ row.ditherMode }}
              </span>
            </td>
            <td class="px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400">
              {{ row.paletteLabel }}
            </td>
            <td class="px-3 py-1.5 text-right tabular-nums text-gray-800 dark:text-gray-100">
              {{ row.colorCount }}
            </td>
            <td class="px-3 py-1.5 text-right tabular-nums text-gray-800 dark:text-gray-100">
              {{ row.pixelScale }}×
            </td>
            <td class="px-3 py-1.5 text-right tabular-nums text-gray-800 dark:text-gray-100">
              {{ row.pixeliness }}
            </td>
            <td class="px-3 py-1.5 text-right tabular-nums text-gray-800 dark:text-gray-100">
              {{ row.processingTimeMs }}
            </td>
            <td class="px-3 py-1.5 text-right tabular-nums text-gray-800 dark:text-gray-100">
              {{ (row.outputFileSizeBytes / 1024).toFixed(1) }} KB
            </td>
            <td
              class="px-3 py-1.5 text-right tabular-nums"
              :class="savedPctClass(row.sizeReductionPct)"
            >
              {{ row.sizeReductionPct >= 0 ? '-' : '+' }}{{ Math.abs(row.sizeReductionPct) }}%
            </td>
            <td class="px-3 py-1.5 text-right tabular-nums text-gray-800 dark:text-gray-100">
              {{ row.mse }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Thumbnail tooltip -->
    <Teleport to="body">
      <div
        v-if="hoveredResult"
        class="pointer-events-none fixed z-50 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-800"
        :style="thumbStyle"
      >
        <img
          :src="hoveredResult.thumbnailUrl"
          class="block size-28 object-cover"
          style="image-rendering: pixelated;"
          alt=""
        >
        <div class="px-2 pb-2 pt-1">
          <p class="text-xs font-medium text-gray-800 dark:text-gray-100">
            {{ hoveredResult.algorithm }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ hoveredResult.colorCount }} colors · {{ hoveredResult.paletteLabel }}
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>
