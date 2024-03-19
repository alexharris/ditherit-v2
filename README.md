```
 ______     _   _   __                       _   _    _  
|_   _ `.  (_) / |_[  |                     (_) / |_ | | 
  | | `. \ __ `| |-'| |--.  .---.  _ .--.   __ `| |-'| | 
  | |  | |[  | | |  | .-. |/ /__\\[ `/'`\] [  | | |  | | 
 _| |_.' / | | | |, | | | || \__., | |      | | | |, |_| 
|______.' [___]\__/[___]|__]'.__.'[___]    [___]\__/ (_) 
```
Dither it! is a web application for dithering images. It is built with Vue, using NuxtJS. Visit it at [ditherit.com](https://ditherit.com).

![Dither example](https://ditherit.com/_nuxt/img/earth-dither.0f5dea9.gif)

You can run it locally by cloning the repo and running the following:

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

#test
$ npm run test

# generate static project
$ npm run generate
```

In some cases (as of Node.js v17) it is necessary to run the command `export NODE_OPTIONS=--openssl-legacy-provider` for handling key size on OpenSSL v3. Note that this needs to be run each time the terminal session is restarted.
After that `$ npm run dev` works.

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

The dithering is done using [RgbQuant.js](https://github.com/leeoniya/RgbQuant.js). 
