<template>
  <div class="w-full">
    <div class="shadow rounded p-3 bg-white">
      <h4 class="text-sm font-bold mt-2 mb-2 uppercase">Palette</h4>

      <!-- Palette menu -->
      <div v-if="!showModal">
        <div class="flex flex-wrap" v-if="palette.length > 0">
          <template v-for="(item, i) in palette">
            <div
              class="w-10 h-10 m-1 border border-gray-700 rounded-full cursor-pointer swatch"
              v-bind:style="{ backgroundColor: item['hex'] }"
              @click="makeActiveSwatch(i)"
            ></div>
          </template>
          <div
            class="w-10 h-10 m-1  cursor-pointer rounded-full flex items-center justify-center font-bold text-4xl text-red-700 hover:text-red-800"
            @click="addNewSwatch()"
          >
            +
          </div>
        </div>
        <div v-else class="block w-full">
          <span class="loader h-8 w-8 float-left mr-2"></span>Analyzing
          palette..
        </div>
        <!-- Preset Palette Selector -->
        <div class="mt-4">
          <label for="presetPalettes" class="mt-4">Preset Palettes</label>
          <div class="inline-block relative w-full">
            <select
              id="presetPalettes"
              v-model="presetPaletteSelection"
              @change="presetPaletteSelected"
              class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-2 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
            >
              <option id="original" name="paletteColor" value="original"
                >Original</option
              >
              <option id="custom" name="paletteColor" value="custom" disabled
                >Custom</option
              >
              <template v-for="(p, i) in presetPalettes">
                <option :id="p.value" name="paletteColor" :value="p.value">{{
                  p.name
                }}</option>
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
        </div>
        <div class="mt-4">
          <div class="block flex flex-row items-center justify-between">
            <div>
              <span class="text-xs inline-block p-1 cursor-pointer" @click="viewExportPalette = !viewExportPalette; viewImportPalette = false; showOptionsPaletteImportExport = false;" :class=" viewExportPalette ? 'border-b-2 border-red-600': '' ">Export</span>
              <span class="text-xs inline-block p-1 cursor-pointer" @click="viewImportPalette = !viewImportPalette; viewExportPalette = false; showOptionsPaletteImportExport = false;" :class=" viewImportPalette ? 'border-b-2 border-red-600': ''" id="importPalette">Import</span>
            </div>
            <span
              class="rounded-full h-4 w-4 bg-red-700 text-white flex items-center justify-center float-right text-sm cursor-pointer"
              @click="showOptionsPaletteImportExport = !showOptionsPaletteImportExport"
            >
              <span v-if="!showOptionsPaletteImportExport">
                ?
              </span>
              <span v-else>
                X
              </span>
            </span>            
          </div>
          <div v-if="!showOptionsPaletteImportExport">
            <div class="border border-dashed border-gray-400 p-2 rounded" v-if="viewExportPalette || viewImportPalette">
              <div v-show="viewExportPalette">
                <textarea readonly v-model="palette2Export" rows="5" class="w-full border border-grey-400 p-2 text-xs"></textarea>
                <div class="pt-2">
                  <a id="exportPalette" class="btn-red-small-outline text-xs" download="ditherit_palette.txt" :href="'data:text/txt;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.palette))">Export</a>
                </div>
              </div>
              <div v-if="viewImportPalette">
                <textarea v-model="palette2Import" placeholder="Enter a palette here" rows="5" class="w-full border border-gray-400 p-2 text-xs">{{palette2Import}}</textarea>
                <div class="pt-2">
                  <span class="btn-red-small-outline" @click="importPalette">Import</span>
                </div>  
              </div>
            </div>
          </div>
          <div v-else>
              <div class="mt-2 bg-red-100 p-2 rounded">
                Export palettes by copying the text or downloading a text file, import them by pasting and clicking import.
              </div>            
          </div>
        </div>
      </div>
      <!-- Colorpicker Modal -->
      <div v-else>
        <div class="color-modal">
          <sketch-picker
            :value="palette[activeSwatch]"
            @input="storeCurrentColor"
          />
        </div>
        <div class="mt-2">
          <hr />
          <div class="inline-block w-full mt-2  flex justify-between sm:flex-row md:flex-col-reverse lg:flex-row gap-4">
            <button class="btn-grey" @click="showModal = !showModal">
              Cancel
            </button>
            <button
              class="btn-red"
              @click="removeSwatch(activeSwatch)"
            >
              Remove
            </button>            
            <button class="btn-green" @click="selectColor">
              Select
            </button>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Sketch } from 'vue-color'

export default {
  components: {
    'sketch-picker': Sketch
  },
  props: ['initialPalette'],
  data() {
    return {
      // numberOfColors: 4,

      currentColor: '', // for temporary holding swatch value from color-picker
      showModal: false,
      activeSwatch: 0,
      palette: [], // the colors as they are created by the color pickers
      convertedColorArray: [], // the colors as they are sent to the ditherer ([0,0,0])
      originalInitialPalette: [], //this holds the first initial palette loaded
      presetPaletteSelection: 'original',
      viewImportPalette: false,
      viewExportPalette: false,
      palette2Import: '',
      showOptionsPaletteImportExport: false,
      presetPalettes: [
        {
          name: 'Red',
          value: 'red',
          colors: [
            { hex: '#ffffff' },
            { hex: '#f46842' },
            { hex: '#aa2f0d' },
            { hex: '#000000' }
          ]
        },
        {
          name: 'Red Monochrome',
          value: 'redmono',
          colors: [{ hex: '#ffe3db' }, { hex: '#4f1403' }]
        },
        {
          name: 'Green Monochrome',
          value: 'greenmono',
          colors: [{ hex: '#eeffdb' }, { hex: '#1d3801' }]
        },
        {
          name: 'Green',
          value: 'green',
          colors: [
            { hex: '#ffffff' },
            { hex: '#c4f441' },
            { hex: '#6da90c' },
            { hex: '#000000' }
          ]
        },
        {
          name: 'Blue Monochrome',
          value: 'bluemono',
          colors: [{ hex: '#dbf9ff' }, { hex: '#02474f' }]
        },
        {
          name: 'Blue',
          value: 'blue',
          colors: [
            { hex: '#ffffff' },
            { hex: '#41e2f4' },
            { hex: '#0c9fa9' },
            { hex: '#000000' }
          ]
        },
        {
          name: 'Yellow Monochrome',
          value: 'yellowmono',
          colors: [{ hex: '#fffedb' }, { hex: '#303001' }]
        },
        {
          name: 'Yellow',
          value: 'yellow',
          colors: [
            { hex: '#ffffff' },
            { hex: '#f4eb41' },
            { hex: '#a9a40c' },
            { hex: '#000000' }
          ]
        },
        {
          name: 'Purple & Green',
          value: 'purplegreen',
          colors: [{ hex: '#76C066' }, { hex: '#AD2BBB' }]
        },
        {
          name: 'Yellow & Red',
          value: 'yellowred',
          colors: [{ hex: '#FFEE2C' }, { hex: '#E20023' }]
        },
        {
          name: 'Blue & Yellow',
          value: 'blueyellow',
          colors: [{ hex: '#134E87' }, { hex: '#FFF585' }]
        },        
        {
          name: 'Black & White',
          value: 'blackwhite',
          colors: [{ hex: '#ffffff' }, { hex: '#000000' }]
        },
        {
          name: 'RGBY',
          value: 'rgby',
          colors: [
            { hex: '#FF0000' },
            { hex: '#00FF00' },
            { hex: '#0000FF' },
            { hex: '#FFFF00' }
          ]
        },
        {
          name: 'CMYK',
          value: 'cmyk',
          colors: [
            { hex: '#000000' },
            { hex: '#ffff00' },
            { hex: '#00FFFF' },
            { hex: '#FF00FF' },
            { hex: '#FFFFFF' }
          ]
        },        
        {
          name: 'Game Boy DMG-01',
          value: 'gameboy',
          colors: [
            { hex: '#CADC9F' },
            { hex: '#0F380F' },
            { hex: '#306230' },
            { hex: '#8BAC0F' },
            { hex: '#9BBC0F' }
          ]
        }        
      ]
    }
  },
  computed: {
    palette2Export() {
      return JSON.stringify(this.palette)
    } 
  },
  watch: {
    initialPalette: function(newVal, oldVal) {
      // watch it
      // console.log('Prop changed: ', newVal, ' | was: ', oldVal)

      this.rgbToHex(newVal)
    }
  },
  methods: {
    // When a custom palette is selected
    presetPaletteSelected(e) {
      this.palette = []

      if (e.target.value == 'original') {
        this.originalInitialPalette.forEach((v) => {
          this.palette.push(v)
        })
      } else {
        this.presetPalettes.forEach((v) => {
          if (e.target.value == v.value) {
            v.colors.forEach((c) => {
              this.palette.push(c)
            })
          }
        })
      }

      this.updatePallete()
    },
    // When the user selects the color from the modal
    selectColor() {
      this.palette[this.activeSwatch] = { hex: this.currentColor['hex'] }
      this.updatePallete()
      this.showModal = false
    },
    // This holds the selected color until user hits Select in the color modal
    storeCurrentColor(color) {
      this.currentColor = color
    },
    // Determine if a swatch is the active one, this controls which classes display on that swatch when selected
    isActiveSwatch(i) {
      if (this.activeSwatch === i) {
        return true
      } else {
        return false
      }
    },
    // Make Active Swatch
    // When a swatch is clicked on, make it active and open the color picker
    makeActiveSwatch(i) {
      this.activeSwatch = i //tells the picker which swatch is being updated
      this.showModal = true

      this.presetPaletteSelection = 'custom'
    },
    // Add New Swatch
    // This adds a new color to the colors
    addNewSwatch() {
      this.palette.push({ hex: '#ffffff' })
      this.activeSwatch = this.palette.length
      this.presetPaletteSelection = 'custom'
      this.updatePallete()
    },
    // Remove a swatch and update the palette
    removeSwatch(i) {
      console.log(i)
      this.palette.splice(i, 1)
      this.updatePallete()
      this.showModal = false
    },
    // Update Colors
    // This updates the colors that are used by the actual ditherer
    // Requires an array of hex colors in the format [{hex: '#ff000'},{hex: '#ff0ff'}]
    updatePallete() {
      // update the colors, requires an array of
      var colorTuplesArray = []
      this.palette.forEach((v) => {
        colorTuplesArray.push(this.hexToRgb(v['hex']))
      })
      this.$emit('update-palette', colorTuplesArray)
    },
    //Convert Hex to RGB
    // Given a hex value, return the RGB tuple
    hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
          ]
        : null
    },
    // Convert RGB To Hex
    // this converts an array of tupes into hex values
    rgbToHex() {
      this.palette = []
      var pal = this.initialPalette
      for (let i = 0; i < pal.length; i++) {
        var r = pal[i][0]
        var g = pal[i][1]
        var b = pal[i][2]
        var hex =
          '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
        this.palette.push({ hex })

        if (this.originalInitialPalette.length < i) {
          //if there are less values in originalInitialPalette than colors processed, it means we need to store it
          this.originalInitialPalette.push({ hex })
        }
      }
    },
    exportPalette() {
      var palJSON = "data:text/txt;charset=utf-8," + encodeURIComponent(JSON.stringify(this.palette));
  
      var exportPalette = document.getElementById('exportPalette');
          exportPalette.setAttribute("href", palJSON);
          exportPalette.setAttribute("download", "ditherit_palette.txt");

          

    },
    importPalette() {
      this.palette = JSON.parse(this.palette2Import)
      this.updatePallete();
      this.presetPaletteSelection = 'custom'
      fathom('trackGoal', 'QQLOUIS1', 0);
    }
  }
}
</script>

<style>
.vc-sketch {
  width: auto !important;
  box-shadow: none !important;
}

.vc-sketch-alpha-wrap {
  display: none;
}

.vc-sketch-field--single:last-of-type {
  display: none;
}

.vc-sketch-presets {
  display: none;
}
.vc-sketch-hue-wrap {
  height: 24px !important;
}

.vc-hue-picker {
  margin-top: 0 !important;
  height: 24px !important;
}
</style>
