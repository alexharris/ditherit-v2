---
title: A few UI and UX changes
date: 2026-05-18
description: Some UI and UX updates
---


Hello,

I got a few requests for some new features, which should be implemented now:

1. The new version has had a pattern where images are re-dithered everytime a setting is changed. This is nice because you get instant feedback to a change, and it feels snappy and responsive. The downside is that if you are working with larger images, or know exactly what settings you want to change, it adds extra time while you wait for each change to trigger a re-dither. So, there is now an option to toggle back on the old basic workflow of making changes to the configuration and then clicking "Dither it!" to run them all at once. This is off by default, but can be change in the new "Settings" tab..and your preference should persisnt between sessions.
2. There is a new "Settings" drawer. There were enough little options accumulating where I decided to clean up the main sidebar by moving it all to a dedicated "settings" area. This is stuff that you probably want to set and forget, and not necessarily need access to as regularly as some of the main configuration options.
3. I re-did some structuraly UI stuff such as moving all of the non-dithering related stuff (newsletter, blog, etc) over to the right sidebar and made the left sidebar a "floating" control panel thing. More like the original v2 layout. I don't love how busy the right sidebar is now, maybe ill trim some of it down in the future.
4. Fixed a bug with transparent animated gifs. Transparency was working, animated gifs were working..and now they are working together, harmoniously.

As always, please feel free to send me feature requests, bugs, share what you are working on, etc.

Thanks,  
Alex
