<template>
  <div class="flex flex-col items-center w-full">
    <div class="sidebar-section">
      <!-- Dither mode Selector -->
      <HelpTooltip header-class="pb-2">
        <template #label>
          <label for="ditherMode" class="font-bold text-sm">
            <h4 class="text-xs font-bold mt-1 mb-1 uppercase">Dither Mode</h4>
          </label>
        </template>
        <template #help>
          These methods are different ways to spread around the quantization
          error introduced by reducing an images color palette. They look quite
          different, try them out!
        </template>
        <div class="inline-block relative w-full">
          <select
            id="ditherMode"
            :value="ditherMode"
            class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
            @input="$emit('update:dither-mode', $event.target.value)"
          >
            <template v-for="(v, i) in ditherModeOptions">
              <option :id="v" :name="v" :value="v">{{ v }}</option>
            </template>
          </select>
        </div>
      </HelpTooltip>
      <!-- End Dither mode Selector -->
    </div>

    <slot name="color-picker"></slot>

    <div v-if="selectedImage" class="sidebar-section">
      <HelpTooltip>
        <template #label>
          <label for="imageSize" class="text-xs uppercase font-bold mt-1 mb-1">Image Size</label>
        </template>
        <template #help>
          This determines the size of the final file, and can also affect how
          the dither looks.
        </template>
        <div v-if="canvasWidth > 5000" class="bg-red-100 p-2 mt-2 mb-4 rounded">
          Width must be less than 5000px
        </div>
        <div class="w-full relative">
          <div class="flex flex-row space-x-4 w-full items-center">
            <div class="w-1/2">
              Width (px)
              <span
                v-if="customWidth == false"
                class="block bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 mt-1 rounded leading-tight focus:outline-none focus:shadow-outline"
                @click="enableCustomWidth"
              >{{ selectedImage.naturalWidth }}</span>
              <input
                v-else
                id="customWidthField"
                ref="customWidthField"
                class="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 mt-1 rounded leading-tight focus:outline-none focus:shadow-outline"
                type="number"
                name="customWidthField"
                maxlength="4"
                max="5000"
                :value="canvasWidth"
                @change="validateWidth()"
                @input="$emit('update:canvas-width', $event.target.value)"
              />
            </div>
            <div class="w-1/2">
              Height (px)
              <span
                class="block appearance-none bg-gray-200 border border-gray-300 text-gray-500 px-4 py-2 mt-1 rounded leading-tight focus:outline-none focus:shadow-outline"
              >
                <template v-if="canvasWidth == 'original'">
                  {{ selectedImage.height }}
                </template>
                <template v-else>
                  {{ (selectedImage.naturalHeight / selectedImage.naturalWidth) * canvasWidth }}
                </template>
              </span>
            </div>
          </div>
        </div>
      </HelpTooltip>
    </div>
    <div v-if="selectedImage" class="sidebar-section">
      <HelpTooltip>
        <template #label>
          <label for="blockSize">
            <h4 class="text-xs font-bold mt-1 mb-1 uppercase">Pixeliness ⚠️</h4>
          </label>
        </template>
        <template #help>
          This is an experimental feature to make images more "pixely". I'm
          too scared to let it go over 25. Love it? Hate it?
          <a href="#contact">Let me know</a>.
        </template>
        <div class="flex flex-row items-center gap-8">
          <input
            id="blockSize"
            type="range"
            :value="blockSize"
            min="1"
            max="25"
            class="grow"
            @input="$emit('update:block-size', $event.target.value)"
          />
          <div class="w-12 text-left">{{ blockSize }}</div>
        </div>
      </HelpTooltip>
    </div>
    <div class="mb-4">
      <div class="mt-4 text-center xl:w-64 shadow max-w-full">
        <button
          class="btn-red text-lg w-full "
          :disabled="isError"
          @click="$emit('dither')"
        >
          🏁 Dither
        </button>
      </div>
    </div>

    <div v-show="ditherMode == 'Error Diffusion'" class="sidebar-section">
      <h4 class="text-xs font-bold mt-1 mb-1 uppercase">Advanced Options</h4>

      <!-- Algorithm Selector -->
      <HelpTooltip header-class="mt-4 pb-2">
        <template #label>
          <label for="ditherAlgo" class="font-bold text-sm">Algorithm</label>
        </template>
        <template #help>
          These are different ways of spreading the quantization errors around.
          Certain ones might work better than others depending on the image.
        </template>
        <div class="inline-block relative w-full">
          <select
            id="ditherAlgo"
            :value="rgbQuantOptions.dithKern"
            class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
            @input="$emit('update:dithKern', $event.target.value)"
          >
            <template v-for="(v, i) in algorithmOptions">
              <option :id="v" :name="v" :value="v">{{ v }}</option>
            </template>
          </select>
        </div>
      </HelpTooltip>
      <!-- End Algorithm Selector -->
      <!-- Serpentine Dither -->
      <HelpTooltip header-class="mt-4">
        <template #label>
          <div>
            <input
              id="ditherSerp"
              :checked="rgbQuantOptions.dithSerp"
              type="checkbox"
              class="form-checkbox"
              @change="$emit('update:dithSerp', $event.target.checked)"
            />
            <label for="ditherSerp" class="ml-2 text-sm"><strong>Serpentine Dither</strong></label>
          </div>
        </template>
        <template #help>
          This determines if the dithering just goes left to right, top to
          bottom, or does a snake wiggle.
        </template>
      </HelpTooltip>
      <!-- End Serpentine Dither -->
    </div>
  </div>
</template>

<script>
import HelpTooltip from '~/components/HelpTooltip.vue'

export default {
  components: {
    HelpTooltip
  },
  props: {
    ditherMode: {
      type: String,
      required: true
    },
    rgbQuantOptions: {
      type: Object,
      required: true
    },
    selectedImage: {
      default: ''
    },
    canvasWidth: {
      required: true
    },
    blockSize: {
      required: true
    },
    showDitheredImage: {
      type: Boolean,
      default: false
    },
    dithering: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      customWidth: false,
      isError: false
    }
  },
  computed: {
    ditherModeOptions() {
      return ['Error Diffusion', 'Bayer (Ordered)']
    },
    algorithmOptions() {
      return [
        'FloydSteinberg',
        'Atkinson',
        'Sierra24A',
        'Fan',
        'ShiauFan',
        'ShiauFan2',
        'JarvisJudiceNinke',
        'Stucki',
        'Burkes',
        'Sierra3',
        'Sierra2'
      ]
    }
  },
  methods: {
    enableCustomWidth() {
      this.customWidth = true
      this.$emit('update:canvas-width', this.selectedImage.naturalWidth)
      this.$nextTick(() => this.$refs.customWidthField.focus())
    },
    validateWidth() {
      typeof fathom !== 'undefined' && fathom('trackGoal', 'MHEE0ZOY', 0)
      if (this.canvasWidth > 5000) {
        this.isError = true
      } else {
        this.isError = false
      }
    }
  }
}
</script>
