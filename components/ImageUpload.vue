<template>
  <div @paste="handlePaste">
    <div v-if="loading" class="text-center text-gray-500 py-4">Loading...</div>
    <div class="flex flex-col md:flex-row items-center flex-wrap" v-if="duck == 'true'">
      <div
        
        class="border-0 md:border border-gray-200 border-dashed md:p-16 md:mt-8 text-center text-gray-400 rounded-lg flex flex-col md:flex-row flex-wrap items-center justify-center"
        :class="[dragging ? 'dragenterClass' : '']" 
        @drop.prevent="imageUploaded" 
        @dragenter.prevent="dragging = false"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
      >     
        <label class="btn-red-outline text-center inline-block bg-white cursor-pointer ">
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
        <span class="btn-red-outline text-center inline-block bg-white cursor-pointer"  @click="startWithDuck" >
          🐸 Start with a frog
        </span>        
        <div class="invisible md:visible h-0 md:h-16 pt-8 w-full">
          <span v-if="notAnImage" class="text-red-700 bg-red-200 rounded p-4">
            No one knows what that is. Try using a jpg, png, or gif.
          </span>
          <span v-else>
            Drag and drop here <br />
            or<br />click here to paste
          </span>
          
        </div>
      </div>


    </div>
    <div class="flex flex-col md:flex-row items-center" v-else>
      <label  class="btn-red-outline text-center inline-block bg-white cursor-pointer " >
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
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      dragging: false,
      notAnImage: false,
      images: []
    }
  },
  props: ['text', 'duck'],
  methods: {
    // ---------------------------
    // Get the uploaded images and create an initial array of the objects
    // ----------------------------
    async imageUploaded(e) {
      if(!e.target.files) {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
            if (
              e.dataTransfer.files[i].type !== 'image/jpeg' &&
              e.dataTransfer.files[i].type !== 'image/jpg' &&
              e.dataTransfer.files[i].type !== 'image/gif' &&
              e.dataTransfer.files[i].type !== 'image/png'
            ) {
              this.notAnImage = true
              this.dragging = false
              return
            }
        }
        fathom('trackGoal', 'TG6BKJ0A', 0) // drag and dropped
        e.target.files = e.dataTransfer.files
      }
      this.reportNumberOfImages(e.target.files.length)
      this.loading = true

      const files = e.target.files

      // build an array of all the uploaded images and their details
      for (let i = 0; i < files.length; i++) {
        const id = 'originalImage' + (i + 1)
        this.images[i] = []
        this.images[i]['id'] = id
        this.images[i]['type'] = files[i].type
        this.images[i]['name'] = files[i].name
        this.images[i]['size'] = files[i].size
      }

      // wait for Vue to render the img tags in the parent
      await this.$nextTick()

      // load all images in parallel and wait for them to finish
      const promises = []
      for (let i = 0; i < files.length; i++) {
        promises.push(this.createOriginalImage(files[i], i))
      }
      await Promise.all(promises)

      this.$emit('image-upload', this.images)
      this.loading = false
    },

    // ---------------------------
    // Create the original images from the uploaded images
    // & add width/height to images array
    // ----------------------------
    createOriginalImage(file, i) {
      const id = i + 1 // id starts at 1
      const tempImage = document.getElementById('originalImage' + id)
      const reader = new FileReader()

      return new Promise((resolve) => {
        reader.onload = (event) => {
          tempImage.src = event.target.result
          tempImage.onload = () => {
            this.images[i]['width'] = tempImage.naturalWidth
            this.images[i]['height'] = tempImage.naturalHeight
            resolve()
          }
        }
        reader.readAsDataURL(file)
      })
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
    async startWithDuck() {
      fathom('trackGoal', 'HJQ6OA1C', 0)

      this.loading = true

      const response = await fetch(require('~/assets/examples/quantfrog.png'))
      const blob = await response.blob()
      const file = new File([blob], 'name')

      this.reportNumberOfImages(1)

      const i = 0
      const id = 'originalImage' + (i + 1)

      this.images[i] = []
      this.images[i]['id'] = id
      this.images[i]['type'] = 'png'
      this.images[i]['name'] = 'Frog'
      this.images[i]['size'] = file.size

      await this.$nextTick()
      await this.createOriginalImage(file, i)

      this.$emit('image-upload', this.images)
      this.loading = false
    },
    // ---------------------------
    // Handle pasted images
    // ----------------------------
    async handlePaste(event) {
      const items = (event.clipboardData || event.originalEvent.clipboardData).items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          const id = 'originalImage' + (this.images.length + 1);
          this.images.push({
            id: id,
            type: file.type,
            name: file.name,
            size: file.size,
          });
          this.reportNumberOfImages(this.images.length);

          await this.$nextTick()
          await this.createOriginalImage(file, this.images.length - 1);

          this.$emit('image-upload', this.images);
        }
      }
    },
  
  }
}
</script>


<style scoped>
.dragenterClass {
  @apply bg-gray-200
}
</style>