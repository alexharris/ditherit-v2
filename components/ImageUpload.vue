<template>
    <div>
        <!-- <input type="file" @change="onFileSelect" /> -->
        <!-- <button v-on:click="$emit('uploadFile', originalFileUrl)">
            Submit
        </button> -->
      <label>Image File:</label><br/>
      <input type="file" id="imageLoader" name="imageLoader" @change="imageUploaded"/>
      <canvas id="imageCanvas"></canvas>        
    </div>
</template>

<script>
// import Logo from '~/components/Logo.vue'

export default {
  data() {
    return {
      originalFileUrl: ''
    }
  },
  methods: {
    imageUploaded(e){
      var imageLoader = document.getElementById('imageLoader');
      var canvas = document.getElementById('imageCanvas');
      var ctx = canvas.getContext('2d');   

      var reader = new FileReader();
      reader.onload = function(event){
          var img = new Image();
          img.onload = function(){
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img,0,0);
          }
          img.src = event.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);     
    }       
  }
}
</script>