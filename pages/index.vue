<template>
  <div class="container">
    <h1 class="title">
      ditherit
    </h1>  

    <div class="flex">
      <div class="flex-1">
        <ImageUpload />  
        <div @click="ditherImage">Dither Image</div>
      </div>
      <div class="flex-1">
        <canvas id="ditheredImageCanvas" class="border border-red-500" :width="500" :height="500"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import RgbQuant from 'rgbquant'
import ImageUpload from '~/components/ImageUpload.vue'
import ImageCanvas from '~/components/ImageCanvas.vue'

export default {
  components: {
    ImageUpload,
    ImageCanvas
  },
  data() {
    return {
      originalFileUrl: '', // The "url" of the image sent from the ImageUpload module
      originalImage: '', // The original image in the DOM 
      canvasWidth: 500, // The original width of the canvas
      canvasHeight: 500, // The original height of the canvas
      imgData: ''
    }
  },
  methods: {

    createCanvas() {
      console.log('createCanvas called')
      
      var canvas = document.getElementById('ditheredImageCanvas'); // get the canvas created to hold the new image
      var ctx = canvas.getContext("2d");
      var img = document.getElementById('imageCanvas')
      // var ditheredImg = this.ditherImage(img)

      ctx.clearRect(0,0,500,500);
      ctx.drawImage(img,0,0,500,500);
      var imgData = ctx.getImageData( 0,0,500,500 ); // get the underlying pixel data from the canvas
      // console.log(imgData)
      // imgData.data.set(img);
      ctx.putImageData( imgData, 0,0 );
    },
    ditherImage(img) {
      console.log('ditherImage called')
      var imageCanvas = document.getElementById('imageCanvas')
      var ditheredImageCanvas = document.getElementById('ditheredImageCanvas')
      var ctx = ditheredImageCanvas.getContext("2d");    
     


      // options with defaults (not required)
      var opts = {
          colors: 4,             // desired palette size
          method: 1,               // histogram method, 2: min-population threshold within subregions; 1: global top-population
          boxSize: [8,8],        // subregion dims (if method = 2)
          boxPxls: 2,              // min-population threshold (if method = 2)
          initColors: 4096,        // # of top-occurring colors  to start with (if method = 1)
          minHueCols: 2000,           // # of colors per hue group to evaluate regardless of counts, to retain low-count hues
          dithKern: null,          // dithering kernel name, see available kernels in docs below
          dithDelta: 0,            // dithering threshhold (0-1) e.g: 0.05 will not dither colors with <= 5% difference
          dithSerp: false,         // enable serpentine pattern dithering
          palette: [],             // a predefined palette to start with in r,g,b tuple format: [[r,g,b],[r,g,b]...]
          reIndex: false,          // affects predefined palettes only. if true, allows compacting of sparsed palette once target palette size is reached. also enables palette sorting.
          useCache: true,          // enables caching for perf usually, but can reduce perf in some cases, like pre-def palettes
          cacheFreq: 10,           // min color occurance count needed to qualify for caching
          colorDist: "euclidean",  // method used to determine color distance, can also be "manhattan"
      };
      
      var q = new RgbQuant(opts);  

      // analyze histograms
      q.sample(imageCanvas); 
      
      // build palette
      var pal = q.palette();
      
      // reduce images
      var out = q.reduce(imageCanvas)  

      ctx.drawImage(imageCanvas,0,0)
      // ctx.clearRect(0, 0, 500, 500);

      var imageData = ctx.getImageData( 0,0,500,500 ); // get the underlying pixel data from the canvas  

      imageData.data.set(out)

      ctx.putImageData( imageData, 0,0 ); // paint the canvas with the new imageData


      // var newImage = new Image();
      // newImage.onload = function() {
      //   ctx.drawImage(newImage,0,0)
      // }
      // img.src=out;


      // return out
    }
    
  },

}
</script>
