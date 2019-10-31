<template>
  <div class="container mx-auto pb-12">
    <h1 class="title">
      Dither it!
    </h1>  
    <div class="flex flex-wrap">
      <div class="w-full md:w-1/2 p-3">
        <ImageUpload v-on:image-upload="onImageUpload"  />  
      </div>
      <div class="w-full md:w-1/2 p-3">
        <canvas id="ditheredImageCanvas" class="max-w-full"></canvas>
      </div>
    </div>
    <div class="flex justify-between">
      <div class="flex-1">
        <ColorPicker v-on:update-palette="onUpdatePalette" :initial-palette="rgbQuantOptions.palette" /> 
        <!-- Image Size Selector -->
        <div class="mt-4">
            <label for="imageSize" class="mt-4">Image Size</label>
            <div class="inline-block relative w-full" >
                <select id="imageSize" v-model="canvasWidth" class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline">
                    <option id="originalSize" name="originalSize" :value="originalCanvasWidth">Original ({{originalCanvasWidth}})</option> 
                    <template v-for="(v,i) in imageWidths">
                        <option :id="v" name="paletteColor" :value="v">{{v}}</option> 
                    </template>    
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>   
        </div>
      </div>
      <div class="flex-1 text-center">
        <button @click="ditherImage" class="btn-red-large text-lg">Dither it!</button>
      </div>
      <div class="flex-1">
        <div>
          <div class="border-solid border shadow-lg rounded p-2 text-center" >   
            Original Filesize: {{originalFileSize}} KB<br />
            New Filesize: {{downloadFileSize}} KB<br />
            
            <a class="btn-red inline-block" target="_blank" @click="downloadImage" :href="downloadUrl" download="hello.jpg">Download</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RgbQuant from 'rgbquant'
import ImageUpload from '~/components/ImageUpload.vue'
import ColorPicker from '~/components/ColorPicker.vue'

export default {
  components: {
    ImageUpload,
    ColorPicker
  },
  data() {
    return {
      originalCanvasWidth:'',
      originalCanvasHeight: '',
      canvasWidth: '', //this is what the dithered canvas renders off of
      canvasHeight: '', //this is what the dithered canvas renders off of
      imageWidths: [320, 640, 1080, 1280, 1920],
      rgbQuantOptions: {              // ---- Options ------
          colors: 8,                  // desired palette size
          method: 1,                  // histogram method, 2: min-population threshold within subregions; 1: global top-population
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
    onImageUpload(width,height) {
      var originalImage = document.getElementById('originalImage') // the canvas that holds the dithered image
      var head = 'data:image/jpeg;base64,';
      this.originalFileSize = (Math.round((originalImage.src.length - head.length)*3/4))/1000 ;

      this.canvasWidth = width
      this.canvasHeight = height    
      this.originalCanvasWidth = width
      this.originalCanvasHeight = height    
      this.analyzeImagePalette() 
    },
    ditherImage(img) {
      console.log('ditherImage called')  

      var originalImage = document.getElementById('originalImage') // the canvas that holds the original image
      var ditheredImageCanvas = document.getElementById('ditheredImageCanvas') // the canvas that holds the dithered image
      var tempImage = originalImage // this holds a copy of the original image which is used to hold the dither data to be drawn onto the canvas
      var ctx = ditheredImageCanvas.getContext("2d"); // canvas context
      console.log(this.canvasWidth)
      ctx.canvas.width = this.canvasWidth; // tell the canvas what size to be
      ctx.canvas.height = this.canvasWidth; // tell the canvas what height to be

      ctx.drawImage(originalImage,0,0,this.canvasWidth,this.canvasWidth) // put the image on the canvas

      // create new RgbQuant instance
      var q = new RgbQuant(this.rgbQuantOptions);  

      q.sample(originalImage); // analyze histograms to get colors

      var ditherResult = q.reduce(ditheredImageCanvas); // dither what is on the canvas
 
      var imgData = ctx.getImageData(0,0,this.canvasWidth,this.canvasWidth); // get the image data from the canvas

      imgData.data.set(ditherResult); //set the value of imageData to the dither results

      ctx.putImageData( imgData, 0,0 ); // put the new dithered image data back on the canvas   

      this.downloadImage();

    },
    analyzeImagePalette() {
      var imageCanvas = document.getElementById('originalImage')
      console.log(imageCanvas)
       // create new RgbQuant instance
      var q = new RgbQuant(this.rgbQuantOptions);  
      // analyze histograms
      q.sample(imageCanvas);  
      // assign the palette
      this.rgbQuantOptions.palette = q.palette(true);
    }
  },
}
</script>

<style>
  #ditheredImageCanvas {
    border: 1px solid #f00;
  }
</style>

