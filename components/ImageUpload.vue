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
    imageUploaded(e) {
      

      this.reportNumberOfImages(e)

      this.loading = true // for loading spinner

      // now go through the images that have been loaded
      for (let i = 0; i < e.target.files.length; i++) { 

        
        const id = 'originalImage' + (i + 1) // the id for img tag

        console.log(id)
        // build an array of all the upload images and their details
        this.images[i] = []
        this.images[i]['id'] = id
        this.images[i]['type'] = e.target.files[i].type
        this.images[i]['name'] = e.target.files[i].name
        this.images[i]['size'] = e.target.files[i].size
        // this.images[i].push(
        //   'id': id,
        //   'type': e.target.files[i].type,
        //   'name': e.target.files[i].name,
        //   'size': e.target.files[i].size
        // )
        // send the uploaded file to get turned into an img
        // but we wait a second so that the originalImage img tags in index can load
        setTimeout(() => {
          this.createOriginalImage(e.target.files[i], i)
        }, 100)

        // setTimeout(() => {
        //   this.$emit('image-upload',this.images[i])
        // }, 500)
      }
      // this.tellYourMama() // send the data up to the parent index.vue
      setTimeout(() => {
        this.$emit('image-upload',this.images)
      }, 100)
      this.loading = false
    },
    createOriginalImage(file, i) {
      const id = i + 1
      const tempImage = document.getElementById('originalImage' + id) // find the img already created in index.vue for this image
      const reader = new FileReader() // this creates a new Reader

      // This doesnt get run until we give the reader something to read below
      reader.onload = (event) => {
        tempImage.src = event.target.result // replace the image source
      }

      // give the read the file object
      reader.readAsDataURL(file) // Read the data of the target as a data url

      // add width and height of the new images to the images array
      this.images[i]['width'] = tempImage.naturalWidth
      this.images[i]['height'] = tempImage.naturalHeight

    },
    reportNumberOfImages(e) {
      this.$emit('number-images', e.target.files.length)
    },
    tellYourMama() {

      console.log(this.images)

      this.$emit('image-upload',this.images)
    }
  }
}
</script>
