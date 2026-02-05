<template>
  <div id="palette" class="w-full">
    <div class="sidebar-section">
      <h4 class="text-xs font-bold mt-1 mb-1 uppercase">Palette</h4>

      <!-- Palette menu -->
      <div  v-if="!showModal">
        <div class="flex flex-wrap" v-if="palette.length > 0">
          <template v-for="(item, i) in palette" :key="i">
            <button
              type="button"
              class="w-6 h-6 m-1 border border-gray-700 rounded-full cursor-pointer swatch"
              v-bind:style="{ backgroundColor: item['hex'] }"
              :aria-label="'Edit color ' + item['hex']"
              @click="makeActiveSwatch(i)"
            ></button>
          </template>
          <button
            type="button"
            class="w-6 h-6 ml-1 mb-1 cursor-pointer rounded-full flex items-center justify-center font-bold text-4xl text-red-700 hover:text-red-800"
            aria-label="Add new color"
            @click="addNewSwatch()"
          >
            +
          </button>
        </div>
        <div v-else class="block w-full">
          <span class="loader h-8 w-8 float-left mr-2"></span>Analyzing
          palette..
        </div>
        <!-- Preset Palette Selector -->
        <div class="mt-4">
          <label for="presetPalettes" class="mt-4 text-sm">Preset Palettes</label>
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
              <template v-for="(p, i) in customPalettes" :key="'custom-' + i">
                <option :id="'custom-' + i" name="paletteColor" :value="'custom-' + i">
                  {{ p.name }}
                </option>
              </template>
              <template v-for="(p, i) in presetPalettes" :key="p.value">
                <option :id="p.value" name="paletteColor" :value="p.value">{{
                  p.name
                }}</option>
              </template>
            </select>
          </div>
        </div>
        <!-- Palette Toolbar -->
        <div class="mt-4">
          <div class="block flex flex-row items-center justify-between">
            <div>
              <button type="button" class="text-xs inline-block p-1 cursor-pointer" @click="viewSavePalette = !viewSavePalette; viewExportPalette = false; viewImportPalette = false; showOptionsPaletteImportExport = false;" :class="viewSavePalette ? 'border-b-2 border-red-600': ''">Save</button>
              <button type="button" class="text-xs inline-block p-1 cursor-pointer" @click="viewExportPalette = !viewExportPalette; viewImportPalette = false; viewSavePalette = false; showOptionsPaletteImportExport = false;" :class=" viewExportPalette ? 'border-b-2 border-red-600': '' ">Export</button>
              <button type="button" class="text-xs inline-block p-1 cursor-pointer" @click="viewImportPalette = !viewImportPalette; viewExportPalette = false; viewSavePalette = false; showOptionsPaletteImportExport = false;" :class=" viewImportPalette ? 'border-b-2 border-red-600': ''" id="importPalette">Import</button>
            </div>
            <button
              type="button"
              class="rounded-full h-4 w-4 bg-red-700 text-white flex items-center justify-center float-right text-sm cursor-pointer"
              :aria-label="showOptionsPaletteImportExport ? 'Close help' : 'Show help'"
              @click="showOptionsPaletteImportExport = !showOptionsPaletteImportExport"
            >
              <span v-if="!showOptionsPaletteImportExport">
                ?
              </span>
              <span v-else>
                X
              </span>
            </button>
          </div>
          <div v-if="!showOptionsPaletteImportExport">
            <div class="border border-dashed border-gray-400 p-2 rounded" v-if="viewSavePalette || viewExportPalette || viewImportPalette">
              <div v-if="viewSavePalette">
                <input
                  v-model="newPaletteName"
                  type="text"
                  placeholder="Enter palette name"
                  class="w-full border border-gray-400 p-2 text-xs mb-2"
                  @keyup.enter="saveCustomPalette"
                />
                <div class="flex gap-2 items-start">
                  <button type="button" class="btn-red-small-outline" @click="saveCustomPalette">
                    Save
                  </button>
                  <button
                    v-if="isCustomPaletteSelected"
                    type="button"
                    class="btn-red-small-outline"
                    @click="deleteCurrentCustomPalette"
                  >
                    Delete Current
                  </button>
                </div>
              </div>
              <div v-show="viewExportPalette">
                <textarea readonly v-model="palette2Export" rows="5" class="w-full border border-grey-400 p-2 text-xs"></textarea>
                <div class="pt-2">
                  <a id="exportPalette" class="btn-red-small-outline text-xs" download="ditherit_palette.txt" :href="'data:text/txt;charset=utf-8,' + encodeURIComponent(JSON.stringify(palette))">Export</a>
                </div>
              </div>
              <div v-if="viewImportPalette">
                <textarea v-model="palette2Import" placeholder="Enter a palette here" rows="5" class="w-full border border-gray-400 p-2 text-xs">{{palette2Import}}</textarea>
                <div class="pt-2">
                  <button type="button" class="btn-red-small-outline" @click="importPalette">Import</button>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
              <div class="mt-2 bg-red-100 p-2 rounded">
                Save your custom palettes, or import/export using the code.
              </div>
          </div>
        </div>
      </div>
      <!-- Colorpicker Modal -->
      <div v-else>
        <div class="color-modal">
          <ColorPicker
            v-model:pureColor="currentColor"
            :disable-alpha="true"
            shape="circle"
            format="hex"
          />
        </div>
        <div class="mt-2">
          <hr />
          <div class="inline-block w-full mt-2  flex justify-between flex-col sm:flex-row md:flex-col-reverse xl:flex-row gap-4">
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
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'

export default {
  components: {
    ColorPicker
  },
  props: {
    initialPalette: { type: Array, default: () => [] }
  },
  data() {
    return {
      currentColor: '#ffffff',
      showModal: false,
      activeSwatch: 0,
      palette: [],
      convertedColorArray: [],
      originalInitialPalette: [],
      presetPaletteSelection: 'original',
      viewImportPalette: false,
      viewExportPalette: false,
      palette2Import: '',
      showOptionsPaletteImportExport: false,
      viewSavePalette: false,
      newPaletteName: '',
      customPalettes: [],
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
        },
        {
          name: 'Black White Red',
          value: 'bwr',
          colors: [{ hex: '#FFFFFF' }, { hex: '#000000' }, { hex: '#FF0000' }]
        }
      ]
    }
  },
  computed: {
    palette2Export() {
      return JSON.stringify(this.palette)
    },
    isCustomPaletteSelected() {
      return this.presetPaletteSelection.startsWith('custom-')
    }
  },
  watch: {
    initialPalette: function(newVal, oldVal) {
      this.rgbToHex(newVal)
    }
  },
  mounted() {
    this.loadCustomPalettes()
  },
  methods: {
    resetToOriginal() {
      this.presetPaletteSelection = 'original'
    },
    loadCustomPalettes() {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('ditherit_custom_palettes')
        if (stored) {
          try {
            this.customPalettes = JSON.parse(stored)
          } catch (e) {
            console.error('Error loading custom palettes:', e)
            this.customPalettes = []
          }
        }
      }
    },
    saveCustomPalettes() {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('ditherit_custom_palettes', JSON.stringify(this.customPalettes))
      }
    },
    saveCustomPalette() {
      if (!this.newPaletteName.trim()) {
        alert('Please enter a name for the palette')
        return
      }

      const newPalette = {
        name: this.newPaletteName.trim(),
        colors: JSON.parse(JSON.stringify(this.palette))
      }

      this.customPalettes.push(newPalette)
      this.saveCustomPalettes()

      this.presetPaletteSelection = 'custom-' + (this.customPalettes.length - 1)

      this.newPaletteName = ''
      this.viewSavePalette = false

      alert('Palette saved successfully!')
    },
    deleteCurrentCustomPalette() {
      if (!this.isCustomPaletteSelected) {
        return
      }

      const index = parseInt(this.presetPaletteSelection.replace('custom-', ''))
      const paletteName = this.customPalettes[index].name

      if (confirm(`Are you sure you want to delete the palette "${paletteName}"?`)) {
        this.customPalettes.splice(index, 1)
        this.saveCustomPalettes()

        this.presetPaletteSelection = 'original'
        this.palette = []
        this.originalInitialPalette.forEach((v) => {
          this.palette.push(v)
        })
        this.updatePalette()

        alert('Palette deleted successfully!')
      }
    },
    presetPaletteSelected(e) {
      this.palette = []

      if (e.target.value == 'original') {
        this.originalInitialPalette.forEach((v) => {
          this.palette.push(v)
        })
      } else if (e.target.value.startsWith('custom-')) {
        const index = parseInt(e.target.value.replace('custom-', ''))
        if (this.customPalettes[index]) {
          this.customPalettes[index].colors.forEach((c) => {
            this.palette.push(c)
          })
        }
      } else {
        this.presetPalettes.forEach((v) => {
          if (e.target.value == v.value) {
            v.colors.forEach((c) => {
              this.palette.push(c)
            })
          }
        })
      }

      this.updatePalette()
    },
    selectColor() {
      // vue3-colorpicker returns color as string (hex)
      let hexValue = this.currentColor
      if (typeof hexValue === 'object' && hexValue.hex) {
        hexValue = hexValue.hex
      }
      this.palette[this.activeSwatch] = { hex: hexValue }
      this.updatePalette()
      this.showModal = false
    },
    isActiveSwatch(i) {
      if (this.activeSwatch === i) {
        return true
      } else {
        return false
      }
    },
    makeActiveSwatch(i) {
      this.activeSwatch = i
      this.currentColor = this.palette[i].hex
      this.showModal = true

      this.presetPaletteSelection = 'custom'
    },
    addNewSwatch() {
      this.palette.push({ hex: '#ffffff' })
      this.activeSwatch = this.palette.length
      this.presetPaletteSelection = 'custom'
      this.updatePalette()
    },
    removeSwatch(i) {
      this.palette.splice(i, 1)
      this.updatePalette()
      this.showModal = false
    },
    updatePalette() {
      const colorTuplesArray = []
      this.palette.forEach((v) => {
        colorTuplesArray.push(this.hexToRgb(v['hex']))
      })
      this.$emit('update-palette', colorTuplesArray)
    },
    hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
          ]
        : null
    },
    rgbToHex() {
      this.palette = []
      const pal = this.initialPalette
      for (let i = 0; i < pal.length; i++) {
        const r = pal[i][0]
        const g = pal[i][1]
        const b = pal[i][2]
        const hex =
          '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
        this.palette.push({ hex })

        if (this.originalInitialPalette.length <= i) {
          this.originalInitialPalette.push({ hex })
        }
      }
    },
    exportPalette() {
      const palJSON = "data:text/txt;charset=utf-8," + encodeURIComponent(JSON.stringify(this.palette));

      const exportPalette = document.getElementById('exportPalette');
          exportPalette.setAttribute("href", palJSON);
          exportPalette.setAttribute("download", "ditherit_palette.txt");
    },
    importPalette() {
      try {
        this.palette = JSON.parse(this.palette2Import)
      } catch (e) {
        alert('Invalid palette format. Please paste valid JSON.')
        return
      }
      this.updatePalette();
      this.presetPaletteSelection = 'custom'
      typeof fathom !== 'undefined' && fathom('trackGoal', 'QQLOUIS1', 0);
    },
  }
}
</script>

<style>
.vc-color-wrap {
  width: 100% !important;
}
</style>
