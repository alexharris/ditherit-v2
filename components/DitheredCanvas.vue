<template>
  <div>

    <canvas id="ditheredImageCanvas" class="max-w-full" :width="canvasWidth" :height="canvasHeight"></canvas>

  </div>
</template>

<script>
// import Logo from '~/components/Logo.vue'

export default {
    props: ['width','height'],
    data() {
        return {
            canvasWidth: '',
            canvasHeight: ''
        }
    },
    watch: { 
        width: function(newVal, oldVal) { // watch it
            console.log('Prop changed: ', newVal, ' | was: ', oldVal)
            this.canvasWidth = newVal

            
        },
        height: function(newVal, oldVal) { // watch it
            console.log('Prop changed: ', newVal, ' | was: ', oldVal)
            this.canvasHeight = newVal
            
        },        
    },        
    methods: {

    }
}
</script>