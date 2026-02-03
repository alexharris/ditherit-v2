<template>
  <div>
    <div class="flex flex-row items-center justify-between" :class="headerClass">
      <slot name="label"></slot>
      <button
        type="button"
        class="rounded-full h-4 w-4 bg-red-700 text-white flex items-center justify-center text-sm cursor-pointer"
        :aria-expanded="isOpen"
        :aria-label="isOpen ? 'Close help' : 'Show help'"
        @click="isOpen = !isOpen"
      >
        <span v-if="!isOpen">?</span>
        <span v-else>X</span>
      </button>
    </div>
    <div v-if="!isOpen">
      <slot></slot>
    </div>
    <div v-else class="mt-2 bg-red-100 p-2 rounded">
      <slot name="help"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    headerClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isOpen: false
    }
  }
}
</script>
