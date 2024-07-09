/* eslint-disable no-console */
<template>
  <div
    class="mt-8 w-full border-b border-dashed border-red-600 pb-16"
  >
    <h3 class="text-3xl w-full pb-8 font-serif text-center mx-0 px-0">Contact</h3>
    <p class="text-center pb-12">Say hello, report a bug, or make a feature request!</p>
      <form name="contact" class="w-full md:w-4/5 mx-auto px-8" data-netlify="true">
        <div class="flex flex-col md:flex-row w-full justify-between md:gap-4">
          <label htmlFor="name" class="flex flex-col mb-4 w-full md:w-1/2">
            Name
            <input type="text" name="name" id="name" class="border-red-700" />      
          </label>
          <label htmlFor="email" class="flex flex-col mb-4 w-full md:w-1/2">
            Email
            <input type="email" name="email" id="email" class="border-red-700" />      
          </label>
        </div>
        <label htmlFor="message" class="flex flex-col mb-4 ">
          Message
          <textarea name="message" id="message" class="border-red-700"></textarea>      
        </label>
        <button type="submit" class="btn-red-outline">Submit Message</button>
      </form>
  </div>
</template>

<script>



export default {
  components: {
    
  },

  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style scoped>

</style>

