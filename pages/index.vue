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
        <canvas id="ditheredImageCanvas" class="max-w-full" :width="ditheredCanvasWidth" :height="ditheredCanvasHeight"></canvas>
      </div>
    </div>
    <div class="flex">
      <div class="flex-1">
        <ColorPicker v-on:update-palette="onUpdatePalette" :initial-palette="rgbQuantOptions.palette" />  
      </div>
      <div class="flex-1">
        <button @click="ditherImage" class="btn-red">Dither Image</button>
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
      ditheredCanvasWidth: 500,       // Width of the dithered canvas
      ditheredCanvasHeight: 500,      // Height of the dithered canvas
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
      }
    }
  },
  methods: {
    // This receives a palette from ColorPicker in the form of an array of hex values
    onUpdatePalette(palette) {
      this.rgbQuantOptions.palette = []
      palette.forEach((v,i) => {
        this.rgbQuantOptions.palette.push(v)
      })
    },
    onImageUpload(width,height) {
      this.ditheredCanvasWidth = imageCanvas.width
      this.ditheredCanvasHeight = imageCanvas.height    
      // console.log(this.imageCanvas)
      this.analyzeImagePalette() 
      // // create new RgbQuant instance
      // var q = new RgbQuant(this.rgbQuantOptions);  

      // // analyze histograms
      // q.sample(imageCanvas);   
      
      // var pal = q.palette(true);

      // this.rgbQuantOptions.palette = pal

    

    },
    ditherImage(img) {
      console.log('ditherImage called')
      var imageCanvas = document.getElementById('imageCanvas') // the canvas that holds the original image
      var ditheredImageCanvas = document.getElementById('ditheredImageCanvas') // the canvas that holds the dithered image
      var ctx = ditheredImageCanvas.getContext("2d"); // canvas context
      
      // create new RgbQuant instance
      var q = new RgbQuant(this.rgbQuantOptions);  
      console.log(this.rgbQuantOptions.palette)
      q.sample(imageCanvas);  

      // get the image data for the new canvas
      var imageData = ctx.getImageData( 0,0, imageCanvas.width, imageCanvas.height ); // get the underlying pixel data from the canvas  
      // reset the new canvas data with the dithered data
      imageData.data.set(q.reduce(imageCanvas))
      // put the new image data on the canvas
      ctx.putImageData( imageData, 0,0 ); // paint the canvas with the new imageData

    },
    analyzeImagePalette() {
      var imageCanvas = document.getElementById('imageCanvas')
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
