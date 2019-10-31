<template>
  <div>
    <img id="originalImage" class="max-w-full"/>
    <label>Image File:</label><br/>
    <input type="file" id="imageLoader" name="imageLoader" @change="imageUploaded"  />
  </div>
</template>

<script>
// import Logo from '~/components/Logo.vue'

export default {
  data() {
    return {
    }
  },
  methods: {
    imageUploaded(e){
      var imageLoader = document.getElementById('imageLoader');
      var image = document.getElementById('originalImage');
      var reader = new FileReader(); // this creates a new Reader

      reader.readAsDataURL(e.target.files[0]);  // Read the data of the target as a data url

      reader.onload = (event) => { // when the reader is loaded
          image.src = event.target.result // replace the image source, of which there is none at this point, with the resulst of the Reader
          this.$emit('image-upload', image.naturalWidth, image.naturalHeight) // This tells the main page what size the image is naturally
      }
     
    }       
  }
}
</script>