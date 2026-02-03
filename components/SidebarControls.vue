<template>
  <div class="flex flex-col items-center w-full">
    <div class="sidebar-section">
      <!-- Dither mode Selector -->
      <div class="flex flex-row items-center justify-between pb-2">
        <label for="ditherMode" class="font-bold text-sm"
          ><h4 class="text-xs font-bold mt-1 mb-1 uppercase">
            Dither Mode
          </h4></label
        >
        <span
          class="rounded-full h-4 w-4 bg-red-700 text-white flex items-center justify-center float-right text-sm cursor-pointer"
          @click="showDitherModeModal = !showDitherModeModal"
        >
          <span v-if="!showDitherModeModal">
            ?
          </span>
          <span v-else>
            X
          </span>
        </span>
      </div>
      <div v-if="!showDitherModeModal" class="inline-block relative w-full">
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
      <div v-else>
        <div class="mt-2 bg-red-100 p-2 rounded">
          These methods are different ways to spread around the quantization
          error introduced by reducing an images color palette. They look quite
          different, try them out!
        </div>
      </div>
      <!-- End Dither mode Selector -->
    </div>

    <slot name="color-picker"></slot>

    <div v-if="selectedImage" class="sidebar-section">
      <div class="flex flex-row items-center justify-between">
        <label for="imageSize" h4 class="text-xs  uppercase font-bold mt-1 mb-1"
          >Image Size</label
        >
        <span
          class="rounded-full h-4 w-4 bg-red-700 text-white flex items-center justify-center float-right text-sm cursor-pointer"
          @click="showOptionsModalSize = !showOptionsModalSize"
        >
          <span v-if="!showOptionsModalSize">
            ?
          </span>
          <span v-else>
            X
          </span>
        </span>
      </div>
      <div v-if="canvasWidth > 5000" class="bg-red-100 p-2 mt-2 mb-4 rounded">
        Width must be less than 5000px
      </div>
      <div v-if="!showOptionsModalSize" class="w-full relative">
        <div class="flex flex-row space-x-4 w-full items-center">
          <div class="w-1/2">
            Width (px)
            <span
              v-if="customWidth == false"
              class="block  bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 mt-1 rounded leading-tight focus:outline-none focus:shadow-outline"
              @click="enableCustomWidth"
              >{{ selectedImage.naturalWidth }}</span
            >
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
                {{
                  (selectedImage.naturalHeight / selectedImage.naturalWidth) *
                    canvasWidth
                }}
              </template>
            </span>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="mt-2 bg-red-100 p-2 rounded">
          This determines the size of the final file, and can also affect how
          the dither looks.
        </div>
      </div>
      <!-- Custom Width Form -->
    </div>
    <div v-if="selectedImage" class="sidebar-section ">
      <div class="w-full">
        <div class="flex flex-row items-center justify-between">
          <label for="blockSize">
            <h4 class="text-xs font-bold mt-1 mb-1 uppercase">
              Pixeliness ⚠️
            </h4>
          </label>

          <span
            class="rounded-full h-4 w-4 bg-red-700 text-white flex items-center justify-center float-right text-sm cursor-pointer"
            @click="showPixelinessModal = !showPixelinessModal"
          >
            <span v-if="!showPixelinessModal">
              ?
            </span>
            <span v-else>
              X
            </span>
          </span>
        </div>
        <div
          v-if="!showPixelinessModal"
          class="flex flex-row items-center gap-8"
        >
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
        <div v-else>
          <div class="mt-2 bg-red-100 p-2 rounded">
            This is an experimental feature to make images more "pixely". I'm
            too scared to let it go over 25. Love it? Hate it?
            <a href="#contact">Let me know</a>.
          </div>
        </div>
      </div>
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
      <div class="flex flex-row items-center justify-between mt-4 pb-2">
        <label for="ditherAlgo" class="font-bold text-sm">Algorithm</label>
        <span
          class="rounded-full h-4 w-4 bg-red-700 text-white flex items-center justify-center float-right text-sm cursor-pointer"
          @click="showOptionsModalAlgo = !showOptionsModalAlgo"
        >
          <span v-if="!showOptionsModalAlgo">
            ?
          </span>
          <span v-else>
            X
          </span>
        </span>
      </div>
      <div v-if="!showOptionsModalAlgo" class="inline-block relative w-full">
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
      <div v-else>
        <div class="mt-2 bg-red-100 p-2 rounded">
          These are different ways of spreading the quantization errors around.
          Certain ones might work better than others depending on the image.
        </div>
      </div>
      <!-- End Algorithm Selector -->
      <!-- Serpentine Dither -->
      <div class="flex flex-col items-center justify-between mt-4">
        <div class="inline-block relative w-full">
          <input
            id="ditherSerp"
            :checked="rgbQuantOptions.dithSerp"
            type="checkbox"
            class="form-checkbox"
            @change="$emit('update:dithSerp', $event.target.checked)"
          />
          <label for="ditherSerp" class="ml-2 text-sm"
            ><strong>Serpentine Dither</strong></label
          >
          <span
            class="rounded-full h-4 w-4 bg-red-700 text-white flex items-center justify-center float-right text-sm cursor-pointer"
            @click="showOptionsModalSerp = !showOptionsModalSerp"
          >
            <span v-if="!showOptionsModalSerp">
              ?
            </span>
            <span v-else>
              X
            </span>
          </span>
        </div>
        <div v-if="showOptionsModalSerp" class="inline-block relative w-full">
          <div class="mt-2 bg-red-100 p-2 rounded">
            <!-- This could be clarified. -->
            This determines if the dithering just goes left to right, top to
            bottom, or does a snake wiggle.
          </div>
        </div>
      </div>

      <!-- End Serpentine Dither -->
    </div>
  </div>
</template>

<script>
export default {
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
      showDitherModeModal: false,
      showOptionsModalSize: false,
      showOptionsModalAlgo: false,
      showOptionsModalSerp: false,
      showPixelinessModal: false,
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
