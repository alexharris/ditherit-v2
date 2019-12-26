<template>
  <div>
    <div v-if="loading" class="loader"></div>
    <label class="btn-red-outline xl:w-64 text-center inline-block mt-4">
      <span>✨ Select image</span>
      <input
        id="imageLoader"
        type="file"
        accept=".jpg, .png, .gif, .tif, .bmp"
        name="imageLoader"
        class="hidden"
        @change="imageUploaded"
      />
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
    imageUploaded(e) {
      this.loading = true

      const imageLoader = document.getElementById('imageLoader')
      const image = document.getElementById('originalImage')
      const reader = new FileReader() // this creates a new Reader

      reader.onload = (event) => {
        // when the reader is loading

        image.src = event.target.result // replace the image source, of which there is none at this point, with the result of the Reader
        setTimeout(() => {
          // wait a sec before telling mama
          this.tellYourMama(e)
        }, 100)
      }

      reader.readAsDataURL(e.target.files[0]) // Read the data of the target as a data url

      this.loading = false
    },
    tellYourMama(e) {
      const image = document.getElementById('originalImage')
      this.$emit(
        'image-upload',
        image.naturalWidth,
        image.naturalHeight,
        e.target.files[0].name,
        e.target.files[0].type
      )
    }
  }
}
</script>
