<template>
  <div class="flex flex-col items-center max-w-full pb-8 mx-4">
    <Logo  /> 
    <div class="flex flex-col items-center mt-8" v-show="!imageUploaded">
      <p class="mt-8 text-2xl">An image dithering tool 🏁</p>
      <img class="mt-8" src="~/assets/earth-dither.gif" />      
    </div>
    <div class="p-y12 px-4 flex flex-col md:flex-row mt-8 w-full justify-center">

      <!-- Begin Main Toolbar -->
      <div class="w-full md:w-1/4 order-last md:order-first" v-show="imageUploaded">                   
        <div class="flex-1" >
          <ColorPicker v-on:update-palette="onUpdatePalette" :initial-palette="rgbQuantOptions.palette" /> 
          
            <div class="mt-4 text-center xl:w-64">
              <button @click="ditherImage" class="btn-red text-lg w-full">🏁 Dither</button>
            </div>  

                
          <h4 class="text-lg mt-4 font-bold">Options</h4>           
          <!-- Image Size Selector -->
          <div class="mt-2">
            <div class="border-solid border shadow-lg rounded p-3" >   
              <label for="imageSize" class="mt-4">Image Size</label>
              <div class="inline-block relative w-full" >
                <select id="imageSize" v-model="canvasWidth" class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline">
                    <option id="originalSize" name="originalSize" :value="originalCanvasWidth">{{originalCanvasWidth}} (Original)</option> 
                    <template v-for="(v,i) in imageWidths">
                        <option :id="v" name="imageWidth" :value="v">{{v}}</option> 
                    </template>    
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div> 
            </div>  
          </div>                  
                                 
        </div>
      </div>
      <!-- End Toolbar -->
      <div class="w-full md:w-3/4 flex flex-col xl:flex-row order-first md:order-last">
        <!-- Begin Main Display -->
        <div class="px-4 flex flex-col flex-1 items-center">
          <!-- Dithered Canvas Display -->
          <div class="max-w-5xl">
            <div class="flex flex-col justify-center items-center" v-show="dithering">
              <div class="loader h-20 w-20 mb-4"></div>  
              <div class="">Dithering...</div>
            </div>
            <div class="flex flex-col justify-center items-center w-full h-full " v-show="!dithering && showDitheredImage">
              <canvas id="ditheredImageCanvas" class="max-w-full " ></canvas>
            </div>
          </div>
          <!-- End Dithered Canvas Display -->
          <!-- Original Image Display -->
          <div class="max-w-5xl text-center">
            <img id="originalImage" class="max-w-full" v-show="!showDitheredImage" />            
          </div>   
          <!-- End Original Image Display -->
          <!-- Toolbar Stuff -->
          <div class="flex flex-row justify-center" v-bind:class="{ 'w-full': imageUploaded, 'text-sm': imageUploaded}">
            <div class="text-center mt-4 mr-2 justify-center " v-show="showDitheredImage && !dithering">
              <a class="btn-red-outline w-full inline-block" target="_blank" @click="downloadImage" :href="downloadUrl" :download="'dither_it_' + fileName">💾  Download</a>
            </div>   
            <ImageUpload v-on:image-upload="onImageUpload" />               
          </div>
          <!-- End Toolbar Stuff -->
        </div>
        <!-- Begin Output -->
        <div class="w-full xl:w-1/4 flex flex-col md:flex-row xl:flex-col mt-8 xl:mt-0 px-8 xl:px-0" v-show="imageUploaded">

            <div class="border-solid border shadow-lg rounded p-3 mt-2 w-full h-0 md:h-auto invisible md:visible" >  
                <h4 class="text-lg font-bold mb-2">File Details</h4>
                <div class="flex xl:flex-col">
                  <div class="w-1/2 lg:w-full">
                    <h5 class="text-md font-bold">Original</h5>
                    <ul>
                        <li>Filename: {{fileName}} </li>
                        <li>Filesize: {{originalFileSize}} KB</li>
                        <li>Width: {{originalCanvasWidth}}px</li>
                        <li>Height: {{originalCanvasHeight}}px</li>
                    </ul>
                  </div>
                  <div class="w-1/2 lg:w-full" v-show="showDitheredImage">
                      <h5 class="mt-2 text-md font-bold">Dithered</h5>
                      <ul>
                      <li>Filename: dither_it_{{fileName}} </li>
                      <li>Filesize: {{downloadFileSize}} KB</li>
                      <li>Width: {{canvasWidth}}px</li>
                      <li>Height: {{canvasHeight}}px</li>
                      </ul>                
                  </div>
                </div>
            </div>  
        </div>
      </div>
    </div>
    <div class="w-full mt-32 px-4 md:px-32">
      <h3>About Dither it!</h3>
      
      <p>Dither it! was inspired by a <a href="https://solar.lowtechmagazine.com/2018/09/how-to-build-a-lowtech-website/">blog post from a site called Low-tech Magazine</a> about how to reduce the energy usage associated with running websites. One method they discussed was to reduce full color images to dithered images with very few colors. Ensuing comments clarified that there are other, more modern ways to compress images which achieve small file sizes while maintaining color, but I still think it is a fun technique that looks cool and is interesting to learn about.</p>


      <h4>About Dithering</h4>
      <p> Dithering is essentially a method for trying to make an image look good while reducing the number of colors it uses, or as <a href="https://en.wikipedia.org/wiki/Dither">wikipedia puts it:</a></p>
      <blockquote>Dithering is used in computer graphics to create the illusion of "color depth" in images with a limited color palette - a technique also known as color quantization. In a dithered image, colors that are not available in the palette are approximated by a diffusion of colored pixels from within the available palette. The human eye perceives the diffusion as a mixture of the colors within it (see color vision). Dithered images, particularly those with relatively few colors, can often be distinguished by a characteristic graininess or speckled appearance. </blockquote>


      <h4>Source code</h4>
      <p>The Dither it! source code is available on the <a href="https://github.com/alexharris/ditherit">Dither it! Github page</a>. Please feel free to contribute, share or pilfer.</p>
      
      <h4>Thanks to:</h4>

      <ul>
      <li>Leon Sorokin, for making <a href="https://github.com/leeoniya/RgbQuant.js">RgbQuant.js</a></li>
      <li>Don, for making <a href="https://xiaokaike.github.io/vue-color/">vue-color</a></li>
      <li><a href="https://lowtechmagazine.com">Low-tech Magazine, for dither inspiration</a>
      IcoMoon for icon SVGs</li>
      </ul>
      <p>Built by <a href="https://alexharris.online/">Alex Harris</a>.</p>
    </div>
  </div>
</template>

<script>
import RgbQuant from 'rgbquant'
import Logo from '~/components/Logo.vue'
import ImageUpload from '~/components/ImageUpload.vue'
import ColorPicker from '~/components/ColorPicker.vue'
import Download from '~/components/Download.vue'

export default {
  components: {
    ImageUpload,
    ColorPicker,
    Logo,
    Download
  },
  data() {
    return {
      originalCanvasWidth:'',
      originalCanvasHeight: '',
      canvasWidth: '', //this is what the dithered canvas renders off of, height comes from a computed property
      fileName: '', // the name of the loaded file
      loading: false, // for the loading spinner
      dithering: false, // for the dithering spinner
      specsCalculated: false, // for the specs 
      imageUploaded: false,
      showDitheredImage: false, // control if the dithered image is visible
      imageWidths: [320, 640, 1080, 1280, 1920],
      rgbQuantOptions: {              // ---- Options ------
          colors: 8,                  // desired palette size
          method: 2,                  // histogram method, 2: min-population threshold within subregions; 1: global top-population
          boxSize: [8,8],             // subregion dims (if method = 2)
          boxPxls: 2,                 // min-population threshold (if method = 2)
          initColors: 4096,           // # of top-occurring colors to start with (if method = 1)
          minHueCols: 2000,           // # of colors per hue group to evaluate regardless of counts, to retain low-count hues
          dithKern: 'FloydSteinberg', // dithering kernel name, see available kernels in docs below
          dithDelta: 0,               // dithering threshhold (0-1) e.g: 0.05 will not dither colors with <= 5% difference
          dithSerp: false,            // enable serpentine pattern dithering
          palette: [],                // a predefined palette to start with in r,g,b tuple format: [[r,g,b],[r,g,b]...]
          reIndex: false,             // affects predefined palettes only. if true, allows compacting of sparsed palette once target palette size is reached. also enables palette sorting.
          useCache: true,             // enables caching for perf usually, but can reduce perf in some cases, like pre-def palettes
          cacheFreq: 10,              // min color occurance count needed to qualify for caching
          colorDist: "euclidean",     // method used to determine color distance, can also be "manhattan"
      },
      downloadUrl: '', // the url src thing to download the image
      downloadFileSize: '', // the filesize of the download
      originalFileSize: '', // filesize of the original
      

    }
  },
  computed: {
    // this calculates the dithered image height, based on whatever width is selected
    canvasHeight() {
      var ratio = this.originalCanvasHeight / this.originalCanvasWidth
      return this.canvasWidth * ratio
    }
  },
  methods: {
    downloadImage() {
      console.log('calc download')
      var ditheredImageCanvas = document.getElementById('ditheredImageCanvas') // the canvas that holds the dithered image
      var head = 'data:image/jpeg;base64,';
      var downloadUrl = ditheredImageCanvas.toDataURL("image/jpeg")
      this.downloadFileSize = (Math.round((downloadUrl.length - head.length)*3/4))/1000 ;
      this.downloadUrl = downloadUrl
    }, 

    // This receives a palette from ColorPicker in the form of an array of hex values
    onUpdatePalette(palette) {
      this.rgbQuantOptions.palette = []
      palette.forEach((v,i) => {
        this.rgbQuantOptions.palette.push(v)
      })
    },
    onImageUpload(width,height,filename) {
      this.showDitheredImage = false;
      console.log(width,height,filename)
      var originalImage = document.getElementById('originalImage') // the canvas that holds the dithered image
      var head = 'data:image/jpeg;base64,';

      this.rgbQuantOptions.palette = []

      this.originalFileSize = (Math.round((originalImage.src.length - head.length)*3/4))/1000 ;

      if(width > 1080) {
        this.canvasWidth = 1080
      } else {
        this.canvasWidth = width
      }
      

      this.originalCanvasWidth = width
      this.originalCanvasHeight = height  
      this.fileName = filename
      this.imageUploaded = true

      // console.log(this.$children[1]._data.presetPaletteSelection = 'original')
      setTimeout(() => { 
        this.analyzeImagePalette() 
      }, 100);
    },
    ditherImage(img) {
      console.log('ditherImage called')  

      this.dithering = true
      this.showDitheredImage = true

      setTimeout(() => { 
        var originalImage = document.getElementById('originalImage') // the canvas that holds the original image
        var ditheredImageCanvas = document.getElementById('ditheredImageCanvas') // the canvas that holds the dithered image
        var tempImage = originalImage // this holds a copy of the original image which is used to hold the dither data to be drawn onto the canvas
        var ctx = ditheredImageCanvas.getContext("2d"); // canvas context


        ctx.canvas.width = this.canvasWidth; // tell the canvas what size to be
        ctx.canvas.height = this.canvasHeight; // tell the canvas what height to be

        ctx.drawImage(originalImage,0,0,this.canvasWidth,this.canvasHeight) // put the image on the canvas

        // create new RgbQuant instance
        var q = new RgbQuant(this.rgbQuantOptions);  

        q.sample(originalImage); // analyze histograms to get colors

        var ditherResult = q.reduce(ditheredImageCanvas); // dither what is on the canvas
  
        var imgData = ctx.getImageData(0,0,this.canvasWidth,this.canvasHeight); // get the image data from the canvas

        imgData.data.set(ditherResult); //set the value of imageData to the dither results

        ctx.putImageData( imgData, 0,0 ); // put the new dithered image data back on the canvas   
        
        this.dithering = false
      },100);      

    },
    analyzeImagePalette() {
      console.log('anaylze image palette')
      this.rgbQuantOptions.palette = []

      var imageCanvas = document.getElementById('originalImage')
       // create new RgbQuant instance
      var q = new RgbQuant(this.rgbQuantOptions); 
      // analyze histograms
      q.sample(imageCanvas);  

      this.rgbQuantOptions.palette = q.palette(true);
      this.specsCalculated = true
    }
  },
}
</script>
