/* eslint-disable no-console */
<template> 
  <div class="flex flex-col sm:flex-row xl:flex-col gap-4 items-center md:items-start">  
    <div class="donutContainer w-2/3 sm:w-1/2 md:w-1/3 xl:w-full">
      <svg viewBox="0 0 42 42" class="donut">
        <!-- <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle> -->
        <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#d2d3d4" stroke-width="3"></circle>
        <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#c53030" stroke-width="3" :stroke-dasharray="strokeDashArray" stroke-dashoffset="25"></circle>
      
        <g class="chart-text">
          <text x="50%" y="50%" class="chart-number">
            {{((this.downloadFileSize / this.originalFileSize) * 100).toFixed(2)}}%
          </text>
            <text x="50%" y="50%" class="chart-label">
              
            </text>
        </g>        
      </svg>
  
    </div>
    <!-- <div class="w-1/3 xl:w-full px-4 xl:p-0">
      File Details
      <div class="border-t border-dashed mt-2">
        <h3 class="mt-2 text-sm">Original</h3>
        <ul class="mt-1">
          <li>
            <strong>Size: </strong>{{ selectedImage.naturalWidth }}px x
            {{ selectedImage.naturalHeight }}px
          </li>
          <li>
            <strong>Filesize: </strong>{{ (Math.round(((selectedImage.src.length) * 3) / 4) / 1000).toFixed(2) }}kb
          </li>
        </ul>
      </div>
      <div class="border-t border-dashed mt-2">
        <h3 class="mt-2 text-sm">Dithered</h3>
        <ul class="mt-1">
          <li>
            <strong>Size: </strong>{{ ditheredWidth }}px x
            {{ ditheredHeight }}px 
          </li>
          <li>
            <strong>Filesize: </strong>
            {{ downloadFileSize.toFixed(2) }}kb
          </li>
        </ul>  
      </div>    
    </div>   -->
    <div class="w-full md:w-2/3 xl:w-full">
      <p class="mt-1">
        The file size is
        <strong
          >{{
            (( downloadFileSize / (Math.round(((this.selectedImage.src.length) * 3) / 4) / 1000)) * 100).toFixed(2)
          }}%</strong
        >
        of the original file's size.</p>
        <p>The original was <strong>{{ (Math.round(((selectedImage.src.length) * 3) / 4) / 1000).toFixed(2) }}kb</strong>, and the dithered one is <strong>{{ downloadFileSize.toFixed(2) }}kb</strong>. 
      </p> 
    </div>   
    <!-- <div class="w-full md:w-1/3 xl:w-full border-t border-dashed pt-2">
      <ul>
        <li><strong>Size:</strong> {{ditheredWidth}}px x {{ditheredHeight}}px</li>
        <li><strong>Colors:</strong> {{rgbquant.colors}}</li>
        <li><strong>Algorithm:</strong> {{rgbquant.dithKern}}</li>
      </ul>
    </div>     -->
  </div>

</template>

<script>
export default {
  props: ['ratioGood', 'downloadFileSize', 'selectedImage', 'ditheredHeight', 'ditheredWidth', 'downloadFileSize', 'rgbquant'],
    computed: {
    originalFileSize() {
      return (Math.round(((this.selectedImage.src.length) * 3) / 4) / 1000).toFixed(2);
    },
    strokeDashArray() {

      return ((this.downloadFileSize / this.originalFileSize) * 100) + ' ' + (100 - ((this.downloadFileSize / this.originalFileSize) * 100));
    }
  },
  data() {
    return {
      
    }
  },
  methods: {




  }
}
</script>

<style scoped>
.chart-text {
  fill: #000;
  -moz-transform: translateY(0.25em);
  -ms-transform: translateY(0.25em);
  -webkit-transform: translateY(0.25em);
  transform: translateY(0.25em);
}

.chart-number {
  font: italic 6px serif; 
  /* fill: red; */
  line-height: 1;
  text-anchor: middle;
  -moz-transform: translateY(-0.25em);
  -ms-transform: translateY(-0.25em);
  -webkit-transform: translateY(-0.25em);
  transform: translateY(-0.25em);
}

.chart-label {
    /* font: italic 3px serif;  */
  text-transform: uppercase;
  text-anchor: middle;
  -moz-transform: translateY(0.7em);
  -ms-transform: translateY(0.7em);
  -webkit-transform: translateY(0.7em);
  transform: translateY(0.7em);
}
</style>

