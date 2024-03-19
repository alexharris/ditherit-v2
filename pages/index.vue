<template>
  <div class="flex flex-col items-center max-w-full">
    <div class="flex flex-column w-full p-4 md:justify-center" :class="{ 'w-full flex justify-start': imageUploaded}">
      <Logo />
      <a class="fixed top-0 right-0 w-24 h-24 border-0 hover:border-0 z-50" href="https://ko-fi.com/alexharris6" target="_blank">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_297_3)">
        <path d="M58.9274 12.3103C59.9093 11.7218 61.1877 12.0873 61.7235 13.1098L64.6161 18.6293C65.0133 19.3872 65.8432 19.8125 66.6836 19.6889L72.8467 18.7822C73.9839 18.6149 75.0328 19.4465 75.1371 20.5979L75.6923 26.7248C75.7699 27.5814 76.3823 28.2968 77.2146 28.5031L83.2693 30.0037C84.3962 30.283 85.0569 31.4627 84.7064 32.5695L82.8716 38.3624C82.6103 39.1874 82.9083 40.0914 83.6101 40.6023L88.6224 44.2513C89.5705 44.9416 89.7349 46.294 88.9784 47.1813L85.0534 51.7847C84.4899 52.4456 84.4199 53.4 84.8803 54.144L88.1105 59.363C88.7304 60.3647 88.3666 61.6786 87.3236 62.2048L81.8892 64.9465C81.1145 65.3373 80.6844 66.1888 80.8261 67.0514L81.8129 73.0591C82.0031 74.217 81.1688 75.2839 80.0055 75.3705L73.8561 75.8282C72.9951 75.8923 72.2769 76.5057 72.0765 77.3482L70.6694 83.2634C70.4005 84.3935 69.2314 85.05 68.1265 84.6912L62.19 82.7634C61.374 82.4984 60.4843 82.7843 59.9785 83.4741L56.3607 88.4078C55.6808 89.3351 54.359 89.4888 53.4746 88.7435L48.681 84.7041C48.0273 84.1533 47.1009 84.0765 46.3731 84.5127L41.0725 87.6897C40.0906 88.2782 38.8122 87.9127 38.2764 86.8902L35.3838 81.3707C34.9866 80.6128 34.1567 80.1875 33.3163 80.3111L27.1532 81.2178C26.016 81.3851 24.9671 80.5535 24.8628 79.4021L24.3076 73.2752C24.23 72.4186 23.6176 71.7032 22.7853 71.497L16.7306 69.9963C15.6037 69.717 14.943 68.5373 15.2935 67.4305L17.1283 61.6376C17.3896 60.8126 17.0916 59.9086 16.3898 59.3977L11.3775 55.7487C10.4294 55.0584 10.265 53.706 11.0215 52.8187L14.9465 48.2153C15.51 47.5544 15.58 46.6 15.1195 45.856L11.8894 40.637C11.2695 39.6353 11.6333 38.3214 12.6763 37.7952L18.1107 35.0535C18.8854 34.6627 19.3155 33.8112 19.1738 32.9487L18.187 26.9409C17.9968 25.783 18.8311 24.7161 19.9944 24.6295L26.1438 24.1718C27.0048 24.1077 27.723 23.4943 27.9234 22.6518L29.3305 16.7366C29.5994 15.6065 30.7685 14.95 31.8734 15.3088L37.8099 17.2366C38.6259 17.5016 39.5156 17.2157 40.0214 16.5259L43.6392 11.5922C44.3191 10.6649 45.6409 10.5112 46.5253 11.2565L51.3189 15.2959C51.9726 15.8467 52.899 15.9235 53.6268 15.4873L58.9274 12.3103Z" fill="#C53030"/>
        </g>
        <path d="M32.7577 31.1851C32.8238 30.7549 32.7138 30.3748 32.4279 30.0448C32.1419 29.7149 31.7449 29.4773 31.2369 29.332C30.8654 29.2258 30.5237 29.1931 30.2117 29.2339C29.9025 29.2755 29.6408 29.3795 29.4268 29.5458C29.2154 29.7128 29.0726 29.9305 28.9983 30.1989C28.9362 30.4234 28.936 30.6316 28.9978 30.8236C29.0631 31.0136 29.1656 31.1863 29.3054 31.3415C29.4459 31.4939 29.5996 31.6309 29.7664 31.7525C29.9339 31.8713 30.0899 31.9735 30.2342 32.0591L31.0227 32.5327C31.2253 32.6527 31.4464 32.8016 31.686 32.9794C31.9284 33.158 32.1483 33.3701 32.3456 33.6156C32.5464 33.8592 32.6898 34.1395 32.7759 34.4566C32.862 34.7738 32.8505 35.1295 32.7413 35.5237C32.6155 35.9782 32.3829 36.3549 32.0437 36.6539C31.7072 36.9536 31.2823 37.1467 30.769 37.2334C30.2584 37.3208 29.6808 37.2724 29.0362 37.0881C28.4353 36.9163 27.9418 36.6703 27.5559 36.3502C27.1727 36.0308 26.9036 35.6614 26.7486 35.2418C26.5963 34.823 26.5674 34.379 26.662 33.9097L27.7109 34.2095C27.6503 34.5349 27.684 34.8282 27.8122 35.0894C27.9438 35.3487 28.139 35.5699 28.3977 35.7532C28.6599 35.9346 28.9577 36.0729 29.2909 36.1682C29.6788 36.2791 30.0445 36.3157 30.388 36.278C30.7323 36.2375 31.026 36.1295 31.2692 35.9538C31.5132 35.7753 31.6776 35.5328 31.7625 35.2261C31.8399 34.9469 31.8249 34.6974 31.7178 34.4776C31.6106 34.2579 31.4452 34.057 31.2215 33.8748C30.9978 33.6927 30.7498 33.5184 30.4775 33.3519L29.5269 32.761C28.9237 32.3846 28.4794 31.9666 28.194 31.5068C27.9086 31.047 27.8444 30.5337 28.0014 29.967C28.1318 29.4961 28.3725 29.1217 28.7235 28.8439C29.0781 28.5641 29.4981 28.3887 29.9835 28.3177C30.4724 28.2448 30.9845 28.2848 31.5198 28.4379C32.0607 28.5925 32.5145 28.8272 32.8813 29.1418C33.2489 29.4537 33.5094 29.8119 33.6627 30.2162C33.8188 30.6213 33.8449 31.0379 33.741 31.4662L32.7577 31.1851ZM41.6152 31.4484L42.6313 31.7389L41.0893 37.3078C40.9301 37.8828 40.6528 38.3574 40.2573 38.7319C39.8652 39.1044 39.3888 39.3508 38.8278 39.4711C38.2676 39.5886 37.6584 39.5533 37.0001 39.3651C36.3418 39.1769 35.8038 38.8842 35.3862 38.487C34.9693 38.0872 34.6878 37.624 34.5417 37.0977C34.3991 36.5694 34.4074 36.0178 34.5666 35.4428L36.1086 29.874L37.1247 30.1645L35.6054 35.6512C35.4917 36.0619 35.4807 36.4532 35.5722 36.8251C35.6646 37.1942 35.852 37.5181 36.1344 37.7969C36.4203 38.0736 36.7968 38.2788 37.2639 38.4123C37.731 38.5459 38.1575 38.5703 38.5436 38.4857C38.9303 38.3983 39.2564 38.2212 39.5219 37.9543C39.7909 37.6856 39.9822 37.3458 40.096 36.9351L41.6152 31.4484ZM42.3315 40.7299L44.6605 32.3191L47.4957 33.1297C48.154 33.3179 48.6591 33.5909 49.0111 33.9486C49.3665 34.3043 49.5896 34.7123 49.6803 35.1726C49.7709 35.6328 49.7477 36.1107 49.6105 36.6063C49.4732 37.1018 49.2475 37.5233 48.9331 37.8708C48.6215 38.2189 48.2234 38.4538 47.7388 38.5752C47.2549 38.6939 46.6866 38.66 46.0338 38.4733L44.0016 37.8923L44.2517 36.9888L46.2512 37.5604C46.7019 37.6893 47.0854 37.7147 47.4017 37.6368C47.7181 37.5588 47.9745 37.4046 48.171 37.1742C48.3709 36.9418 48.5175 36.6572 48.6108 36.3205C48.704 35.9837 48.7246 35.6646 48.6725 35.3631C48.6231 35.0623 48.4813 34.7973 48.2471 34.5678C48.0137 34.3356 47.6689 34.1543 47.2128 34.0239L45.4264 33.5131L43.3476 41.0204L42.3315 40.7299ZM49.6552 42.8238L51.9842 34.4131L54.8194 35.2237C55.4777 35.4119 55.9828 35.6849 56.3348 36.0425C56.6902 36.3983 56.9133 36.8063 57.004 37.2665C57.0947 37.7268 57.0714 38.2047 56.9342 38.7003C56.797 39.1958 56.5712 39.6173 56.2569 39.9647C55.9453 40.3129 55.5472 40.5477 55.0625 40.6692C54.5787 40.7879 54.0103 40.7539 53.3575 40.5673L51.3253 39.9862L51.5755 39.0827L53.5749 39.6544C54.0256 39.7833 54.4091 39.8087 54.7255 39.7307C55.0418 39.6528 55.2982 39.4986 55.4947 39.2681C55.6946 39.0358 55.8412 38.7512 55.9345 38.4144C56.0277 38.0777 56.0483 37.7585 55.9962 37.457C55.9468 37.1563 55.805 36.8912 55.5708 36.6618C55.3374 36.4296 54.9926 36.2483 54.5365 36.1178L52.7501 35.6071L50.6713 43.1144L49.6552 42.8238ZM65.2234 42.7367C64.9777 43.6238 64.6057 44.3447 64.1072 44.8994C63.6087 45.4542 63.0323 45.8272 62.3781 46.0183C61.7238 46.2094 61.0388 46.2027 60.3232 45.9981C59.6076 45.7935 59.0197 45.4363 58.5595 44.9265C58.0993 44.4167 57.7989 43.7931 57.6582 43.0556C57.5175 42.3181 57.57 41.5058 57.8157 40.6187C58.0613 39.7316 58.4333 39.0107 58.9318 38.4559C59.4303 37.9012 60.0067 37.5282 60.661 37.3371C61.3152 37.146 62.0002 37.1527 62.7158 37.3573C63.4315 37.5619 64.0194 37.9191 64.4795 38.4289C64.9397 38.9386 65.2401 39.5623 65.3808 40.2998C65.5215 41.0373 65.469 41.8496 65.2234 42.7367ZM64.24 42.4555C64.4417 41.7273 64.4903 41.0778 64.386 40.5073C64.2843 39.9376 64.0629 39.465 63.7218 39.0897C63.3833 38.7152 62.96 38.4554 62.452 38.3101C61.9439 38.1648 61.4481 38.1619 60.9643 38.3014C60.4834 38.4416 60.052 38.7274 59.6701 39.159C59.291 39.5913 59.0006 40.1716 58.799 40.8999C58.5973 41.6281 58.5473 42.2771 58.6489 42.8469C58.7533 43.4174 58.9747 43.89 59.3132 44.2645C59.6544 44.6398 60.079 44.9 60.587 45.0453C61.0951 45.1906 61.5896 45.1931 62.0706 45.0529C62.5543 44.9134 62.9857 44.6276 63.3648 44.1952C63.7466 43.7637 64.0384 43.1838 64.24 42.4555ZM65.7674 47.4306L68.0964 39.0198L70.9316 39.8304C71.5872 40.0179 72.0942 40.284 72.4527 40.6287C72.8119 40.9708 73.0387 41.3651 73.1332 41.8117C73.2277 42.2582 73.2063 42.7293 73.0691 43.2248C72.9319 43.7204 72.7091 44.1309 72.4009 44.4564C72.0926 44.782 71.6992 44.9945 71.2206 45.094C70.7428 45.1908 70.1789 45.1463 69.5288 44.9604L67.2344 44.3044L67.4891 43.3845L69.7508 44.0311C70.1987 44.1592 70.5775 44.1966 70.887 44.1433C71.1993 44.0907 71.4502 43.9616 71.6398 43.7558C71.833 43.548 71.9761 43.2758 72.0694 42.939C72.1626 42.6023 72.1813 42.29 72.1254 42.0022C72.0695 41.7143 71.9226 41.4626 71.6846 41.2468C71.4474 41.0283 71.1021 40.8542 70.6487 40.7246L68.8623 40.2138L66.7835 47.7211L65.7674 47.4306ZM70.7633 44.7816L71.7821 49.1503L70.6021 48.8129L69.6161 44.4536L70.7633 44.7816ZM74.7673 41.9022L75.0175 40.9987L81.3108 42.798L81.0606 43.7015L78.422 42.9471L76.3433 50.4544L75.3272 50.1639L77.4059 42.6566L74.7673 41.9022ZM31.2902 53.1735L28.7008 52.4332L31.0297 44.0224L33.7339 44.7955C34.5479 45.0283 35.1978 45.3958 35.6836 45.8981C36.1702 46.3977 36.481 47.0051 36.616 47.7203C36.7518 48.4328 36.6992 49.2244 36.4581 50.095C36.2155 50.9712 35.8509 51.6809 35.3644 52.2244C34.8787 52.765 34.2911 53.12 33.6016 53.2893C32.9129 53.4558 32.1424 53.4172 31.2902 53.1735ZM29.9671 51.8202L31.4749 52.2513C32.1686 52.4496 32.7808 52.4799 33.3112 52.342C33.8417 52.2041 34.2875 51.9194 34.6487 51.4879C35.0099 51.0564 35.2852 50.4984 35.4748 49.8139C35.6628 49.1349 35.714 48.5187 35.6285 47.9654C35.5437 47.4093 35.3178 46.937 34.9508 46.5484C34.5846 46.1571 34.0737 45.8677 33.4181 45.6803L31.7957 45.2164L29.9671 51.8202ZM40.3385 46.6839L38.0096 55.0947L36.9935 54.8042L39.3224 46.3934L40.3385 46.6839ZM41.6668 48.0387L41.917 47.1352L48.2103 48.9346L47.9601 49.8381L45.3215 49.0836L43.2427 56.5909L42.2266 56.3004L44.3054 48.7931L41.6668 48.0387ZM47.4495 57.7937L49.7785 49.3829L50.7946 49.6734L49.7575 53.4189L54.2316 54.6981L55.2687 50.9527L56.2848 51.2432L53.9559 59.654L52.9398 59.3635L53.9814 55.6016L49.5073 54.3224L48.4656 58.0842L47.4495 57.7937ZM55.9901 60.2356L58.319 51.8248L63.3832 53.2727L63.133 54.1762L59.085 53.0188L58.298 55.8608L62.0838 56.9432L61.8337 57.8467L58.0479 56.7643L57.2564 59.6226L61.37 60.7988L61.1198 61.7023L55.9901 60.2356ZM62.8857 62.2072L65.2146 53.7964L68.0499 54.607C68.7054 54.7944 69.2124 55.0605 69.5709 55.4053C69.9301 55.7474 70.157 56.1417 70.2515 56.5882C70.3459 57.0348 70.3246 57.5059 70.1873 58.0014C70.0501 58.497 69.8274 58.9075 69.5191 59.233C69.2109 59.5585 68.8174 59.7711 68.3389 59.8706C67.8611 59.9674 67.2971 59.9229 66.6471 59.737L64.3526 59.081L64.6074 58.1611L66.869 58.8077C67.317 58.9358 67.6957 58.9732 68.0052 58.9199C68.3175 58.8673 68.5685 58.7381 68.7581 58.5324C68.9512 58.3246 69.0944 58.0524 69.1876 57.7156C69.2809 57.3788 69.2996 57.0665 69.2437 56.7787C69.1878 56.4909 69.0408 56.2391 68.8029 56.0234C68.5656 55.8049 68.2203 55.6308 67.7669 55.5011L65.9805 54.9904L63.9018 62.4977L62.8857 62.2072ZM67.8816 59.5581L68.9003 63.9268L67.7204 63.5895L66.7343 59.2301L67.8816 59.5581ZM41.9919 62.7571L39.6629 71.1679L38.6468 70.8774L40.9758 62.4666L41.9919 62.7571ZM43.3201 64.1119L43.5703 63.2084L49.8636 65.0078L49.6134 65.9113L46.9748 65.1569L44.8961 72.6642L43.88 72.3736L45.9587 64.8664L43.3201 64.1119ZM52.579 65.7842L50.8231 71.806L49.8726 71.5342L51.4645 65.4655L52.579 65.7842ZM49.6746 74.1013C49.4725 74.0436 49.3192 73.9214 49.2146 73.7349C49.11 73.5484 49.0857 73.3539 49.1418 73.1513C49.1979 72.9487 49.3185 72.7955 49.5034 72.6918C49.6884 72.5881 49.8819 72.5651 50.084 72.6229C50.2862 72.6807 50.4395 72.8028 50.5441 72.9893C50.6487 73.1758 50.6729 73.3704 50.6168 73.573C50.5797 73.7071 50.5114 73.8206 50.4121 73.9133C50.3154 74.0068 50.2016 74.0718 50.0707 74.1082C49.9432 74.1427 49.8112 74.1404 49.6746 74.1013Z" fill="white"/>
        <defs>
        <filter id="filter0_d_297_3" x="6.54541" y="10.7838" width="86.9091" height="86.4324" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="2"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_297_3"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_297_3" result="shape"/>
        </filter>
        </defs>
        </svg>

      </a>
    </div>
    
    <div v-show="!imageUploaded" class="flex flex-col items-center mt-4">
      <p class="mt-8 text-2xl">An image dithering tool</p>
      <img class="mt-8" src="~/assets/earth-dither.gif" width="600" height="328" />
    </div>
    <div
      class="py-12 px-2 md:px-4 flex flex-col md:flex-row pt-8 w-full justify-center"
      :class="{ 'checkers shadow-inner': imageUploaded}"
    >
      <!-- Begin Main Toolbar -->
      <div
        v-show="imageUploaded"
        class="w-full md:w-1/3 lg:w-2/5 order-last md:order-first p-4 pt-0 rounded"
      >
        <div class="flex flex-col items-center w-full">
          <div class="shadow rounded py-2 px-4 mt-0 mb-2 bg-white w-full">
            
            <!-- Dither mode Selector -->
            <div class="flex flex-row items-center justify-between pb-2">
              <label for="ditherMode" class="font-bold text-sm"><h4 class="text-sm font-bold mt-2 mb-2 uppercase">Dither Mode</h4></label>
              <span
                class="rounded-full h-4 w-4 bg-red-700 text-white flex items-center justify-center float-right text-sm cursor-pointer"
                @click="showDitherModeModal = !showDitherModeModal"
              >
                <span v-if="!showDitherModeModal">
                  ?
                </span>
                <span v-else>
                  X
                </span>
              </span>
            </div>
            <div
              v-if="!showDitherModeModal"
              class="inline-block relative w-full"
            >
              <select
                id="ditherMode"
                v-model="ditherMode"
                class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
              >
                <template v-for="(v, i) in ditherModeOptions">
                  <option :id="v" :name="v" :value="v">{{ v }}</option>
                </template>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
              >
                <svg
                  class="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                  />
                </svg>
              </div>
            </div>
            <div v-else>
              <div class="mt-2 bg-red-100 p-2 rounded">
                These methods are different ways to spread around the quantization error introduced by reducing an images color palette. They look quite different, try them out!
              </div>
            </div>
            <!-- End Dither mode Selector -->            
          </div>          
          <ColorPicker
    
            :initial-palette="rgbQuantOptions.palette"
            @update-palette="onUpdatePalette"
          />
          <div class="shadow rounded p-3 bg-white w-full mt-2" v-if="selectedImage">
            <div class="flex flex-row items-center justify-between">
              
              <label for="imageSize" h4 class="text-sm  uppercase font-bold mt-2 mb-2">Image Size</label>
              <span
                class="rounded-full h-4 w-4 bg-red-700 text-white flex items-center justify-center float-right text-sm cursor-pointer"
                @click="showOptionsModalSize = !showOptionsModalSize"
              >
                <span v-if="!showOptionsModalSize">
                  ?
                </span>
                <span v-else>
                  X
                </span>
              </span>
            </div>
            <div v-if="canvasWidth > 5000" class="bg-red-100 p-2 mt-2 mb-4 rounded">
              Width must be less than 5000px
            </div>
            <div v-if="!showOptionsModalSize" class="w-full relative">
                <div class="flex flex-row space-x-4 w-full items-center">
                  <div class="w-1/2">
                    Width (px)
                    <span v-if="customWidth == false" @click="customWidth = !customWidth; focus();" class="block  bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 mt-1 rounded leading-tight focus:outline-none focus:shadow-outline">{{selectedImage.naturalWidth}}</span> 
                    <input 
                      v-else class="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 mt-1 rounded leading-tight focus:outline-none focus:shadow-outline"
                      @change="validateWidth()"
                      type="number"  
                      ref="customWidthField"
                      id="customWidthField" 
                      name="customWidthField" 
                      maxlength="4" 
                      max="5000"
                      v-model="canvasWidth" 
                    />                  
                  </div>
                  <div class="w-1/2">
                  Height (px)
                    <span class="block appearance-none bg-gray-200 border border-gray-300 text-gray-500 px-4 py-2 mt-1 rounded leading-tight focus:outline-none focus:shadow-outline">
                      <template v-if="canvasWidth == 'original'">
                        {{selectedImage.height}}
                      </template>
                      <template v-else>   
                        {{(selectedImage.naturalHeight / selectedImage.naturalWidth) * canvasWidth}}
                      </template>               
                    </span>
                  </div>
                </div>           
              <!-- <select
                id="imageSize"
                v-model="canvasWidth"
                class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
              >
                <option
                  id="originalSize"
                  name="originalSize"
                  :value="'original'"
                  >Original ({{selectedImage.naturalWidth}}px)</option
                >
                <template v-for="(v, i) in imageWidths">
                  <option :id="v" name="imageWidth" :value="v" @click="fathom('JN4RHD7N')">{{ v }}</option>
                </template>
                <option
                  @click="fathom('trackGoal', 'MHEE0ZOY', 0)"
                  id="customWidth"
                  name="customWidth"
                  :value="'custom'"
                  >Custom</option
                >                
              </select> -->
              <!-- <div 
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
              >
                <svg
                  class="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                  />
                </svg>
              </div> -->
            </div>
            <div v-else>
              <div class="mt-2 bg-red-100 p-2 rounded">
                This determines the size of the final file, and can also affect how the dither looks.
              </div>
            </div>  
            <!-- Custom Width Form -->


                
          </div>
          <div class="mt-4 text-center xl:w-64 shadow max-w-full">
            <button class="btn-red text-lg w-full " @click="ditherImage()" :disabled="isError">
              🏁 Dither
            </button>
          </div>

          <div class="shadow rounded py-2 px-4 my-4 bg-white w-full" v-show="ditherMode == 'Error Diffusion'">
            <h4 class="text-sm font-bold mt-2 mb-2 uppercase">Advanced Options</h4>
            <!-- Algorithm Selector -->
            <div class="flex flex-row items-center justify-between mt-4 pb-2">
              <label for="ditherAlgo" class="font-bold text-sm">Algorithm</label>
              <span
                class="rounded-full h-4 w-4 bg-red-700 text-white flex items-center justify-center float-right text-sm cursor-pointer"
                @click="showOptionsModalAlgo = !showOptionsModalAlgo"
              >
                <span v-if="!showOptionsModalAlgo">
                  ?
                </span>
                <span v-else>
                  X
                </span>
              </span>
            </div>
            <div
              v-if="!showOptionsModalAlgo"
              class="inline-block relative w-full"
            >
              <select
                id="ditherAlgo"
                v-model="rgbQuantOptions.dithKern"
                class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
              >
                <template v-for="(v, i) in algorithmOptions">
                  <option :id="v" :name="v" :value="v">{{ v }}</option>
                </template>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
              >
                <svg
                  class="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                  />
                </svg>
              </div>
            </div>
            <div v-else>
              <div class="mt-2 bg-red-100 p-2 rounded">
                These are different ways of spreading the quantization errors
                around. Certain ones might work better than others depending on
                the image.
              </div>
            </div>
            <!-- End Algorithm Selector -->
            <!-- Serpentine Dither -->
            <div class="flex flex-col items-center justify-between mt-4">
              <div class="inline-block relative w-full">
                <input
                  id="ditherSerp"
                  v-model="rgbQuantOptions.dithSerp"
                  type="checkbox"
                  class="form-checkbox"
                />
                <label for="ditherSerp" class="ml-2 text-sm"><strong>Serpentine Dither</strong></label>
                <span
                  class="rounded-full h-4 w-4 bg-red-700 text-white flex items-center justify-center float-right text-sm cursor-pointer"
                  @click="showOptionsModalSerp = !showOptionsModalSerp"
                >
                  <span v-if="!showOptionsModalSerp">
                    ?
                  </span>
                  <span v-else>
                    X
                  </span>
                </span>
              </div>
              <div
                v-if="showOptionsModalSerp"
                class="inline-block relative w-full"
              >
                <div class="mt-2 bg-red-100 p-2 rounded">
                  <!-- This could be clarified. -->
                  This determines if the dithering just goes left to right, top
                  to bottom, or does a snake wiggle.
                </div>
              </div>
            </div>

            <!-- End Serpentine Dither -->
          </div>
          
        </div>
        <!-- This is the same as the other report block, this one is for mobile positioning -->
        <div v-show="imageUploaded"
          class="md:hidden"
        >
          <div
            v-if="showDitheredImage && !dithering"
            class="shadow rounded xl:m-0 p-4 mb-4 w-full xl:w-1/4 bg-white "
          >       
            <FilesizeResults 
              :ratio-good="ratioGood"
              :download-file-size="downloadFileSize"
              :selected-image="selectedImage"
              :dithered-height="ditheredHeight"
              :dithered-width="ditheredWidth"
              :download-filesize="downloadFileSize.toFixed(2)"
              :rgbquant="rgbQuantOptions"
            />
          </div>
          <!-- <div class="shadow rounded xl:m-0 p-4 w-full xl:w-1/4 bg-white">
            <Donate />
          </div> -->
        </div>
      </div>
      <!-- End Toolbar -->
      <div
        class="w-full md:w-2/3 lg:w-4/5 flex flex-col xl:flex-row order-first md:order-last items-stretch"
      >

        <!-- Begin Main Display -->
        <div class="md:px-4 flex flex-col flex-1 items-center w-full">
          <!-- Begin Top Toolbar -->
          <div class="flex flex-row justify-between space-x-2 w-full items-center py-2 px-2 mb-4 shadow rounded bg-white" v-if="showDitheredImage && !dithering"> 
            <Toggler class="flex-grow"
            @view-original="viewOriginal = !viewOriginal"
            >View Original</Toggler>  
            <ImageUpload @number-images="getNumberOfImages" @image-upload="onImageUpload" text="✨ New"/>          
            <a
              class="btn-red-outline inline-block self-center"
              target="_blank"
              :href="downloadUrl"
              :download="'dither_it_' + selectedFile.name"
              @click="downloadImage"
              
              
              >💾 Save</a
            >  
          </div>   
          <!-- End Top Toolbar -->
          <!-- Dithered Canvas Display -->
          <div id="dithered-canvas-display" class="max-w-full w-full"  :class="{ 'pt-8': showDitheredImage == true }" v-show="showDitheredImage">


            <div
              v-show="dithering"
              class="flex flex-col justify-center items-center"
            >
              <div class="loader h-20 w-20 mb-4"></div>
              <div class="">Dithering...</div>
            </div>
            <div
              class="flex flex-col justify-center items-center w-full h-full "
              v-show="!dithering && showDitheredImage && !viewOriginal"
            >
              <div
              class="max-w-full "
                v-for="n in this.numberOfImages"
                v-show="selectedImage.id == 'originalImage' + n"
              >
                <canvas :id="'dithered_originalImage' + n" class="max-w-full selectedImage"></canvas>
              </div>
            </div>
          </div>
          <!-- End Dithered Canvas Display -->
          <!-- Original Image Display -->
          
          <div class="w-full flex flex-col ">
          
            <div v-if="numberOfImages > 0">
              <img class="mx-auto max-w-full" :src="selectedImage.src" v-if="!showDitheredImage || viewOriginal"/>
            </div>
            <div class="flex flex-row flex-wrap mt-4 justify-center">
              <div v-for="n in this.numberOfImages" v-show="numberOfImages > 1">
              
                <img
                  :id="'originalImage' + n"
                  class="max-w-full m-4 shadow cursor-pointer"
                  @click="analyzeImagePalette($event.target)"
                  width="75"
                />
              </div>            
            </div>
          </div>
          <!-- End Original Image Display -->
          <!-- Toolbar Stuff -->
          <div
            class="flex flex-row justify-center"
            :class="{ 'w-full': imageUploaded, 'text-sm': imageUploaded }"
          >
            <div
              v-show="showDitheredImage && !dithering"
              class="text-center mt-4 mr-2 justify-center "
            >

            </div>
            <ImageUpload @number-images="getNumberOfImages" @image-upload="onImageUpload" text="✨ Select images" duck="true" v-if="!imageUploaded" />
            
          </div>
          <!-- End Toolbar Stuff -->
        </div>
        <!-- End Main Display -->
        <!-- Begin right sidebar -->
        <div class="w-full xl:w-1/4 hidden md:flex flex-row xl:flex-col gap-4 px-4 xl:m-0 justify-center xl:justify-start" 
        v-show="imageUploaded">
          <div
            v-if="showDitheredImage && !dithering"
            class="shadow rounded bg-white self-start w-1/2 xl:w-full"
          >       
            <FilesizeResults 
              :ratio-good="ratioGood"
              :download-file-size="downloadFileSize"
              :selected-image="selectedImage"
              :dithered-height="ditheredHeight"
              :dithered-width="ditheredWidth"
              :download-filesize="downloadFileSize.toFixed(2)"
              :rgbquant="rgbQuantOptions"
            />
            
          </div>
          <!-- <div 
            
            class="shadow rounded xl:m-0 bg-white w-full md:w-1/2 xl:w-full self-start"
          >
            <Donate />
          </div> -->
        </div>
      </div>
    </div>
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
import RgbQuant from 'rgbquant'
import Logo from '~/components/Logo.vue'
import ImageUpload from '~/components/ImageUpload.vue'
import ColorPicker from '~/components/ColorPicker.vue'
import InputBlock from '~/components/InputBlock.vue'
import BottomContent from '~/components/BottomContent.vue'
import Toggler from '~/components/Toggler.vue'
import FilesizeResults from '~/components/FilesizeResults.vue'
import Donate from '~/components/Donate.vue'


export default {
  components: {
    ImageUpload,
    ColorPicker,
    Logo,
    InputBlock,
    BottomContent,
    Toggler,
    FilesizeResults,
    Donate
  },
  data() {
    return {
      canvasWidth: 'original', // this is what the dithered canvas renders off of, height comes from a computed property
      fileName: '', // the name of the loaded file
      loading: false, // for the loading spinner
      dithering: false, // for the dithering spinner
      switchingImages: false,
      specsCalculated: false, // for the specs
      imageUploaded: false,
      showDitheredImage: false, // control if the dithered image is visible
      imageWidths: [320, 640, 1080, 1280],
      ditherMode: 'Error Diffusion',
      ditherModeOptions: [
        'Error Diffusion',
        'Bayer (Ordered)'
      ],
      algorithmOptions: [
        'FloydSteinberg',
        'Atkinson',
        'Sierra24A',
        'Fan',
        'ShiauFan',
        'ShiauFan2',
        'JarvisJudiceNinke',
        'Stucki',
        'Burkes',
        'Sierra3',
        'Sierra2'
      ],
      rgbQuantOptions: {
        // ---- Options ------
        colors: 8, // desired palette size
        method: 2, // histogram method, 2: min-population threshold within subregions; 1: global top-population
        boxSize: [8, 8], // subregion dims (if method = 2)
        boxPxls: 2, // min-population threshold (if method = 2)
        initColors: 4096, // # of top-occurring colors to start with (if method = 1)
        minHueCols: 2000, // # of colors per hue group to evaluate regardless of counts, to retain low-count hues
        dithKern: 'FloydSteinberg', // dithering kernel name, see available kernels in docs below
        dithDelta: 0, // dithering threshhold (0-1) e.g: 0.05 will not dither colors with <= 5% difference
        dithSerp: false, // enable serpentine pattern dithering
        palette: [], // a predefined palette to start with in r,g,b tuple format: [[r,g,b],[r,g,b]...]
        reIndex: false, // affects predefined palettes only. if true, allows compacting of sparsed palette once target palette size is reached. also enables palette sorting.
        useCache: true, // enables caching for perf usually, but can reduce perf in some cases, like pre-def palettes
        cacheFreq: 10, // min color occurance count needed to qualify for caching
        colorDist: 'euclidean' // method used to determine color distance, can also be "manhattan"
      },
      showOptionsModalSize: false,
      showOptionsModalAlgo: false,
      showOptionsModalSerp: false,
      showDitherModeModal: false,
      downloadUrl: '', // the url src thing to download the image
      downloadFileSize: '50', // the filesize of the download
      originalFileSize: '', // filesize of the original
      imageType: '',
      numberOfImages: '',
      images: [],
      selectedImage: '',
      ditheredWidth: '',
      ditheredHeight: '',
      viewOriginal: false,
      selectingImage: false,
      customWidth: false,
      isError: false,
      baseColors: [ // this is from old bayer stuff and can prob be deleted
        {
          "hex": "#FFFFFF",
          "name": "White",
        },
        {
          "hex": "#000000",
          "name": "Black",
        },
        {
          "hex": "#808080",
          "name": "Grey",
        },
        
        {
          "hex": "#ff0000",
          "name": "Red",
        },
        {
          "hex": "#ffa500",
          "name": "Orange",
        },
        {
          "hex": "#ffff00",
          "name": "Yellow",
        },
        {
          "hex": "#008000",
          "name": "Green",
        },
        {
          "hex": "#0000ff",
          "name": "Blue",
        },
        {
          "hex": "#4b0082",
          "name": "Indigo",
        },
        {
          "hex": "#ee82ee",
          "name": "Violet",
        },
      ]      
    }
  },
  computed: {
    ratioGood() {
      if (this.downloadFileSize / (Math.round(((this.selectedImage.src.length) * 3) / 4) / 1000) < 1) {
        return true
      } else {
        return false
      }
    },
    selectedFile() {
      return this.images.find(this.getSelected)
    },
    computedHeight() {
      console.log(this.selectedImage);
      console.log(this.selectedImage.width);
      console.log(this.selectedImage.height);
      console.log(this.canvasWidth)
      if(this.canvasWidth === 'original') {
        console.log('hello')
        return this.selectedImage.naturalHeight
      } else {
        console.log('goodbye')
        return (this.selectedImage.naturalHeight / this.selectedImage.naturalWidth) * this.canvasWidth
      }
      
    }
  },
  methods: {
    // ---------------------------
    // Set the image id to the id of the currently selected image
    // ----------------------------    
    getSelected(image) {
      console.log('Get selected image.')
      return image.id === this.selectedImage.id;
    },
    // ---------------------------
    // Get the number of images
    // ----------------------------        
    getNumberOfImages(number) {
      console.log('Get the number of images.')
      this.numberOfImages = number
    },
    // ---------------------------
    // Create the downloadable image
    // And get the new file specs
    // ----------------------------            
    downloadImage() {
      console.log('Function downloadImage called')

      this.ditheredWidth = document.getElementById('dithered_' + this.selectedImage.id).width
      this.ditheredHeight = document.getElementById('dithered_' + this.selectedImage.id).height

      const ditheredImageCanvas = document.getElementById('dithered_' + this.selectedImage.id) // the canvas that holds the dithered image
      const downloadUrl = ditheredImageCanvas.toDataURL(this.imageType, 0.72)
      this.downloadFileSize = Math.round((downloadUrl.length * 3) / 4) / 1000
      this.downloadUrl = downloadUrl

      fathom('trackGoal', 'UAT4LRNZ', 0)
    },
    // ---------------------------
    // This receives a palette from ColorPicker in the form of an array of hex values
    // ----------------------------        
    onUpdatePalette(palette) {
      console.log('Color palette updating:')
      console.log(palette.length)
      this.rgbQuantOptions.colors = palette.length
      this.rgbQuantOptions.palette = []
      palette.forEach((v, i) => {
        this.rgbQuantOptions.palette.push(v)
      })
    },
    // ---------------------------
    // When images get uploaded
    // ----------------------------       
    onImageUpload(images) {
      console.log('Process the uploaded images.')
      this.images = images // load the image array into data

      fathom('trackGoal', 'HORTCOPW', 0)

      this.selectedImage = document.getElementById('originalImage1') // set the selected image

      // Dithered image should not be showing yet
      this.showDitheredImage = false

      // Clear the paletter (it might be set from old uploads)
      this.rgbQuantOptions.palette = []

      // Set imageUploaded to true
      this.imageUploaded = true

      // Tell the palette selector to be set to original
      this.$children[1]._data.presetPaletteSelection = 'original'

      // Wait a second before analyzing the image palette (presumably to let the image load?)
      setTimeout(() => {
        this.analyzeImagePalette(document.getElementById('originalImage1'))
      }, 100)
    },
    // ---------------------------
    // Dither the images
    // ----------------------------
    ditherImage() {
      console.log('Dither the images')
      fathom('trackGoal', 'SFMGAORY', 0)

      // When dithering starts, go back to the top
      window.scrollTo(0, 0) 
      
      // Dithering has started
      this.dithering = true 

      // Hide the original images
      this.viewOriginal = false

      // Show the dithered image
      this.showDitheredImage = true

      // Dont show stats while dithering is happening
      this.selectingImage = true

      setTimeout(() => {

        // Go through each of the images and...
        for (let i = 1; i < this.numberOfImages + 1; i++) {
          // Get the original image
          const originalImage = document.getElementById('originalImage' + i)
          // Get the canvas where the dithered image will go
          const ditheredImageCanvas = document.getElementById('dithered_originalImage' + i)
          // Get the canvas context
          const ctx = ditheredImageCanvas.getContext('2d')
          // Set an arbitrary initial width
          var width = 1
          // If the canvas width param is set to 'Original'
          if (this.canvasWidth === 'original') {
            // Set the canvas width to the original image width
            // eslint-disable-next-line no-const-assign
            width = originalImage.naturalWidth
          } else if (this.canvasWidth === 'custom') { 
            width = this.customWidth
          } else {
            // Otherwise, set it to whatever is selected
            // eslint-disable-next-line no-const-assign
            width = this.canvasWidth
          }
          // Set the height based on the original ratio and the determined width
          const height = (originalImage.naturalHeight / originalImage.naturalWidth) * width
          // Tell the canvas which width and height to be
          ctx.canvas.width = width
          ctx.canvas.height = height
          // Put the image on the canvas
          ctx.drawImage(originalImage, 0, 0, width, height)

          if(this.ditherMode != 'Error Diffusion') {

            this.bayerDither(ctx, ctx.getImageData(0, 0, width, height))
            fathom('trackGoal', 'Q3QWCGJU', 0)
            this.downloadImage()
          } else {
            // Create new RgbQuant instance
            const q = new RgbQuant(this.rgbQuantOptions)
            // Analyze histograms to get colors
            q.sample(originalImage) 
            // Dither what is on the canvas
            const ditherResult = q.reduce(ditheredImageCanvas) 
            //console.log(ditherResult) // this is a Uint8Array of all of the pixels as RGB values where every 3 values is an RGB value like 255,0,0 etc.
            // Get the newly dithered image data
            const imgData = ctx.getImageData(0, 0, width, height)
            // Set the value of imageData to the dithered image data
            imgData.data.set(ditherResult) 
            // Put the new image data on the canvas
            ctx.putImageData(imgData, 0, 0)
            // Set the data for the image download
            this.downloadImage()
          }

        }
        // Turn off dithering indicator
        this.dithering = false
        // Show stats
        this.selectingImage = false
      }, 100)
      // Set the data for the image download (again?)
      this.downloadImage()
    },

    bayerDither(ctx, imageData) {

      var bayerThresholdMap = [
        [  15, 135,  45, 165 ],
        [ 195,  75, 225, 105 ],
        [  60, 180,  30, 150 ],
        [ 240, 120, 210,  90 ]
      ];


      var imageDataLength = imageData.data.length;

      var w = imageData.width;


      const oldPalette = this.rgbQuantOptions.palette.slice()
      var newPalette = [];

      oldPalette.forEach((color, id) => {

          var newColor = [id].concat(color)
          
          newPalette.push(newColor)
        }
      )

      // Go through the RGBA data, at every 4th value, each of which corresponds to a pixel
      for (var currentPixel = 0; currentPixel <= imageDataLength - 4; currentPixel+=4) {
        
        // console.log(currentPixel + ': ' + this.nearestColor({ r: imageData.data[currentPixel], g: imageData.data[currentPixel + 1], b: imageData.data[currentPixel + 2] }).name)

        // This tells what the curent x coordinate is
        var x = currentPixel/4 % w;
        // This tells what the current y coordinate is
        var y = Math.floor(currentPixel/4 / w);
        // This finds the right Bayer matrix value based on the x/y coordinate of the current pixel
        // why is it divided by 2??
        
        // here we assign the RGBA data to the image
        // For each pixel there are three values we care about R, G, B
        // For each of those three values:
        // Add the original (imageData.data[currentPixel])
        // To the threshold map value (bayerThresholdMap[x%4][y%4])
        // Divide it by 2 to get the new R, G or B value
        // If that value is deemed to be "light", meaning it is less than 129, make it 0
        // If it is "dark", make it 255
        // Doing this, you will end up with RGB triple like 0 255 255
        // There are 8 of these possible colors
        // R | G | B |  Color
        //------------------
        // 0   0   0    Black
        // 0   0   255  Blue
        // 0   255 0    Green
        // 255 0   0    Red
        // 0   255 255  Cyan
        // 255 0   255  Magenta
        // 255 255 0    Yellow
        // 255 255 255  White
        //-------------------
        // Then you replace the old values in the imagedata array with the new values
        // This replaces all of the colors in this image with one of these eight colors
        // 
    
        // Update 08/01/22
        // Now this uses the "getClosestColor" function and the preset ditherit palette to do cusotm color bayer dithers.


        var map = Math.floor( (imageData.data[currentPixel] + bayerThresholdMap[x%4][y%4]) / 2 );
        // imageData.data[currentPixel] = (map < 129) ? 0 : 255;  
        
        var map2 = Math.floor( (imageData.data[currentPixel + 1] + bayerThresholdMap[x%4][y%4]) / 2 );    
        // imageData.data[currentPixel + 1] = (map2 < 129) ? 0 : 255;  
        
        var map3 = Math.floor( (imageData.data[currentPixel + 2] + bayerThresholdMap[x%4][y%4]) / 2 );
        // imageData.data[currentPixel + 2] = (map3 < 129) ? 0 : 255;  
        
 

        const closest_color = this.getClosestColor(newPalette, [map, map2, map3]);
       
        imageData.data[currentPixel] = closest_color[1]
        imageData.data[currentPixel + 1] = closest_color[2]
        imageData.data[currentPixel + 2] = closest_color[3]
      


      }
    
      // Put the new image data on the canvas
      ctx.putImageData(imageData, 0, 0)

    },
    // https://stackoverflow.com/a/69880443/2201446
    getClosestColor(colors, [r2, g2, b2]) {
      const [[closest_color_id]] = (
        colors
        .map(([id,r1,g1,b1]) => (
          [id, Math.sqrt((r2-r1)**2 + (g2-g1)**2 + (b2-b1)**2)]
        ))
        .sort(([, d1], [, d2]) => d1 - d2)
      );
      return colors.find(([id]) => id == closest_color_id);
    },
    // ---------------------------
    // Analyze the image palette
    // ----------------------------    
    analyzeImagePalette(e) {
      console.log('Analyze the image palette.')
      console.log('New image selected.')
       this.selectingImage = true
       setTimeout(() => {
        this.selectedImage = e
      
        

        this.rgbQuantOptions.palette = []

        // create new RgbQuant instance
        const q = new RgbQuant(this.rgbQuantOptions)
        // analyze histograms
        q.sample(e)

        this.rgbQuantOptions.palette = q.palette(true)

        this.specsCalculated = true

        if(this.showDitheredImage) {
          this.ditheredWidth = document.getElementById('dithered_' + this.selectedImage.id).width
          this.ditheredHeight = document.getElementById('dithered_' + this.selectedImage.id).height

          const ditheredImageCanvas = document.getElementById('dithered_' + this.selectedImage.id) // the canvas that holds the dithered image
          const downloadUrl = ditheredImageCanvas.toDataURL(this.imageType, 0.72)
          this.downloadFileSize = Math.round((downloadUrl.length * 3) / 4) / 1000
          this.downloadUrl = downloadUrl        
        }

        this.$children[1]._data.presetPaletteSelection = 'original'
        console.log('New image selected.')
        this.selectingImage = false
      }, 50)
      
    },
    // fathom(id) {
    //   fathom('trackGoal', id, 0)
    // },
    focus() {
      
      this.canvasWidth = this.selectedImage.naturalWidth
      this.$nextTick(() => this.$refs.customWidthField.focus())
    },
    validateWidth() {
      fathom('trackGoal', 'MHEE0ZOY', 0)
      if(this.canvasWidth > 5000) {
        this.isError = true
      } else {
        this.isError = false
      }
    },
    // FROM https://gist.github.com/Ademking/560d541e87043bfff0eb8470d3ef4894
    // from https://stackoverflow.com/a/5624139
    hexToRgb(hex) {
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });

      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    },


    // return nearest color from array
    // nearestColor(colorRGB){
    //   var lowest = Number.POSITIVE_INFINITY;
    //   var tmp;
    //   let index = 0;
    //   this.baseColors.forEach( (el, i) => {
    //     // console.log(colorRGB)
    //       tmp = this.distance(colorRGB, this.hexToRgb(el.hex))
    //       if (tmp < lowest) {
    //         lowest = tmp;
    //         index = i;
    //       };
          
    //   })
    //   // This is the palette as it is set in Dither it!
    //   // console.log(this.rgbQuantOptions.palette)
    //   // This is the default color list provided by the Gist answer being cribbed from 
    //   // console.log(this.baseColors)
    //   // This needs to be changed to search from the dither it palette
    //   return this.baseColors[index];
      
    // }
  }
}
</script>

<style >
  .checkers {
    background-color: #fcfffb;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cpattern id='p' width='100' height='100' patternUnits='userSpaceOnUse' patternTransform='scale(0.36)'%3E%3Cpath data-color='outline' fill='none' stroke='%239D9D9D' stroke-width='0.25' d='M50 0v100M100 50H0'%3E%3C/path%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23p)' width='100%25' height='100%25'%3E%3C/rect%3E%3C/svg%3E");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>
