<template>
    <div class="flex flex-col w-full container px-4 lg:px-16 lg:w-2/3 mx-auto text-red-700 mb-20">
        <div class="flex flex-col md:flex-row items-center justify-between ">
            <div class="text-3xl text-left uppercase order-2 md:order-1">
                Quant Error
            </div>
            <div class="w-48 order-1 md:order-2">
                <a href="https://ditherit.com"><Logo /></a>
            </div>
        </div>
        <p class="text-xl mb-16"> The official blog of the image dithering web application <em>Dither it!</em></p>
        <h3 class="font-bold">Quarterly Report: Q1 2020</h3>
        <p class="text-sm">April 11, 2020</p>
        <p>Welcome to the inaugural post of <em>Quant Error</em>, the Dither it! blog. The first quarter of 2020 has been a wild ride for Dither it!, and I would like to highlight some of what has been going on.</p>
        <p>First, let's look at the numbers:</p>
        <table class="w-full">
            <tbody>
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold w-1/2">Unique Visits</td>
                    <td class="border border-red-700 px-4 py-2">3000</td>
                </tr>
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold">Page Views</td>
                    <td class="border border-red-700 px-4 py-2">5200</td>
                </tr>
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold">Image Uploads</td>
                    <td class="border border-red-700 px-4 py-2">6100</td>
                </tr>
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold">Dithers</td>
                    <td class="border border-red-700 px-4 py-2">19,600</td>
                </tr>        
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold">Countries</td>
                    <td class="border border-red-700 px-4 py-2">50</td>
                </tr>                           
            </tbody>
        </table>   

        <p>Over 3000 unique viewers visited Dither it! 5200 times from over 50 countries. While here, these users uploaded over 6000 images and dithered those images almost 20,000 times. That's a lot of dithering.</p>
        <p>While I generally do not get to see most of the images that are being dithered, sometimes folks get in touch to let me know they have used Dithered it!. I love seeing these projects and would like to highlight a few here:</p>
        <hr />
        <h4 class="font-lg">Yacht's Bandcamp</h4>
        <img src="~/assets/quant/1/yacht-bandcamp.png"  />
        <p>Portland/LA band Yacht re-did their <a href="https://yacht.bandcamp.com/">bandcamp</a> recently with all-dithered versions of their album covers.</p>
        <hr />
        <h4 class="font-lg">Circa</h4>
        <img src="~/assets/quant/1/circa.png"  />
        <p>Web comic <a href="https://circacomic.kokorobot.ca/">Circa</a> used Dither it! to style their character portraits. They made use of the Atkinson algorithm, using the Serprentine option. Great to see people using some of these more esoteric features:</p>
        <blockquote class="twitter-tweet mb-4"><p lang="en" dir="ltr">Thx for making it. Wasn&#39;t familiar with a lot of the dithering algorithms listed in ditherit. Atkinson with serpentine dither works especially well for the set of images I&#39;m processing atm. <br>Was also influenced by low-tech mag. Anyway, thx again.</p>&mdash; 『 Я Σ K 』 (@RekkaBell) <a href="https://twitter.com/RekkaBell/status/1228374682707144704?ref_src=twsrc%5Etfw">February 14, 2020</a></blockquote>         
        <hr />
        <h4 class="font-lg">Timothée Goguely</h4>
        <img src="~/assets/quant/1/timothee.png"  />
        <p>French designer and developer <a href="https://timothee.goguely.com/">Timothée Goguely</a>, who was kind enough to add Dither it! to Product Hunt, dithered various imagery on his personal site and twitter account.</p>
        <hr />
        <p>That's it for the first ever Dither it! Quarterly Report.</p>
        <p>Thanks,<br />Alex</p>
        <BottomContent />
    <!-- Fathom - simple website analytics - https://usefathom.com -->
    <script>
      ;(function(f, a, t, h, o, m) {
        a[h] =
          a[h] ||
          function() {
            ;(a[h].q = a[h].q || []).push(arguments)
          }
        ;(o = f.createElement('script')),
          (m = f.getElementsByTagName('script')[0])
        o.async = 1
        o.src = t
        o.id = 'fathom-script'
        m.parentNode.insertBefore(o, m)
      })(document, window, '//cdn.usefathom.com/tracker.js', 'fathom')
      fathom('set', 'siteId', 'AHDLJXNJ')
      fathom('trackPageview')
    </script>
    <!-- / Fathom -->
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo,
  },
  data() {
    return {

    }
  },
  computed: {

  },
  methods: {


  }
}
</script>

<style scoped>

p {
    @apply pb-4
}

h4 {
    @apply pb-6
}

a {
    @apply font-bold
}

a:hover {
    @apply text-red-800 
}

hr {
    @apply border-b border-red-700 my-4
}

</style>
