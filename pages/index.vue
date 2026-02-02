<template>
  <div class="flex flex-col items-center max-w-full">
    <div
      class="flex flex-column w-full p-4 md:justify-center"
      :class="{ 'w-full flex justify-start': imageUploaded }"
    >
      <Logo />
      <KofiButton />
    </div>

    <div v-show="!imageUploaded" class="flex flex-col items-center mt-4">
      <p class="mt-8 text-2xl">An image dithering tool</p>
      <img
        class="mt-8"
        src="~/assets/earth-dither.gif"
        width="600"
        height="328"
      />
    </div>
    <div
      class="py-6 px-2 flex flex-col md:flex-row pt-4 w-full justify-center"
      :class="{ 'checkers shadow-inner': imageUploaded }"
    >
      <!-- Begin Main Toolbar -->
      <div
        v-show="imageUploaded"
        class="w-full md:w-1/3 lg:w-2/5 order-last md:order-first p-2 pt-0 rounded"
      >
        <SidebarControls
          :dither-mode.sync="ditherMode"
          :rgb-quant-options="rgbQuantOptions"
          :selected-image="selectedImage"
          :canvas-width.sync="canvasWidth"
          :block-size.sync="blockSize"
          :show-dithered-image="showDitheredImage"
          :dithering="dithering"
          @dither="ditherImage()"
          @update:dithKern="rgbQuantOptions.dithKern = $event"
          @update:dithSerp="rgbQuantOptions.dithSerp = $event"
        >
          <template #color-picker>
            <ColorPicker
              ref="colorPicker"
              :initial-palette="rgbQuantOptions.palette"
              @update-palette="onUpdatePalette"
            />
          </template>
        </SidebarControls>
        <!-- This is the same as the other report block, this one is for mobile positioning -->
        <div v-show="imageUploaded" class="md:hidden">
          <div
            v-if="showDitheredImage && !dithering"
            class="shadow rounded xl:m-0 p-4 mb-4 w-full xl:w-1/4 bg-white "
          >
            <FilesizeResults
              :ratio-good="ratioGood"
              :download-file-size="downloadFileSize"
              :selected-image="selectedImage"
              :dithered-height="ditheredHeight"
              :dithered-width="ditheredWidth"
              :download-filesize="downloadFileSize.toFixed(2)"
              :rgbquant="rgbQuantOptions"
            />
          </div>
        </div>
      </div>
      <!-- End Toolbar -->
      <div
        class="w-full md:w-2/3 lg:w-4/5 flex flex-col xl:flex-row order-first md:order-last items-stretch"
      >
        <!-- Begin Main Display -->
        <div class="md:px-4 flex flex-col flex-1 items-center w-full">
          <!-- Begin Top Toolbar -->
          <TopToolbar
            :show-dithered-image="showDitheredImage"
            :dithering="dithering"
            :view-original.sync="viewOriginal"
            :view-full-width.sync="viewFullWidth"
            :custom-width="customWidth"
            :download-url="downloadUrl"
            :selected-file="selectedFile"
            @number-images="getNumberOfImages"
            @image-upload="onImageUpload"
            @download="downloadImage"
          />
          <!-- End Top Toolbar -->
          <!-- Dithered Canvas Display -->
          <div
            v-show="showDitheredImage"
            id="dithered-canvas-display"
            class="max-w-full w-full"
            :class="{ 'pt-8': showDitheredImage == true }"
          >
            <div
              v-show="dithering"
              class="flex flex-col justify-center items-center"
            >
              <div class="loader h-20 w-20 mb-4"></div>
              <div class="">Dithering...</div>
            </div>
            <div
              v-show="!dithering && showDitheredImage && !viewOriginal"
              class="flex flex-col justify-center items-center w-full h-full "
            >
              <div
                v-for="n in numberOfImages"
                v-show="selectedImage.id == 'originalImage' + n"
                class="max-w-full "
              >
                <canvas
                  :id="'dithered_originalImage' + n"
                  class="max-w-full selectedImage"
                ></canvas>
              </div>
            </div>
          </div>
          <!-- End Dithered Canvas Display -->
          <!-- Original Image Display -->

          <div class="w-full flex flex-col ">

            <div v-if="numberOfImages > 0">
              <img
                v-if="!showDitheredImage || viewOriginal"
                :width="viewFullWidth ? null : ditheredWidth"
                class="mx-auto max-w-full"
                :src="selectedImageSrc"
              />
            </div>
            <div class="flex flex-row flex-wrap mt-4 justify-center">
              <div v-for="n in numberOfImages" v-show="numberOfImages > 1">
                <img
                  :id="'originalImage' + n"
                  class="max-w-full m-4 shadow cursor-pointer"
                  width="75"
                  @click="analyzeImagePalette($event.target)"
                />
              </div>
            </div>
          </div>
          <!-- End Original Image Display -->
          <!-- Toolbar Stuff -->
          <div
            class="flex flex-row justify-center"
            :class="{ 'w-full': imageUploaded, 'text-sm': imageUploaded }"
          >
            <ImageUpload
              v-if="!imageUploaded"
              text="✨ Select images"
              duck="true"
              @number-images="getNumberOfImages"
              @image-upload="onImageUpload"
            />
          </div>
          <!-- End Toolbar Stuff -->
        </div>
        <!-- End Main Display -->
        <!-- Begin right sidebar -->
        <div
          v-show="imageUploaded"
          class="w-full xl:w-1/4 hidden md:flex flex-row xl:flex-col gap-4 px-4 xl:m-0 justify-center xl:justify-start"
        >
          <div
            v-if="showDitheredImage && !dithering"
            class="shadow rounded bg-white self-start w-1/2 xl:w-full"
          >
            <FilesizeResults
              :ratio-good="ratioGood"
              :download-file-size="downloadFileSize"
              :selected-image="selectedImage"
              :dithered-height="ditheredHeight"
              :dithered-width="ditheredWidth"
              :download-filesize="downloadFileSize.toFixed(2)"
              :rgbquant="rgbQuantOptions"
            />
          </div>
        </div>
      </div>
    </div>
    <BottomContent />
    <!-- Fathom - simple website analytics - https://usefathom.com -->
    <script>
      ;(function(f, a, t, h, o, m) {
        a[h] =
          a[h] ||
          function() {
            ;(a[h].q = a[h].q || []).push(arguments)
          }
        ;(o = f.createElement('script')),
          (m = f.getElementsByTagName('script')[0])
        o.async = 1
        o.src = t
        o.id = 'fathom-script'
        m.parentNode.insertBefore(o, m)
      })(document, window, '//cdn.usefathom.com/tracker.js', 'fathom')
      fathom('set', 'siteId', 'AHDLJXNJ')
      fathom('trackPageview')
    </script>
    <!-- / Fathom -->
    <script async data-id="101479686" src="//static.getclicky.com/js"></script>
  </div>
</template>

<script>
import RgbQuant from 'rgbquant'
import Logo from '~/components/Logo.vue'
import ImageUpload from '~/components/ImageUpload.vue'
import ColorPicker from '~/components/ColorPicker.vue'
import BottomContent from '~/components/BottomContent.vue'
import FilesizeResults from '~/components/FilesizeResults.vue'
import KofiButton from '~/components/KofiButton.vue'
import SidebarControls from '~/components/SidebarControls.vue'
import TopToolbar from '~/components/TopToolbar.vue'
import { bayerDither, addPixelation } from '~/utils/dithering'

export default {
  components: {
    ImageUpload,
    ColorPicker,
    Logo,
    BottomContent,
    FilesizeResults,
    KofiButton,
    SidebarControls,
    TopToolbar
  },
  data() {
    return {
      canvasWidth: 'original',
      fileName: '',
      loading: false,
      dithering: false,
      switchingImages: false,
      specsCalculated: false,
      imageUploaded: false,
      showDitheredImage: false,
      blockSize: 1,
      ditherMode: 'Error Diffusion',
      rgbQuantOptions: {
        colors: 8,
        method: 2,
        boxSize: [8, 8],
        boxPxls: 2,
        initColors: 4096,
        minHueCols: 2000,
        dithKern: 'FloydSteinberg',
        dithDelta: 0,
        dithSerp: false,
        palette: [],
        reIndex: false,
        useCache: true,
        cacheFreq: 10,
        colorDist: 'euclidean'
      },
      downloadUrl: '',
      downloadFileSize: '50',
      originalFileSize: '',
      imageType: '',
      numberOfImages: '',
      images: [],
      selectedImage: '',
      selectedImageSrc: '',
      ditheredWidth: '',
      ditheredHeight: '',
      viewOriginal: false,
      viewFullWidth: false,
      selectingImage: false
    }
  },
  computed: {
    ratioGood() {
      if (
        this.downloadFileSize /
          (Math.round((this.selectedImageSrc.length * 3) / 4) / 1000) <
        1
      ) {
        return true
      } else {
        return false
      }
    },
    selectedFile() {
      return this.images.find(this.getSelected)
    },
    computedHeight() {
      if (this.canvasWidth === 'original') {
        return this.selectedImage.naturalHeight
      } else {
        return (
          (this.selectedImage.naturalHeight / this.selectedImage.naturalWidth) *
          this.canvasWidth
        )
      }
    },
    customWidth() {
      return this.canvasWidth !== 'original'
    }
  },
  methods: {
    getSelected(image) {
      return image.id === this.selectedImage.id
    },
    getNumberOfImages(number) {
      this.numberOfImages = number
    },
    downloadImage() {
      this.ditheredWidth = document.getElementById(
        'dithered_' + this.selectedImage.id
      ).width
      this.ditheredHeight = document.getElementById(
        'dithered_' + this.selectedImage.id
      ).height

      const ditheredImageCanvas = document.getElementById(
        'dithered_' + this.selectedImage.id
      )
      const downloadUrl = ditheredImageCanvas.toDataURL(this.imageType, 0.72)
      this.downloadFileSize = Math.round((downloadUrl.length * 3) / 4) / 1000
      this.downloadUrl = downloadUrl

      fathom('trackGoal', 'UAT4LRNZ', 0)
    },
    onUpdatePalette(palette) {
      this.rgbQuantOptions.colors = palette.length
      this.rgbQuantOptions.palette = []
      palette.forEach((v, i) => {
        this.rgbQuantOptions.palette.push(v)
      })
    },
    onImageUpload(images) {
      this.images = images

      fathom('trackGoal', 'HORTCOPW', 0)

      this.selectedImage = document.getElementById('originalImage1')

      this.showDitheredImage = false

      this.rgbQuantOptions.palette = []

      this.imageUploaded = true

      setTimeout(() => {
        const img = document.getElementById('originalImage1')
        this.selectedImage = img
        this.selectedImageSrc = img.src
        this.analyzeImagePalette(img)
      }, 100)

      this.$nextTick(() => {
        if (this.$refs.colorPicker) {
          this.$refs.colorPicker.resetToOriginal()
        }
      })
    },
    ditherImage() {
      fathom('trackGoal', 'SFMGAORY', 0)

      window.scrollTo(0, 0)

      this.dithering = true

      this.viewOriginal = false

      this.showDitheredImage = true

      this.selectingImage = true

      this.viewFullWidth = false

      setTimeout(() => {
        for (let i = 1; i < this.numberOfImages + 1; i++) {
          const originalImage = document.getElementById('originalImage' + i)
          const ditheredImageCanvas = document.getElementById(
            'dithered_originalImage' + i
          )
          const ctx = ditheredImageCanvas.getContext('2d')
          let width = 1
          if (this.canvasWidth === 'original') {
            width = originalImage.naturalWidth
          } else if (this.canvasWidth === 'custom') {
            width = this.customWidth
          } else {
            width = this.canvasWidth
          }
          const height =
            (originalImage.naturalHeight / originalImage.naturalWidth) * width
          ctx.canvas.width = width
          ctx.canvas.height = height
          ctx.drawImage(originalImage, 0, 0, width, height)

          if (this.ditherMode != 'Error Diffusion') {
            bayerDither(
              ctx,
              ctx.getImageData(0, 0, width, height),
              this.rgbQuantOptions.palette,
              this.blockSize
            )
            fathom('trackGoal', 'Q3QWCGJU', 0)
            this.downloadImage()
          } else {
            const q = new RgbQuant(this.rgbQuantOptions)
            q.sample(originalImage)

            const ditherResult = q.reduce(ditheredImageCanvas)

            const imgData = ctx.getImageData(0, 0, width, height)

            imgData.data.set(ditherResult)
            ctx.putImageData(imgData, 0, 0)

            if (this.blockSize > 1) {
              addPixelation(
                ctx,
                ditheredImageCanvas,
                width,
                height,
                this.blockSize
              )
            }

            this.downloadImage()
          }
        }
        this.dithering = false
        this.selectingImage = false
      }, 100)
    },
    analyzeImagePalette(e) {
      this.selectingImage = true
      setTimeout(() => {
        this.selectedImage = e
        this.selectedImageSrc = e.src

        this.rgbQuantOptions.palette = []

        const q = new RgbQuant(this.rgbQuantOptions)
        q.sample(e)

        this.rgbQuantOptions.palette = q.palette(true)

        this.specsCalculated = true

        if (this.showDitheredImage) {
          this.ditheredWidth = document.getElementById(
            'dithered_' + this.selectedImage.id
          ).width
          this.ditheredHeight = document.getElementById(
            'dithered_' + this.selectedImage.id
          ).height

          const ditheredImageCanvas = document.getElementById(
            'dithered_' + this.selectedImage.id
          )
          const downloadUrl = ditheredImageCanvas.toDataURL(
            this.imageType,
            0.72
          )
          this.downloadFileSize =
            Math.round((downloadUrl.length * 3) / 4) / 1000
          this.downloadUrl = downloadUrl
        }

        if (this.$refs.colorPicker) {
          this.$refs.colorPicker.resetToOriginal()
        }
        this.selectingImage = false
      }, 50)
    }
  }
}
</script>

<style>
.checkers {
  background-color: #f5f9fe;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cpattern id='p' width='100' height='100' patternUnits='userSpaceOnUse' patternTransform='scale(0.36)'%3E%3Cpath data-color='outline' fill='none' stroke='%23286323' stroke-width='0.25' d='M50 0v100M100 50H0'%3E%3C/path%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23p)' width='100%25' height='100%25'%3E%3C/rect%3E%3C/svg%3E");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
