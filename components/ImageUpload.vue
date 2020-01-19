/* eslint-disable no-console */
<template>
  <div>
    <div v-if="loading" class="loader"></div>
    <label class="btn-red-outline xl:w-64 text-center inline-block mt-4">
      <span>✨ Select images</span>
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
  methods: {
    // ---------------------------
    // Get the uploaded images and create an initial array of the objects
    // ----------------------------
    imageUploaded(e) {
      console.log('Images uploaded:')
      this.reportNumberOfImages(e)

      this.loading = true // for loading spinner

      // now go through the images that have been loaded
      for (let i = 0; i < e.target.files.length; i++) { 

        const id = 'originalImage' + (i + 1) // the id for img tag

        console.log((i + 1) + ': ' + e.target.files[i].name)
        // build an array of all the upload images and their details
        this.images[i] = []
        this.images[i]['id'] = id
        this.images[i]['type'] = e.target.files[i].type
        this.images[i]['name'] = e.target.files[i].name
        this.images[i]['size'] = e.target.files[i].size

        // send the uploaded file to get turned into an img
        // but we wait a second so that the originalImage img tags in index can load
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
      reader.readAsDataURL(file) // Read the data of the target as a data url

      // add width and height of the new images to the images array
      this.images[i]['width'] = tempImage.naturalWidth
      this.images[i]['height'] = tempImage.naturalHeight

    },
    // ---------------------------
    // Tell the parent how many images there are
    // ----------------------------
    reportNumberOfImages(e) {
      this.$emit('number-images', e.target.files.length)
    }
  }
}
</script>
