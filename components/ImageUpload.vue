/* eslint-disable no-console */
<template>
  <div>
    <div v-if="loading" class="loader"></div>
    <div class="flex flex-col md:flex-row items-center">
      <label class="btn-red-outline text-center inline-block bg-white cursor-pointer">
        <span>{{text}}</span>
        <input
          id="imageLoader"
          type="file"
          accept=".jpg, .png, .gif"
          name="imageLoader"
          class="hidden"
          multiple="multiple"
          @change="imageUploaded"
        />
      </label>
      <span class="py-4 px-4" v-if="duck">or</span>
      <label class="btn-red-outline text-center inline-block bg-white  cursor-pointer" v-if="duck">
        <span @click="startWithDuck" v-if="duck == 'true'">🐸 Start with a frog</span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      images: []
    }
  },
  props: ['text', 'duck'],
  methods: {
    // ---------------------------
    // Get the uploaded images and create an initial array of the objects
    // ----------------------------
    imageUploaded(e) {
      console.log('Images uploaded:')
      this.reportNumberOfImages(e.target.files.length)
      console.log(e);
      this.loading = true // for loading spinner

      // now go through the images that have been loaded
      for (let i = 0; i < e.target.files.length; i++) { 

        const id = 'originalImage' + (i + 1) // the id for img tag

        // console.log((i + 1) + ': ' + e.target.files[i].name)

        // build an array of all the upload images and their details
        this.images[i] = []
        this.images[i]['id'] = id
        this.images[i]['type'] = e.target.files[i].type
        this.images[i]['name'] = e.target.files[i].name
        this.images[i]['size'] = e.target.files[i].size

        // send the uploaded file to get turned into an img
        // but we wait a second so that the originalImage img tags in index can load
        console.log('hello');
        console.log(e.target.files[i]);
        setTimeout(() => {
          this.createOriginalImage(e.target.files[i], i)
        }, 100)
      }

      // tell the parent about the images
      setTimeout(() => {
        this.$emit('image-upload',this.images)
      }, 100)
      // Turn off loader
      this.loading = false
    },

    // ---------------------------
    // Create the original images from the uploaded images
    // & add width/height to images array
    // ----------------------------
    createOriginalImage(file, i) {
      console.log('Create original images.')
      const id = i + 1 // id starts at 1
      const tempImage = document.getElementById('originalImage' + id) // find the img tag already created in index.vue for this image
      const reader = new FileReader() // this creates a new Reader

      // This doesnt get run until we give the reader something to read below
      reader.onload = (event) => {
        tempImage.src = event.target.result // replace the image source
      }

      // give the reader the file object
      console.log(file)
      reader.readAsDataURL(file) // Read the data of the target as a data url

      // add width and height of the new images to the images array
      this.images[i]['width'] = tempImage.naturalWidth
      this.images[i]['height'] = tempImage.naturalHeight

    },
    // ---------------------------
    // Tell the parent how many images there are
    // ----------------------------
    reportNumberOfImages(i) {
      this.$emit('number-images', i)
    },
    // ---------------------------
    // This does the same as imageUploaded but for the static duck image
    // ----------------------------    
    startWithDuck() {
      
      fathom('trackGoal', 'HJQ6OA1C', 0)
      
      this.loading = true // for loading spinner

      // conver tot blob
      var file;

      fetch(require('~/assets/examples/quantfrog.png'))
      .then((response) => {
        return response.blob()
      })
      .then((blob) => {
        // here the image is a blob
        file = new File([blob], "name");
        this.reportNumberOfImages(1);
        var i = 0;
        const id = 'originalImage' + (i + 1) // the id for img ta
        

        this.images[i] = []
        this.images[i]['id'] = id
        this.images[i]['type'] = 'png'
        this.images[i]['name'] = 'Frog'
        this.images[i]['size'] = file.size

        
        setTimeout(() => {
          this.createOriginalImage(file, i)
        }, 100)

        setTimeout(() => {
            this.$emit('image-upload',this.images)
          }, 100);           
      });   

      this.loading = false // for loading spinner 
    },
  
  }
}
</script>


