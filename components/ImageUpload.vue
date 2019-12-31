<template>
  <div>
    <div v-if="loading" class="loader"></div>
    <label class="btn-red-outline xl:w-64 text-center inline-block mt-4">
      <span>✨ Select image</span>
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
      this.loading = true
      this.reportNumberOfImages(e)
      this.images = e.target.files


      setTimeout(() => {
        // wait a sec before telling mama
        for (let i = 0; i < this.images.length; i++) {
          this.createOriginalImages(this.images[i], i)
        }
      }, 100)

      this.loading = false

    },
    createOriginalImages(image, i) {
      const id = 'originalImage' + (i + 1) // the id for img for the image
      const tempImage = document.getElementById(id) // the img for the image
      const reader = new FileReader() // this creates a new Reader
      reader.onload = (event) => {
        // when the reader is loading
        tempImage.src = event.target.result // replace the image source, of which there is none at this point, with the result of the Reader
        setTimeout(() => {
          // wait a sec before telling mama
          this.tellYourMama(image, id)
        }, 100)
      }
      reader.readAsDataURL(image) // Read the data of the target as a data url
    },
    reportNumberOfImages(e) {
      this.$emit('number-images', e.target.files.length)
    },
    tellYourMama(image, id) {
      const img = document.getElementById(id)
      this.$emit(
        'image-upload',
        img,
        img.naturalWidth,
        img.naturalHeight,
        image.name,
        image.type,
        id
      )
    }
  }
}
</script>
