<template>
    <div class="flex flex-col w-full container px-4 lg:px-16 lg:w-2/3 mx-auto text-red-700 mb-20 items-start">
        <div class="flex flex-col md:flex-row items-center justify-between w-full">
            <div class="text-3xl text-left uppercase order-2 md:order-1">
                Quant Error
            </div>
            <div class="w-48 order-1 md:order-2">
                <a href="https://ditherit.com"><Logo /></a>
            </div>
        </div>
        <p class="text-xl mb-16"> The official blog of the image dithering web application <em>Dither it!</em></p>
        <!-- 
        __________.____    ________    ________ 
        \______   \    |   \_____  \  /  _____/ 
        |    |  _/    |    /   |   \/   \  ___ 
        |    |   \    |___/    |    \    \_\  \
        |______  /_______ \_______  /\______  /
                \/        \/       \/        \/ 
         -->
        <h3 class="font-bold">Quarterly Report: Q4 2020</h3>        
        <p class="text-sm">January 16, 2021</p>
        <p>New year, same Quant Error.</p>
        <p>First off, new functionality: it has been a while since I did anything more than some bug fixes, but this quarter I actually added functionality: palette import! Here is how it looks:</p>
        <img src="~/assets/quant/Q1-2021/import-palette.png" />
        <p>Basically, it is just an array of hex values that can be copied and pasted. Is it the most graceful solution? No, but it is simple and functional..at least I hope.</p>
        <p>What else? Someone who works at google wrote a very thorough and cool article about dithering here: <a href="https://surma.dev/things/ditherpunk/">https://surma.dev/things/ditherpunk/</a>. A lot of it is over my head but it's great. I would like to try and add Bayer dithering to Dither it! at some point...and maybe a synopsis of the portions relevant to Dither it!. Enough blathering, on to the numbers:</p>
        
        <table class="w-full">
            <tbody>
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold w-1/2">Unique Visits</td>
                    <td class="border border-red-700 px-4 py-2">5,100</td>
                </tr>
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold">Page Views</td>
                    <td class="border border-red-700 px-4 py-2">8,600</td>
                </tr>
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold">Image Uploads</td>
                    <td class="border border-red-700 px-4 py-2">10,000</td>
                </tr>
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold">Dithers</td>
                    <td class="border border-red-700 px-4 py-2">40,600</td>
                </tr>        
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold">Countries</td>
                    <td class="border border-red-700 px-4 py-2">50</td>
                </tr>                           
            </tbody>
        </table> 
        <p>Again, numbers are up across the board (shout out <a href="https://twitter.com/bennett4senate">@bennett4senate</a>), except for countries which is the same. That might actually be a pretty unexciting number to track over time, so maybe I'll stop including it and replace it with something else. I should also figure out a way to chart this so it shows the values over time instead of me just narrating them. Maybe that will be the goal or Q1-2021. Also I should probably eventually paginate Quant Error..and like make it an actual blog? Not likely, ditherers.</p>
        <!-- 
        __________.____    ________    ________ 
        \______   \    |   \_____  \  /  _____/ 
        |    |  _/    |    /   |   \/   \  ___ 
        |    |   \    |___/    |    \    \_\  \
        |______  /_______ \_______  /\______  /
                \/        \/       \/        \/ 
         -->
        <h3 class="font-bold">Quarterly Report: Q3 2020</h3>        
        <p class="text-sm">October 11, 2020</p>
        <p>OK, what has been going on with Dither it! over the past three months? First of all, analytics:</p>
        <table class="w-full">
            <tbody>
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold w-1/2">Unique Visits</td>
                    <td class="border border-red-700 px-4 py-2">4,100</td>
                </tr>
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold">Page Views</td>
                    <td class="border border-red-700 px-4 py-2">7,400</td>
                </tr>
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold">Image Uploads</td>
                    <td class="border border-red-700 px-4 py-2">9,100</td>
                </tr>
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold">Dithers</td>
                    <td class="border border-red-700 px-4 py-2">39,000</td>
                </tr>        
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold">Countries</td>
                    <td class="border border-red-700 px-4 py-2">50</td>
                </tr>                           
            </tbody>
        </table> 
        <p>Much to everyone's surprise, all the numbers are higher again. To some extent, this might be due to getting randomly linked to
            from a Hacker News comment..but I don't think that can explain all of the growth. Over 10,000 more dithers than the previous quarter, almost 3,000 more uploads.</p> 
        <p> What else? Reading through the Q2 entry I mentioned that it might be fun to look at the top 10 sources of traffic, which I guess is better than doing nothing, so here goes that:</p>
        <ol>
            <li>1. Google, obviously, by far the largest referrer, like 10 fold over the next highest</li>
            <li>2. Hacker News</li>
            <li>3. Bing</li>
            <li>4. DuckDuckGo</li>
            <li>5. Reddit</li>
            <li>6. <a href="https://tiny-helpers.dev/">Tiny Helpers</a></li>
            <li>7. <a href="https://kokorobot.ca/">https://kokorobot.ca/</a></li>
            <li>8. Facebook</li>
            <li>9. Twitter</li>
            <li>10. Are.na</li>
        </ol>  

        <p>Perhaps unsurprising that most of the top referrers are some of the top sites on the net, but good work Tiny Helpers and kokorobot for your outsize contributions.</p>    
        <p>Ok, enough of that, onward to showing some things people have done with Dither it!</p>
        <hr />
        <h4 class="font-lg">BAMPFA'S PRESERVING GUERRILLA TELEVISION</h4>
        <img src="~/assets/quant/3/ar.gif" />
        <img src="~/assets/quant/3/booth.gif" />
        <p>BAMPFA released a great archive of old TVTV footage, interviews, etc and used Dither it! some of the decorative gifs. Check it <a href="https://guerrillatv.bampfa.berkeley.edu/paper-archives">here</a>.</p>
        <hr />
        <h4 class="font-lg">@pondcell</h4>
        <img src="~/assets/quant/3/pondcell.png" />
        <p>Twitter user <a href="https://twitter.com/pondcell">@pondcell</a> made some very cool <a href="https://twitter.com/pondcell">digital artwork</a> using Dither it! to get some added texture</p>
        <hr />
        <h4 class="font-lg">The Dithering.</h4>
        <p>Fred at <a href="https://fdisk.space/">https://fdisk.space/</a> included Dither it! in a very nice <a href="https://fdisk.space/dithering/">write up about dithing</a>, image compression etc. Thanks Fred!</p>
        <!-- 
        __________.____    ________    ________ 
        \______   \    |   \_____  \  /  _____/ 
        |    |  _/    |    /   |   \/   \  ___ 
        |    |   \    |___/    |    \    \_\  \
        |______  /_______ \_______  /\______  /
                \/        \/       \/        \/ 
         -->
        <h3 class="font-bold">Quarterly Report: Q2 2020</h3>        
        <p class="text-sm">July 28, 2020</p>
        <p>Oh my god, I am actually doing a second <em>Quant Error</em> entry. As always (meaning the one previous time I have done this) we start by looking at the numbers</p>
        <table class="w-full">
            <tbody>
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold w-1/2">Unique Visits</td>
                    <td class="border border-red-700 px-4 py-2">3,400</td>
                </tr>
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold">Page Views</td>
                    <td class="border border-red-700 px-4 py-2">5,800</td>
                </tr>
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold">Image Uploads</td>
                    <td class="border border-red-700 px-4 py-2">6,400</td>
                </tr>
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold">Dithers</td>
                    <td class="border border-red-700 px-4 py-2">28,400</td>
                </tr>        
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold">Countries</td>
                    <td class="border border-red-700 px-4 py-2">45</td>
                </tr>                           
            </tbody>
        </table>
        <p>Numbers are up across the board, with the exception of number of countries. I will have to do some additional research to determine whether this correllates to a general decrease in the number of countries.</p>
        <p>Of particular note, the number of dithers is up almost 50% from Q1, despite far less significant increases in number of visitors and page views. Hopefully this means that people are really dithering a lot of stuff, and not that something is broken so they are having to try over and over to get it to work correctly (we'll never know!) I think a goal for some future update is to encourage some mechanism of actually seeing what people are dithering, maybe a hashtag or something. In the meantime, please share what you are dithering with me!</p>
        <p>What else?</p>
        <p>I did, in the last few months, create a plugin for phpBB that dithers images uploaded by users. Behold, <a href="https://github.com/alexharris/phpbb-dither-it">phpbb-dither-it v1.0</a>. With this release, Dither it! is officially a startup on the cutting edge of tech.</p>
        <img src="~/assets/quant/2/phpbb-ditherit.png"  />
        <p>Oh also, thanks to a user tip I fixed a bug that was limiting the dithering to 8 colors, despite the palette showing more..so now you can select any number of colors and it will really use them all. Oops that this didn't work before!</p>
        <p>OK, nothing else to say for this quarter. Note to self for next time if there is nothing to talk about: it might be fun to look at the top ten sources of traffic or something like that. Ok bye.</p>

        <p></p>
        <!-- 
        __________.____    ________    ________ 
        \______   \    |   \_____  \  /  _____/ 
        |    |  _/    |    /   |   \/   \  ___ 
        |    |   \    |___/    |    \    \_\  \
        |______  /_______ \_______  /\______  /
                \/        \/       \/        \/ 
         -->        
        <h3 class="font-bold">Quarterly Report: Q1 2020</h3>
        <p class="text-sm">April 11, 2020</p>
        <p>Welcome to the inaugural post of <em>Quant Error</em>, the Dither it! blog. The first quarter of 2020 has been a wild ride for Dither it!, and I would like to highlight some of what has been going on.</p>
        <p>First, let's look at the numbers:</p>
        <table class="w-full">
            <tbody>
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold w-1/2">Unique Visits</td>
                    <td class="border border-red-700 px-4 py-2">3,000</td>
                </tr>
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold">Page Views</td>
                    <td class="border border-red-700 px-4 py-2">5,200</td>
                </tr>
                <tr>
                    <td class="border border-red-700 px-4 py-2 font-bold">Image Uploads</td>
                    <td class="border border-red-700 px-4 py-2">6,100</td>
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
img {
    @apply max-w-full;
}

p {
    @apply pb-4;
}

h4 {
    @apply pb-6;
}

a {
    @apply font-bold;
}

a:hover {
    @apply text-red-800 ;
}

hr {
    @apply border-b border-red-700 my-4 w-full;
}

</style>
