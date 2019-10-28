<template>
    <div>
        Image Canvas
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

  },
  created() {
      var img = document.getElementById('uploaded-image'); // get the uploaded image
      console.log(img)

  }
}
</script>