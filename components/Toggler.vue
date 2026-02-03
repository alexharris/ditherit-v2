<template>
<div class="flex items-center pl-2">
  
  <!-- Toggle Button -->
  <label 
    :for="'toggler-' + customEvent"
    class="flex items-center cursor-pointer"
  >
    <!-- toggle -->
    <div class="relative">
      <!-- input -->
      <input :id="'toggler-' + customEvent" type="checkbox" class="hidden" @change="toggle"/>
      <!-- line -->
      <div
        class="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"
      ></div>
      <!-- dot -->
      <div
        class="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0"
      ></div>
    </div>
    <!-- label -->
    <div
      class="ml-3 text-gray-700 font-medium"
    >
      <slot></slot>
    </div>
  </label>
  
</div>

</template>

<script>
export default {
  props: {
    customEvent: {
      type: String,
      required: true
    }
  },
  methods: {
    toggle() {
      this.$emit(this.customEvent);
    }
  }
}
</script>

<style scoped>
.toggle__dot {
  top: -.25rem;
  left: -.25rem;
  transition: all 0.3s ease-in-out;
}

input:checked ~ .toggle__dot {
  transform: translateX(100%);
  @apply bg-red-600;
}


</style>