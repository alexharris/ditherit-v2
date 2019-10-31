<template>
  <div class="container mx-auto ">
    <h1 class="title">
      Dither it!
    </h1>  
    <div class="flex flex-wrap">
      <div class="w-full md:w-1/2 p-3">
        <ImageUpload v-on:image-upload="onImageUpload"  />  
      </div>
      <div class="w-full md:w-1/2 p-3">
        <DitheredCanvas :width="canvasWidth" :height="canvasHeight" v-on:recalc-download="ditherImage" />
      </div>
    </div>
    <div class="flex justify-between">
      <div class="flex-1">
        <ColorPicker v-on:update-palette="onUpdatePalette" :initial-palette="rgbQuantOptions.palette" />  
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
import DitheredCanvas from '~/components/DitheredCanvas.vue'

export default {
  components: {
    ImageUpload,
    ColorPicker,
    DitheredCanvas
  },
  data() {
    return {
      canvasWidth: '', //this is what the dithered canvas renders off of
      canvasHeight: '', //this is what the dithered canvas renders off of
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
      downloadUrl: '',
      downloadFileSize: '',
      originalFileSize: '',
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
      this.analyzeImagePalette() 
    },
    ditherImage(img) {
      console.log('ditherImage called')  

      var originalImage = document.getElementById('originalImage') // the canvas that holds the original image
      var ditheredImageCanvas = document.getElementById('ditheredImageCanvas') // the canvas that holds the dithered image
      var tempImage = originalImage // this holds a copy of the original image which is used to hold the dither data to be drawn onto the canvas
      var ctx = ditheredImageCanvas.getContext("2d"); // canvas context

      ctx.canvas.width = 200; // tell the canvas what size to be
      ctx.canvas.height = 200; // tell the canvas what height to be

      ctx.drawImage(originalImage,0,0,200,200) // put the image on the canvas

      // create new RgbQuant instance
      var q = new RgbQuant(this.rgbQuantOptions);  

      q.sample(originalImage); // analyze histograms to get colors

      var ditherResult = q.reduce(ditheredImageCanvas) // dither what is on the canvas
 
      var imgData = ctx.getImageData(0,0,200,200); // get the image data from the canvas

      imgData.data.set(ditherResult); //set the value of imageData to the dither results

      ctx.putImageData( imgData, 0,0 ); // put the new dithered image data back on the canvas   

      this.downloadImage()

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

