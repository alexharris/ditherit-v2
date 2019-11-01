<template>
    <div class="w-full xl:w-1/4 flex flex-col md:flex-row xl:flex-col mt-8 xl:mt-0" >
        <div class="w-full md:w-1/2 xl:w-full text-center" >
            <a class="btn-red-large xl:w-full inline-block" target="_blank" @click="downloadImage" :href="downloadUrl" :download="'dither_it_' + fileName">💾 Download</a>
        </div>   
        <div class="border-solid border shadow-lg rounded p-3 mt-2 w-1/2 xl:w-full h-0 md:h-auto invisible md:visible" >  
            <h4 class="text-lg font-bold mb-2">File Details</h4>
            <h5 class="text-md font-bold">Original</h5>
            <ul>
                <li>Filename: {{fileName}} </li>
                <li>Filesize: {{originalFileSize}} KB</li>
                <li>Width: {{originalCanvasWidth}}px</li>
                <li>Height: {{originalCanvasHeight}}px</li>
            </ul>
            <div v-show="showDitheredImage">
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

</template>

<script>

  export default {
    data() {
      return {
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
    }
  }
</script>