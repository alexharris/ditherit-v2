<template>
  <div>
    <div class="loader" v-if="loading"></div>
    <img id="originalImage" class="max-w-full" />

    <label class="btn-red-large inline-block m-4 ">
        <span class="text-lg">Select a file</span>
        <input type="file" id="imageLoader" name="imageLoader" @change="imageUploaded" class="hidden" />
    </label>
   
    
    
  </div>

</template>

<script>

  export default {
    data() {
      return {
        loading: false
      }
    },
    methods: {
      imageUploaded(e){
          
          this.loading = true

          var imageLoader = document.getElementById('imageLoader');
          var image = document.getElementById('originalImage');
          var reader = new FileReader(); // this creates a new Reader

          reader.onload = (event) => { // when the reader is loading

              image.src = event.target.result // replace the image source, of which there is none at this point, with the result of the Reader
              setTimeout(() => { // wait a sec before telling mama
                this.tellYourMama(e)
              }, 100)
          }          

          reader.readAsDataURL(e.target.files[0]);  // Read the data of the target as a data url
          
          this.loading = false

      },
      tellYourMama(e) {
        var image = document.getElementById('originalImage');
        this.$emit('image-upload', image.naturalWidth, image.naturalHeight, e.target.files[0].name)
      }  
    }
  }
</script>