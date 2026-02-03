<template> 
  <div class="flex flex-col xl:flex-row xl:flex-col gap-4 items-center md:items-start p-4">  
    <h2 class="text-sm font-bold mt-2 mb-2 uppercase">Report Card</h2>
    <div class="donutContainer w-2/3 self-center">
      <svg viewBox="0 0 42 42" class="donut">
        <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#d2d3d4" stroke-width="3"></circle>
        <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#c53030" stroke-width="3" :stroke-dasharray="strokeDashArray" stroke-dashoffset="25"></circle>
      
        <g class="chart-text">
          <text x="50%" y="50%" class="chart-number">
            {{ originalFileSize ? ((downloadFileSize / originalFileSize) * 100).toFixed(2) : 0 }}%
          </text>
            <text x="50%" y="50%" class="chart-label">
              
            </text>
        </g>        
      </svg>
  
    </div>
    <div class="w-full">
      <p class="mt-1">
        The file size is
        <strong>{{ originalFileSize ? ((downloadFileSize / originalFileSize) * 100).toFixed(2) : 0 }}%</strong>
        of the original file's size.</p>
        <p>The original was <strong>{{ originalFileSize.toFixed(2) }}kb</strong>, and the dithered one is <strong>{{ downloadFileSize.toFixed(2) }}kb</strong>.
      </p>
    </div>   
  </div>

</template>

<script>
export default {
  props: {
    ratioGood: { type: Boolean, required: true },
    downloadFileSize: { type: Number, required: true },
    originalFileSize: { type: Number, required: true },
    ditheredHeight: { type: [Number, String], default: '' },
    ditheredWidth: { type: [Number, String], default: '' }
  },
  computed: {
    strokeDashArray() {
      if (!this.originalFileSize) return '0 100'
      const pct = (this.downloadFileSize / this.originalFileSize) * 100
      return pct + ' ' + (100 - pct)
    }
  },
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

