<template>
  <div class="flex flex-col items-center max-w-full">
    <div :class="{ 'w-full flex justify-center': imageUploaded}">
      <Logo />
    </div>
    <div v-show="!imageUploaded" class="flex flex-col items-center mt-4">
      <p class="mt-8 text-2xl">An image dithering tool 🏁</p>
      <img class="mt-8" src="~/assets/earth-dither.gif" />
    </div>
    <div
      class="py-12 px-2 md:px-4 flex flex-col md:flex-row pt-8 w-full justify-center"
      :class="{ 'checkers shadow-inner': imageUploaded}"
    >
      <!-- Begin Main Toolbar -->
      <div
        v-show="imageUploaded"
        class="w-full md:w-1/4 order-last md:order-first"
      >
        <div class="flex flex-col items-center w-full">
          <ColorPicker
            :initial-palette="rgbQuantOptions.palette"
            @update-palette="onUpdatePalette"
          />
          <div class="shadow rounded p-3 bg-white w-full mt-2">
            <div class="flex flex-row items-center justify-between">
              
              <label for="imageSize" h4 class="text-sm  uppercase font-bold mt-2 mb-2">Image Width</label>
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
            <div v-if="!showOptionsModalSize" class="w-full relative">
              <select
                id="imageSize"
                v-model="canvasWidth"
                class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
              >
                <option
                  id="originalSize"
                  name="originalSize"
                  :value="'original'"
                  >Original ({{selectedImage.naturalWidth}}px)</option
                >
                <template v-for="(v, i) in imageWidths">
                  <option :id="v" name="imageWidth" :value="v" @click="fathom('JN4RHD7N')">{{ v }}</option>
                </template>
                <option
                  @click="fathom('trackGoal', 'MHEE0ZOY', 0)"
                  id="customWidth"
                  name="customWidth"
                  :value="'custom'"
                  >Custom</option
                >                
              </select>
              <div 
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
              >
                <svg
                  class="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                  />
                </svg>
              </div>
            </div>
            <div v-else>
              <div class="mt-2 bg-red-100 p-2 rounded">
                This determines the size of the final file, and can also affect how the dither looks.
              </div>
            </div>  
            <!-- Custom Width Form -->
            <div v-if="canvasWidth == 'custom'">
              <div class="flex flex-row items-center justify-between">
                
                <label for="imageSize" h4 class="text-sm w-full uppercase font-bold mt-2 mb-2">Custom Width</label>
              </div>  
              <div v-if="!showOptionsModalSize" class="w-full relative flex flex-row gap-2">  
                <input class="block appearance-none w-1/2 bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 rounded leading-tight focus:outline-none focus:shadow-outline"
  type="number"  id="name" name="name" maxlength="4" v-model="customWidth"> x 
                <div>{{(selectedImage.naturalHeight / selectedImage.naturalWidth) * customWidth}}</div>
              </div>
            </div>

                
         </div>
          <div class="mt-4 text-center xl:w-64 shadow">
            <button class="btn-red text-lg w-full" @click="ditherImage()">
              🏁 Dither
            </button>
          </div>

          <div class="shadow rounded py-2 px-4 my-4 bg-white w-full">
            <h4 class="text-sm font-bold mt-2 mb-2 uppercase">Advanced Options</h4>
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
            <div
              v-if="!showOptionsModalAlgo"
              class="inline-block relative w-full"
            >
              <select
                id="ditherAlgo"
                v-model="rgbQuantOptions.dithKern"
                class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
              >
                <template v-for="(v, i) in algorithmOptions">
                  <option :id="v" :name="v" :value="v">{{ v }}</option>
                </template>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
              >
                <svg
                  class="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                  />
                </svg>
              </div>
            </div>
            <div v-else>
              <div class="mt-2 bg-red-100 p-2 rounded">
                These are different ways of spreading the quantization errors
                around. Certain ones might work better than others depending on
                the image.
              </div>
            </div>
            <!-- End Algorithm Selector -->
            <!-- Serpentine Dither -->
            <div class="flex flex-col items-center justify-between mt-4">
              <div class="inline-block relative w-full">
                <input
                  id="ditherSerp"
                  v-model="rgbQuantOptions.dithSerp"
                  type="checkbox"
                  class="form-checkbox"
                />
                <label for="ditherSerp" class="ml-2 text-sm"><strong>Serpentine Dither</strong></label>
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
              <div
                v-if="showOptionsModalSerp"
                class="inline-block relative w-full"
              >
                <div class="mt-2 bg-red-100 p-2 rounded">
                  <!-- This could be clarified. -->
                  This determines if the dithering just goes left to right, top
                  to bottom, or does a snake wiggle.
                </div>
              </div>
            </div>

            <!-- End Serpentine Dither -->
          </div>
          
        </div>
        <!-- This is the same as the other report block, this one is for mobile positioning -->
        <div
          v-if="showDitheredImage && !dithering"
          class="shadow rounded xl:m-0 p-4 w-full xl:w-1/4 bg-white md:hidden"
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
      <!-- End Toolbar -->
      <div
        class="w-full md:w-3/4 flex flex-col xl:flex-row order-first md:order-last items-stretch"
      >

        <!-- Begin Main Display -->
        <div class="md:px-4 flex flex-col flex-1 items-center w-full">
          <!-- Begin Top Toolbar -->
          <div class="flex flex-row justify-between gap-2 w-full items-center py-2 px-2 mb-4 shadow rounded bg-white" v-if="showDitheredImage && !dithering"> 
            <Toggler class="flex-grow"
            @view-original="viewOriginal = !viewOriginal"
            >View Original</Toggler>  
            <ImageUpload @number-images="getNumberOfImages" @image-upload="onImageUpload" text="✨ New"/>          
            <a
              class="btn-red-outline inline-block self-center"
              target="_blank"
              :href="downloadUrl"
              :download="'dither_it_' + selectedFile.name"
              @click="downloadImage"
              
              
              >💾 Save</a
            >  
          </div>   
          <!-- End Top Toolbar -->
          <!-- Dithered Canvas Display -->
          <div id="dithered-canvas-display" class="max-w-full w-full"  :class="{ 'pt-8': showDitheredImage == true }" v-show="showDitheredImage">


            <div
              v-show="dithering"
              class="flex flex-col justify-center items-center"
            >
              <div class="loader h-20 w-20 mb-4"></div>
              <div class="">Dithering...</div>
            </div>
            <div
              class="flex flex-col justify-center items-center w-full h-full "
              v-show="!dithering && showDitheredImage && !viewOriginal"
            >
              <div
              class="max-w-full "
                v-for="n in this.numberOfImages"
                v-show="selectedImage.id == 'originalImage' + n"
              >
                <canvas :id="'dithered_originalImage' + n" class="max-w-full selectedImage"></canvas>
              </div>
            </div>
          </div>
          <!-- End Dithered Canvas Display -->
          <!-- Original Image Display -->
          
          <div class="w-full flex flex-col ">
          
            <div v-if="numberOfImages > 0">
              <img class="mx-auto max-w-full" :src="selectedImage.src" v-if="!showDitheredImage || viewOriginal"/>
            </div>
            <div class="flex flex-row flex-wrap mt-4 justify-center">
              <div v-for="n in this.numberOfImages" v-show="numberOfImages > 1">
              
                <img
                  :id="'originalImage' + n"
                  class="max-w-full m-4 shadow cursor-pointer"
                  @click="analyzeImagePalette($event.target)"
                  width="75"
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
            <div
              v-show="showDitheredImage && !dithering"
              class="text-center mt-4 mr-2 justify-center "
            >

            </div>
            <ImageUpload @number-images="getNumberOfImages" @image-upload="onImageUpload" text="✨ Select images" duck="true" v-if="!imageUploaded" />
            
          </div>
          <!-- End Toolbar Stuff -->
        </div>
        <!-- Begin Report -->
        <div
          v-if="showDitheredImage && !dithering"
          class="shadow rounded xl:m-0 m-4 xl:w-1/4 bg-white hidden md:block"
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
  </div>
</template>

<script>
import RgbQuant from 'rgbquant'
import Logo from '~/components/Logo.vue'
import ImageUpload from '~/components/ImageUpload.vue'
import ColorPicker from '~/components/ColorPicker.vue'
import InputBlock from '~/components/InputBlock.vue'
import BottomContent from '~/components/BottomContent.vue'
import Toggler from '~/components/Toggler.vue'
import FilesizeResults from '~/components/FilesizeResults.vue'


export default {
  components: {
    ImageUpload,
    ColorPicker,
    Logo,
    InputBlock,
    BottomContent,
    Toggler,
    FilesizeResults
  },
  data() {
    return {
      canvasWidth: 'original', // this is what the dithered canvas renders off of, height comes from a computed property
      fileName: '', // the name of the loaded file
      loading: false, // for the loading spinner
      dithering: false, // for the dithering spinner
      switchingImages: false,
      specsCalculated: false, // for the specs
      imageUploaded: false,
      showDitheredImage: false, // control if the dithered image is visible
      imageWidths: [320, 640, 1080, 1280],
      algorithmOptions: [
        // 'Bayer',
        'FloydSteinberg',
        'FalseFloydSteinberg',
        'Stucki',
        'Atkinson',
        'Jarvis',
        'Burkes',
        'Sierra',
        'TwoSierra',
        'SierraLite'
      ],
      rgbQuantOptions: {
        // ---- Options ------
        colors: 8, // desired palette size
        method: 2, // histogram method, 2: min-population threshold within subregions; 1: global top-population
        boxSize: [8, 8], // subregion dims (if method = 2)
        boxPxls: 2, // min-population threshold (if method = 2)
        initColors: 4096, // # of top-occurring colors to start with (if method = 1)
        minHueCols: 2000, // # of colors per hue group to evaluate regardless of counts, to retain low-count hues
        dithKern: 'FloydSteinberg', // dithering kernel name, see available kernels in docs below
        dithDelta: 0, // dithering threshhold (0-1) e.g: 0.05 will not dither colors with <= 5% difference
        dithSerp: false, // enable serpentine pattern dithering
        palette: [], // a predefined palette to start with in r,g,b tuple format: [[r,g,b],[r,g,b]...]
        reIndex: false, // affects predefined palettes only. if true, allows compacting of sparsed palette once target palette size is reached. also enables palette sorting.
        useCache: true, // enables caching for perf usually, but can reduce perf in some cases, like pre-def palettes
        cacheFreq: 10, // min color occurance count needed to qualify for caching
        colorDist: 'euclidean' // method used to determine color distance, can also be "manhattan"
      },
      showOptionsModalSize: false,
      showOptionsModalAlgo: false,
      showOptionsModalSerp: false,
      downloadUrl: '', // the url src thing to download the image
      downloadFileSize: '50', // the filesize of the download
      originalFileSize: '', // filesize of the original
      imageType: '',
      numberOfImages: '',
      images: [],
      selectedImage: '',
      ditheredWidth: '',
      ditheredHeight: '',
      viewOriginal: false,
      selectingImage: false,
      customWidth: 1000
    }
  },
  computed: {
    ratioGood() {
      if (this.downloadFileSize / (Math.round(((this.selectedImage.src.length) * 3) / 4) / 1000) < 1) {
        return true
      } else {
        return false
      }
    },
    selectedFile() {
      return this.images.find(this.getSelected)
    }
  },
  methods: {
    // ---------------------------
    // Set the image id to the id of the currently selected image
    // ----------------------------    
    getSelected(image) {
      console.log('Get selected image.')
      return image.id === this.selectedImage.id;
    },
    // ---------------------------
    // Get the number of images
    // ----------------------------        
    getNumberOfImages(number) {
      console.log('Get the number of images.')
      this.numberOfImages = number
    },
    // ---------------------------
    // Create the downloadable image
    // And get the new file specs
    // ----------------------------            
    downloadImage() {
      console.log('Function downloadImage called')

      this.ditheredWidth = document.getElementById('dithered_' + this.selectedImage.id).width
      this.ditheredHeight = document.getElementById('dithered_' + this.selectedImage.id).height

      const ditheredImageCanvas = document.getElementById('dithered_' + this.selectedImage.id) // the canvas that holds the dithered image
      const downloadUrl = ditheredImageCanvas.toDataURL(this.imageType, 0.72)
      this.downloadFileSize = Math.round((downloadUrl.length * 3) / 4) / 1000
      this.downloadUrl = downloadUrl

      fathom('trackGoal', 'UAT4LRNZ', 0)
    },
    // ---------------------------
    // This receives a palette from ColorPicker in the form of an array of hex values
    // ----------------------------        
    onUpdatePalette(palette) {
      console.log('Color palette updating:')
      console.log(palette.length)
      this.rgbQuantOptions.colors = palette.length
      this.rgbQuantOptions.palette = []
      palette.forEach((v, i) => {
        this.rgbQuantOptions.palette.push(v)
      })
    },
    // ---------------------------
    // When images get uploaded
    // ----------------------------       
    onImageUpload(images) {
      console.log('Process the uploaded images.')
      this.images = images // load the image array into data

      fathom('trackGoal', 'HORTCOPW', 0)

      this.selectedImage = document.getElementById('originalImage1') // set the selected image

      // Dithered image should not be showing yet
      this.showDitheredImage = false

      // Clear the paletter (it might be set from old uploads)
      this.rgbQuantOptions.palette = []

      // Set imageUploaded to true
      this.imageUploaded = true

      // Tell the palette selector to be set to original
      this.$children[1]._data.presetPaletteSelection = 'original'

      // Wait a second before analyzing the image palette (presumably to let the image load?)
      setTimeout(() => {
        this.analyzeImagePalette(document.getElementById('originalImage1'))
      }, 100)
    },
    // ---------------------------
    // Dither the images
    // ----------------------------
    ditherImage() {
      console.log('Dither the images')
      fathom('trackGoal', 'SFMGAORY', 0)

      // When dithering starts, go back to the top
      window.scrollTo(0, 0) 
      
      // Dithering has started
      this.dithering = true 

      // Hide the original images
      this.viewOriginal = false

      // Show the dithered image
      this.showDitheredImage = true

      // Dont show stats while dithering is happening
      this.selectingImage = true

      setTimeout(() => {

        // Go through each of the images and...
        for (let i = 1; i < this.numberOfImages + 1; i++) {
          // Get the original image
          const originalImage = document.getElementById('originalImage' + i)
          // Get the canvas where the dithered image will go
          const ditheredImageCanvas = document.getElementById('dithered_originalImage' + i)
          // Get the canvas context
          const ctx = ditheredImageCanvas.getContext('2d')
          // Set an arbitrary initial width
          const width = 1
          // If the canvas width param is set to 'Original'
          if (this.canvasWidth === 'original') {
            // Set the canvas width to the original image width
            // eslint-disable-next-line no-const-assign
            width = originalImage.naturalWidth
          } else if (this.canvasWidth === 'custom') { 
            width = this.customWidth
          } else {
            // Otherwise, set it to whatever is selected
            // eslint-disable-next-line no-const-assign
            width = this.canvasWidth
          }
          // Set the height based on the original ratio and the determined width
          const height = (originalImage.naturalHeight / originalImage.naturalWidth) * width
          // Tell the canvas which width and height to be
          ctx.canvas.width = width
          ctx.canvas.height = height
          // Put the image on the canvas
          ctx.drawImage(originalImage, 0, 0, width, height)

          if(this.rgbQuantOptions.dithKern == 'Bayer') {
            this.bayerDither(ctx, ctx.getImageData(0, 0, width, height))
          } else {
            // Create new RgbQuant instance
            const q = new RgbQuant(this.rgbQuantOptions)
            // Analyze histograms to get colors
            q.sample(originalImage) 
            // Dither what is on the canvas
            const ditherResult = q.reduce(ditheredImageCanvas) 
            console.log(ditherResult) // this is a Uint8Array of all of the pixels as RGB values where every 3 values is an RGB value like 255,0,0 etc.
            // Get the newly dithered image data
            const imgData = ctx.getImageData(0, 0, width, height)
            // Set the value of imageData to the dithered image data
            imgData.data.set(ditherResult) 
            // Put the new image data on the canvas
            ctx.putImageData(imgData, 0, 0)
            // Set the data for the image download
            this.downloadImage()
          }

        }
        // Turn off dithering indicator
        this.dithering = false
        // Show stats
        this.selectingImage = false
      }, 100)
      // Set the data for the image download (again?)
      this.downloadImage()
    },
    bayerDitherOld2(ctx,imageData) {
      var depth      = 16;


      // Matrix
      var threshold_map_2x2 = [
          [ 0, 2],
          [ 3, 1],
      ];

      var threshold_map_4x4 = [
          [  1,  9,  3, 11 ],
          [ 13,  5, 15,  7 ],
          [  4, 12,  2, 10 ],
          [ 16,  8, 14,  6 ]
      ];

      // imageData
      var width  = imageData.width;
      var height = imageData.height;
      var pixel  = imageData.data;
      var x, y, a, b;

      // filter
      for ( x=0; x<width; x++ )
      {
          for ( y=0; y<height; y++ )
          {
              a    = ( x * height + y ) * 4;
              b    = threshold_map_4x4[ x%4 ][ y%4 ];
              // pixel[ a + 0 ] = ( (pixel[ a + 0 ]+ b) / depth | 0 ) * depth;
              // pixel[ a + 1 ] = ( (pixel[ a + 1 ]+ b) / depth | 0 ) * depth;
              // pixel[ a + 2 ] = ( (pixel[ a + 2 ]+ b) / depth | 0 ) * depth;
              // pixel[ a + 3 ] = ( (pixel[ a + 3 ]+ b) / depth | 3 ) * depth;
              pixel[ a ] = pixel[ a + 1 ] = pixel[ a + 2 ] = ( (pixel[ a ]+ b) / depth | 0 ) * depth;
          }
      }

      ctx.putImageData( imageData, 0, 0);
    },
    bayerDither(ctx, imageData) {

      var bayerThresholdMap = [
        [  15, 135,  45, 165 ],
        [ 195,  75, 225, 105 ],
        [  60, 180,  30, 150 ],
        [ 240, 120, 210,  90 ]
      ];

      var lumR = [];
      var lumG = [];
      var lumB = [];
      for (var i=0; i<256; i++) {
        lumR[i] = i*0.299;
        lumG[i] = i*0.587;
        lumB[i] = i*0.114;
      }


      var imageDataLength = imageData.data.length;
      console.log(imageDataLength);

      // Greyscale luminance (sets r pixels to luminance of rgb)
      for (var i = 0; i <= imageDataLength; i += 4) {
        imageData.data[i] = Math.floor(lumR[imageData.data[i]] + lumG[imageData.data[i+1]] + lumB[imageData.data[i+2]]);
      }      

      var w = imageData.width;
      var newPixel, err;

      for (var currentPixel = 0; currentPixel <= imageDataLength; currentPixel+=4) {
        // 4x4 Bayer ordered dithering algorithm
        var x = currentPixel/4 % w;
        var y = Math.floor(currentPixel/4 / w);
        var map = Math.floor( (imageData.data[currentPixel] + bayerThresholdMap[x%4][y%4]) / 2 );
        imageData.data[currentPixel] = (map < 129) ? 0 : 255;        

        // Set g and b pixels equal to r
        imageData.data[currentPixel + 1] = imageData.data[currentPixel + 2] = imageData.data[currentPixel];        
      }
      console.log(imageData)
      // Put the new image data on the canvas
      ctx.putImageData(imageData, 0, 0)

    },
    bayerDitherOld(ctx, imgData) {

      // add up every three values
      var v = 0;
      const arr = imgData.data;
      console.log(arr)

    // imageData.data[i] = Math.floor(lumR[imageData.data[i]] + lumG[imageData.data[i+1]] + lumB[imageData.data[i+2]]);

      var newArr = [];
      const num = 3;
      for(let i = 0; i < arr.length; i++){
        if(i % num !== 0){
          // console.log(i)
          //1,2
          //4,5
          //7,8
          // etc
          continue;
        };
        if(arr[i] + arr[i+1] + arr[i+2] > 255) {
          newArr.push(255)
          newArr.push(255)
          newArr.push(255)
        } else {
          newArr.push(0)
          newArr.push(0)
          newArr.push(0)
        }


        
      };
      // console.log(newArr)
      newArr.pop()
      newArr.pop()
      // console.log(newArr)
      var uint8 = new Uint8Array(newArr);
      // console.log(uint8)
      // Set the value of imageData to the dithered image data
      imgData.data.set(uint8) 
      // Put the new image data on the canvas
      ctx.putImageData(imgData, 0, 0)
    },
    // ---------------------------
    // Analyze the image palette
    // ----------------------------    
    analyzeImagePalette(e) {
      console.log('Analyze the image palette.')
      console.log('New image selected.')
       this.selectingImage = true
       setTimeout(() => {
        this.selectedImage = e
      
        

        this.rgbQuantOptions.palette = []

        // create new RgbQuant instance
        const q = new RgbQuant(this.rgbQuantOptions)
        // analyze histograms
        q.sample(e)

        this.rgbQuantOptions.palette = q.palette(true)
        this.specsCalculated = true

        if(this.showDitheredImage) {
          this.ditheredWidth = document.getElementById('dithered_' + this.selectedImage.id).width
          this.ditheredHeight = document.getElementById('dithered_' + this.selectedImage.id).height

          const ditheredImageCanvas = document.getElementById('dithered_' + this.selectedImage.id) // the canvas that holds the dithered image
          const downloadUrl = ditheredImageCanvas.toDataURL(this.imageType, 0.72)
          this.downloadFileSize = Math.round((downloadUrl.length * 3) / 4) / 1000
          this.downloadUrl = downloadUrl        
        }

        this.$children[1]._data.presetPaletteSelection = 'original'
        console.log('New image selected.')
        this.selectingImage = false
      }, 50)
      
    },
    fathom(id) {
      fathom('trackGoal', id, 0)
    },
  }
}
</script>

<style scoped>
  .checkers {
    background-color: #fcfffb;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cpattern id='p' width='100' height='100' patternUnits='userSpaceOnUse' patternTransform='scale(0.36)'%3E%3Cpath data-color='outline' fill='none' stroke='%239D9D9D' stroke-width='0.25' d='M50 0v100M100 50H0'%3E%3C/path%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23p)' width='100%25' height='100%25'%3E%3C/rect%3E%3C/svg%3E");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>
