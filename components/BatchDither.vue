<template>
  <div class="batch-root">

    <!-- ===== SETUP PHASE ===== -->
    <div v-if="phase === 'setup'" class="setup-wrap">
      <div class="page-header">
        <nuxt-link to="/" class="back-home">← Main menu</nuxt-link>
        <div class="page-icon">📦</div>
        <h2 class="page-title">Batch Dither</h2>
        <p class="page-subtitle">Dither multiple images at once with the same settings</p>
      </div>

      <!-- Upload zone -->
      <div class="setup-card">
        <h3 class="card-title">1 — Upload images</h3>
        <div
          class="upload-zone"
          :class="{ dragging: isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="onDrop"
          @click="$refs.fileInput.click()"
        >
          <input ref="fileInput" type="file" accept=".jpg,.jpeg,.png,.gif" multiple class="hidden" @change="onFileChange" />
          <div class="upload-icon">📁</div>
          <p class="upload-hint">Click or drag &amp; drop images</p>
          <p class="upload-sub">JPG, PNG or GIF — multiple files supported</p>
        </div>

        <!-- File list -->
        <div v-if="uploadedFiles.length > 0" class="file-list">
          <div v-for="(f, i) in uploadedFiles" :key="i" class="file-row">
            <img :src="f.previewUrl" class="file-thumb" :alt="f.name" />
            <span class="file-name">{{ f.name }}</span>
            <span class="file-size">{{ formatSize(f.file.size) }}</span>
            <button class="file-remove" @click="removeFile(i)">✕</button>
          </div>
          <p class="file-count">{{ uploadedFiles.length }} image{{ uploadedFiles.length !== 1 ? 's' : '' }} ready</p>
        </div>
      </div>

      <!-- Settings method choice -->
      <div v-if="uploadedFiles.length > 0" class="setup-card">
        <h3 class="card-title">2 — Choose how to pick settings</h3>
        <div class="method-cards">
          <div class="method-card" :class="{ selected: settingsMode === 'manual' }" @click="settingsMode = 'manual'">
            <div class="method-icon">⚙️</div>
            <div class="method-name">Manual settings</div>
            <div class="method-desc">Pick dither mode, palette and serpentine yourself, then apply to all images.</div>
          </div>
          <div class="method-card" :class="{ selected: settingsMode === 'tournament-random' }" @click="settingsMode = 'tournament-random'">
            <div class="method-icon">🎲</div>
            <div class="method-name">Tournament — random image</div>
            <div class="method-desc">A random image from your batch is used to run the dither bracket tournament. The winning settings are then applied to all images.</div>
          </div>
          <div class="method-card" :class="{ selected: settingsMode === 'tournament-pick' }" @click="settingsMode = 'tournament-pick'">
            <div class="method-icon">👆</div>
            <div class="method-name">Tournament — I pick image</div>
            <div class="method-desc">You choose which image from the batch to use for the bracket tournament. Winning settings applied to all.</div>
          </div>
        </div>
      </div>

      <!-- Manual settings panel -->
      <div v-if="uploadedFiles.length > 0 && settingsMode === 'manual'" class="setup-card">
        <h3 class="card-title">3 — Dither settings</h3>

        <div class="settings-grid">
          <!-- Mode -->
          <div class="setting-group">
            <label class="setting-label">Dither Mode</label>
            <div class="option-pills">
              <button class="pill" :class="{ active: manualSettings.mode === 'error' }" @click="manualSettings.mode = 'error'">Error Diffusion</button>
              <button class="pill" :class="{ active: manualSettings.mode === 'bayer' }" @click="manualSettings.mode = 'bayer'">Bayer</button>
            </div>
          </div>

          <!-- Algorithm (error diffusion only) -->
          <div v-if="manualSettings.mode === 'error'" class="setting-group">
            <label class="setting-label">Algorithm</label>
            <select v-model="manualSettings.algorithm" class="setting-select">
              <option v-for="a in errorAlgorithms" :key="a" :value="a">{{ a }}</option>
            </select>
          </div>

          <!-- Serpentine (error diffusion only) -->
          <div v-if="manualSettings.mode === 'error'" class="setting-group">
            <label class="setting-label">Serpentine</label>
            <div class="option-pills">
              <button class="pill" :class="{ active: manualSettings.serpentine === false }" @click="manualSettings.serpentine = false">Off</button>
              <button class="pill" :class="{ active: manualSettings.serpentine === true }" @click="manualSettings.serpentine = true">On</button>
            </div>
          </div>

          <!-- Palette -->
          <div class="setting-group full-width">
            <label class="setting-label">Palette</label>
            <div class="palette-grid">
              <div
                v-for="p in presetPalettes" :key="p.value"
                class="palette-chip"
                :class="{ selected: manualSettings.palette === p.value }"
                @click="manualSettings.palette = p.value"
              >
                <div class="palette-swatches">
                  <div v-for="c in p.colors.slice(0,5)" :key="c" class="palette-swatch" :style="{ background: c }"></div>
                </div>
                <div class="palette-chip-label">{{ p.name }}</div>
              </div>
              <div
                v-if="customGplPalette"
                class="palette-chip"
                :class="{ selected: manualSettings.palette === 'custom-gpl' }"
                @click="manualSettings.palette = 'custom-gpl'"
              >
                <div class="palette-swatches">
                  <div v-for="c in customGplPalette.colors.slice(0,5)" :key="c" class="palette-swatch" :style="{ background: c }"></div>
                </div>
                <div class="palette-chip-label">📄 {{ customGplPalette.name }}</div>
              </div>
            </div>
            <div class="gpl-upload-row">
              <div class="pal-import-col">
                <p class="pal-import-label">Paste JSON palette:</p>
                <textarea v-model="paletteJsonImport" rows="3" placeholder='[{"hex":"#ff0000"},{"hex":"#000000"}]' class="pal-import-textarea"></textarea>
                <button class="pal-import-btn" @click="importJsonPalette">Import JSON</button>
                <span v-if="paletteImportError" class="pal-import-error">{{ paletteImportError }}</span>
                <span v-if="paletteImportSuccess" class="pal-import-success">{{ paletteImportSuccess }}</span>
              </div>
              <div class="pal-import-col">
                <p class="pal-import-label">Upload GIMP .gpl file:</p>
                <label class="pal-import-btn">
                  📂 Upload GIMP .gpl palette
                  <input type="file" accept=".gpl" class="hidden" @change="loadGplPalette" />
                </label>
                <span v-if="gplError" class="pal-import-error">{{ gplError }}</span>
                <span v-if="gplSuccess" class="pal-import-success">{{ gplSuccess }}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          class="btn-primary w-full mt-4"
          :disabled="!manualSettingsReady"
          @click="startBatchRender(manualSettings)"
        >
          🚀 Apply to all {{ uploadedFiles.length }} images
        </button>
      </div>

      <!-- Tournament-pick image selector -->
      <div v-if="uploadedFiles.length > 0 && settingsMode === 'tournament-pick'" class="setup-card">
        <h3 class="card-title">3 — Pick the reference image for the tournament</h3>
        <div class="pick-grid">
          <div
            v-for="(f, i) in uploadedFiles" :key="i"
            class="pick-card"
            :class="{ selected: pickedReferenceIndex === i }"
            @click="pickedReferenceIndex = i"
          >
            <img :src="f.previewUrl" class="pick-thumb" :alt="f.name" />
            <div class="pick-name">{{ f.name }}</div>
          </div>
        </div>
        <button
          class="btn-primary w-full mt-4"
          :disabled="pickedReferenceIndex === null"
          @click="startTournamentWith(pickedReferenceIndex)"
        >
          🏆 Start tournament with this image
        </button>
      </div>

      <!-- Random tournament start -->
      <div v-if="uploadedFiles.length > 0 && settingsMode === 'tournament-random'" class="setup-card">
        <h3 class="card-title">3 — Ready</h3>
        <p class="card-desc">A random image from your batch will be selected and used for the dither bracket tournament. Once you've picked a winner, those settings will be applied to all {{ uploadedFiles.length }} images.</p>
        <button class="btn-primary w-full mt-4" @click="startTournamentWith(randomIndex)">
          🎲 Pick random image &amp; start tournament
        </button>
      </div>
    </div>

    <!-- ===== TOURNAMENT PHASES (wizard/processing/bracket/winner) ===== -->
    <div v-if="phase === 'tournament'">
      <DitherTournamentEmbed
        :source-data-url="tournamentSourceUrl"
        @tournament-complete="onTournamentComplete"
        @cancel="phase = 'setup'"
      />
    </div>

    <!-- ===== BATCH RENDERING ===== -->
    <div v-if="phase === 'rendering'" class="rendering-wrap">
      <div class="rendering-card">
        <div class="rendering-spinner"></div>
        <h3 class="rendering-title">Rendering batch…</h3>
        <p class="rendering-sub">{{ renderDone }} / {{ uploadedFiles.length }} images done</p>
        <div class="rendering-bar-track">
          <div class="rendering-bar-fill" :style="{ width: renderPct + '%' }"></div>
        </div>
        <p class="rendering-settings">
          {{ appliedSettings.modeName }}
          <span v-if="appliedSettings.algorithm"> · {{ appliedSettings.algorithm }}</span>
          <span v-if="appliedSettings.serpentine !== undefined"> · {{ appliedSettings.serpentine ? 'Serpentine' : 'No serpentine' }}</span>
          · {{ appliedSettings.paletteName }}
        </p>
      </div>
      <!-- Hidden off-screen rendering area -->
      <div style="position:absolute;left:-9999px;top:-9999px;">
        <canvas ref="batchCanvas"></canvas>
        <img
          v-for="(f, i) in uploadedFiles" :key="i"
          :ref="'batchImg_' + i"
          :src="f.previewUrl"
          alt=""
          style="display:block"
        />
      </div>
    </div>

    <!-- ===== RESULTS ===== -->
    <div v-if="phase === 'results'" class="results-wrap">
      <div class="results-header">
        <div>
          <h2 class="t-title">✅ Batch complete</h2>
          <p class="t-sub">{{ renderedImages.length }} images dithered · {{ appliedSettings.modeName }}<span v-if="appliedSettings.algorithm"> · {{ appliedSettings.algorithm }}</span> · {{ appliedSettings.paletteName }}</p>
        </div>
        <div class="results-actions-top">
          <button class="btn-primary" @click="downloadAllAsZip">📦 Download all as ZIP</button>
          <button class="btn-ghost" @click="reset">🔁 Start over</button>
          <nuxt-link to="/" class="btn-ghost">← Main menu</nuxt-link>
        </div>
      </div>

      <div class="results-grid">
        <div v-for="(img, i) in renderedImages" :key="i" class="result-card">
          <img :src="img.dataUrl" class="result-img" :alt="img.name" />
          <div class="result-footer">
            <span class="result-name">{{ img.name }}</span>
            <a :href="img.dataUrl" :download="'dithered_' + img.name" class="result-dl">💾</a>
          </div>
        </div>
      </div>

      <div class="results-bottom">
        <button class="btn-primary large" @click="downloadAllAsZip">📦 Download all as ZIP</button>
      </div>
    </div>

  </div>
</template>

<script>
import RgbQuant from 'rgbquant'
import { bayerDither } from '~/utils/dithering'
import DitherTournamentEmbed from '~/components/DitherTournamentEmbed.vue'

const ERROR_ALGORITHMS = [
  'FloydSteinberg', 'Atkinson', 'Sierra24A', 'Fan', 'ShiauFan',
  'ShiauFan2', 'JarvisJudiceNinke', 'Stucki', 'Burkes', 'Sierra3', 'Sierra2'
]

const PRESET_PALETTES = [
  { name: 'Original (auto)', value: 'original', colors: ['#888','#444','#ccc','#222','#fff'] },
  { name: 'Black & White', value: 'blackwhite', colors: ['#ffffff','#000000'] },
  { name: 'CMYK', value: 'cmyk', colors: ['#000000','#ffff00','#00FFFF','#FF00FF','#FFFFFF'] },
  { name: 'Game Boy', value: 'gameboy', colors: ['#CADC9F','#0F380F','#306230','#8BAC0F','#9BBC0F'] },
  { name: 'Red Monochrome', value: 'redmono', colors: ['#ffe3db','#4f1403'] },
  { name: 'Blue & Yellow', value: 'blueyellow', colors: ['#134E87','#FFF585'] },
  { name: 'Green Monochrome', value: 'greenmono', colors: ['#eeffdb','#1d3801'] },
  { name: 'Red', value: 'red', colors: ['#ffffff','#f46842','#aa2f0d','#000000'] },
  { name: 'Black White Red', value: 'bwr', colors: ['#FFFFFF','#000000','#FF0000'] },
  { name: 'Purple & Green', value: 'purplegreen', colors: ['#76C066','#AD2BBB'] },
]

const PALETTE_COLORS = {
  original: null,
  blackwhite: ['#ffffff','#000000'],
  cmyk: ['#000000','#ffff00','#00FFFF','#FF00FF','#FFFFFF'],
  gameboy: ['#CADC9F','#0F380F','#306230','#8BAC0F','#9BBC0F'],
  redmono: ['#ffe3db','#4f1403'],
  blueyellow: ['#134E87','#FFF585'],
  greenmono: ['#eeffdb','#1d3801'],
  red: ['#ffffff','#f46842','#aa2f0d','#000000'],
  bwr: ['#FFFFFF','#000000','#FF0000'],
  purplegreen: ['#76C066','#AD2BBB'],
}

function hexToRgb(hex) {
  const r = new RegExp('^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$', 'i').exec(hex)
  return r ? [parseInt(r[1],16), parseInt(r[2],16), parseInt(r[3],16)] : null
}

function getPaletteRgb(paletteKey) {
  const hexes = PALETTE_COLORS[paletteKey]
  if (!hexes) return null
  return hexes.map(h => hexToRgb(h)).filter(Boolean)
}

export default {
  name: 'BatchDither',
  components: { DitherTournamentEmbed },
  data() {
    return {
      phase: 'setup',
      isDragging: false,
      uploadedFiles: [],   // [{file, name, previewUrl}]
      settingsMode: null,  // 'manual' | 'tournament-random' | 'tournament-pick'
      pickedReferenceIndex: null,
      tournamentSourceUrl: null,

      manualSettings: {
        mode: 'error',
        algorithm: 'FloydSteinberg',
        serpentine: false,
        palette: 'original',
      },

      appliedSettings: null,
      renderDone: 0,
      renderedImages: [],

      errorAlgorithms: ERROR_ALGORITHMS,
      presetPalettes: PRESET_PALETTES,
      customGplPalette: null,
      gplError: '',
      gplSuccess: '',
      paletteJsonImport: '',
      paletteImportError: '',
      paletteImportSuccess: '',
    }
  },
  computed: {
    randomIndex() {
      return Math.floor(Math.random() * this.uploadedFiles.length)
    },
    renderPct() {
      if (!this.uploadedFiles.length) return 0
      return Math.round((this.renderDone / this.uploadedFiles.length) * 100)
    },
    manualSettingsReady() {
      if (!this.manualSettings.mode) return false
      if (!this.manualSettings.palette) return false
      if (this.manualSettings.mode === 'error' && !this.manualSettings.algorithm) return false
      return true
    }
  },
  methods: {
    onFileChange(e) {
      this.addFiles(Array.from(e.target.files))
      e.target.value = ''
    },
    onDrop(e) {
      this.isDragging = false
      this.addFiles(Array.from(e.dataTransfer.files))
    },
    addFiles(files) {
      files.forEach(file => {
        if (!file.type.startsWith('image/')) return
        const reader = new FileReader()
        reader.onload = ev => {
          this.uploadedFiles.push({ file, name: file.name, previewUrl: ev.target.result })
        }
        reader.readAsDataURL(file)
      })
    },
    removeFile(i) {
      this.uploadedFiles.splice(i, 1)
      if (this.pickedReferenceIndex === i) this.pickedReferenceIndex = null
    },
    formatSize(bytes) {
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB'
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    },

    startTournamentWith(index) {
      this.tournamentSourceUrl = this.uploadedFiles[index].previewUrl
      this.phase = 'tournament'
    },

    onTournamentComplete(winnerConfig) {
      // winnerConfig: { mode, algorithm, serpentine, palette (value), paletteName }
      this.startBatchRender(winnerConfig)
    },

    startBatchRender(settings) {
      // Normalise settings into appliedSettings
      const paletteName = settings.palette === 'custom-gpl' && this.customGplPalette
        ? this.customGplPalette.name
        : (PRESET_PALETTES.find(p => p.value === settings.palette)?.name || 'Original')
      this.appliedSettings = {
        mode: settings.mode,
        modeName: settings.mode === 'error' ? 'Error Diffusion' : 'Bayer (Ordered)',
        algorithm: settings.algorithm || null,
        serpentine: settings.serpentine !== undefined ? settings.serpentine : false,
        palette: settings.palette,
        paletteName,
      }
      this.renderDone = 0
      this.renderedImages = []
      this.phase = 'rendering'
      this.$nextTick(() => this.runBatchRender())
    },

    async runBatchRender() {
      const paletteRgb = this.appliedSettings.palette === 'custom-gpl' && this.customGplPalette
        ? this.customGplPalette.rgb
        : getPaletteRgb(this.appliedSettings.palette)
      const canvas = this.$refs.batchCanvas

      for (let i = 0; i < this.uploadedFiles.length; i++) {
        await new Promise(r => setTimeout(r, 20))

        const imgRef = this.$refs['batchImg_' + i]
        const img = Array.isArray(imgRef) ? imgRef[0] : imgRef

        // Wait for image to load
        if (!img.complete) {
          await new Promise(r => { img.onload = r })
        }

        const w = img.naturalWidth
        const h = img.naturalHeight
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)

        try {
          if (this.appliedSettings.mode === 'bayer') {
            const imgData = ctx.getImageData(0, 0, w, h)
            const pal = paletteRgb || this.autoSamplePalette(img)
            bayerDither(ctx, imgData, pal, 1)
          } else {
            const qOpts = {
              colors: paletteRgb ? paletteRgb.length : 8,
              method: 2, boxSize: [8,8], boxPxls: 2,
              initColors: 4096, minHueCols: 2000,
              dithKern: this.appliedSettings.algorithm,
              dithDelta: 0,
              dithSerp: this.appliedSettings.serpentine,
              reIndex: false, useCache: true, cacheFreq: 10,
              colorDist: 'euclidean',
              palette: paletteRgb || [],
            }
            const q = new RgbQuant(qOpts)
            q.sample(img)
            const result = q.reduce(canvas)
            const imgData = ctx.getImageData(0, 0, w, h)
            imgData.data.set(result)
            ctx.putImageData(imgData, 0, 0)
          }
        } catch(e) { /* use plain canvas */ }

        const dataUrl = canvas.toDataURL('image/png')
        const nameParts = this.uploadedFiles[i].name.split('.')
        const baseName = nameParts.length > 1 ? nameParts.slice(0, -1).join('.') : nameParts[0]
        this.renderedImages.push({ dataUrl, name: baseName + '_dithered.png' })
        this.renderDone++
      }

      this.phase = 'results'
    },

    autoSamplePalette(img) {
      const c = document.createElement('canvas')
      c.width = 16; c.height = 16
      const ctx = c.getContext('2d')
      ctx.drawImage(img, 0, 0, 16, 16)
      const data = ctx.getImageData(0, 0, 16, 16).data
      const colors = []
      for (let i = 0; i < data.length; i += 64) colors.push([data[i], data[i+1], data[i+2]])
      return colors.slice(0, 16)
    },

    async downloadAllAsZip() {
      // Use JSZip via CDN-loaded global, or fall back to sequential downloads
      if (typeof JSZip === 'undefined') {
        await this.loadJsZip()
      }
      const zip = new JSZip()
      for (const img of this.renderedImages) {
        // dataUrl to binary
        const base64 = img.dataUrl.split(',')[1]
        zip.file(img.name, base64, { base64: true })
      }
      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'batch_dithered.zip'
      a.click()
      URL.revokeObjectURL(url)
    },

    loadJsZip() {
      return new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
        s.onload = resolve
        s.onerror = reject
        document.head.appendChild(s)
      })
    },

    importJsonPalette() {
      this.paletteImportError = ''; this.paletteImportSuccess = ''
      try {
        const parsed = JSON.parse(this.paletteJsonImport)
        if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('empty')
        if (parsed.length > 256) { this.paletteImportError = 'Maximum 256 colours allowed.'; return }
        const colors = parsed.map(e => typeof e === 'string' ? e : e.hex).filter(Boolean)
        this.customGplPalette = { name: 'JSON Import', colors, rgb: colors.map(h => hexToRgb(h)).filter(Boolean) }
        this.manualSettings.palette = 'custom-gpl'
        this.paletteJsonImport = ''
        this.paletteImportSuccess = 'Loaded ' + colors.length + ' colours'
      } catch(e) {
        this.paletteImportError = 'Invalid JSON. Expected: [{"hex":"#ff0000"},...]'
      }
    },
    loadGplPalette(e) {
      this.gplError = ''
      this.gplSuccess = ''
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        const result = this.parseGpl(ev.target.result)
        if (result.error) { this.gplError = result.error; return }
        if (result.colors.length === 0) { this.gplError = 'No colours found in this .gpl file.'; return }
        if (result.colors.length > 256) { this.gplError = `This palette has ${result.colors.length} colours — maximum is 256.`; return }
        this.customGplPalette = {
          name: result.name,
          colors: result.colors,
          rgb: result.colors.map(h => hexToRgb(h)).filter(Boolean)
        }
        this.manualSettings.palette = 'custom-gpl'
        this.gplSuccess = `Loaded "${result.name}" — ${result.colors.length} colours`
      }
      reader.onerror = () => { this.gplError = 'Could not read the file.' }
      reader.readAsText(file)
      e.target.value = ''
    },
    parseGpl(text) {
      const lines = text.split('\n').map(l => l.charAt(l.length-1)==='\r' ? l.slice(0,-1) : l)
      if (!lines[0] || lines[0].trim() !== 'GIMP Palette') return { error: 'Not a valid GIMP .gpl file.' }
      let name = 'Custom GPL'
      const colors = []
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line || line.startsWith('#')) continue
        if (line.startsWith('Name:')) { name = line.replace('Name:', '').trim(); continue }
        if (line.startsWith('Columns:')) continue
        const parts = line.split(' ').join('\t').split('\t').filter(s => s.length > 0)
        if (parts.length >= 3) {
          const r = parseInt(parts[0]), g = parseInt(parts[1]), b = parseInt(parts[2])
          if (!isNaN(r) && !isNaN(g) && !isNaN(b) && r <= 255 && g <= 255 && b <= 255) {
            colors.push('#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join(''))
          }
        }
      }
      return { name, colors }
    },
    reset() {
      this.phase = 'setup'
      this.uploadedFiles = []
      this.settingsMode = null
      this.pickedReferenceIndex = null
      this.tournamentSourceUrl = null
      this.appliedSettings = null
      this.renderDone = 0
      this.renderedImages = []
      this.manualSettings = { mode: 'error', algorithm: 'FloydSteinberg', serpentine: false, palette: 'original' }
      this.customGplPalette = null
      this.gplError = ''
      this.gplSuccess = ''
      this.paletteJsonImport = ''
      this.paletteImportError = ''
      this.paletteImportSuccess = ''
    }
  }
}
</script>

<style scoped>
.batch-root {
  font-family: 'Georgia', serif;
  min-height: 100vh;
  background: #faf8f5;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

/* Header */
.page-header { text-align: center; position: relative; width: 100%; max-width: 860px; margin-bottom: 0.5rem; }
.back-home { position: absolute; left: 0; top: 0; font-size: 0.85rem; font-weight: 700; color: #1a1a1a; text-decoration: none; border-bottom: 2px solid transparent; transition: all 0.15s; }
.back-home:hover { border-color: #c53030; color: #c53030; }
.page-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.page-title { font-size: 2rem; font-weight: 700; margin: 0; color: #1a1a1a; }
.page-subtitle { color: #666; font-size: 0.9rem; margin: 0.25rem 0 0; }

/* Cards */
.setup-wrap { width: 100%; max-width: 860px; display: flex; flex-direction: column; gap: 1.5rem; }
.setup-card { background: #fff; border: 2px solid #1a1a1a; border-radius: 4px; box-shadow: 5px 5px 0 #1a1a1a; padding: 1.75rem; }
.card-title { font-size: 1.1rem; font-weight: 700; margin: 0 0 1rem; color: #1a1a1a; }
.card-desc { font-size: 0.9rem; color: #555; margin: 0 0 0.5rem; line-height: 1.5; }

/* Upload */
.upload-zone { border: 2px dashed #bbb; border-radius: 4px; padding: 2rem; text-align: center; cursor: pointer; transition: all 0.2s; background: #faf8f5; }
.upload-zone:hover, .upload-zone.dragging { border-color: #c53030; background: #fff5f5; }
.upload-icon { font-size: 2rem; margin-bottom: 0.5rem; }
.upload-hint { font-weight: 600; margin: 0; color: #1a1a1a; }
.upload-sub { font-size: 0.8rem; color: #888; margin: 0.25rem 0 0; }
.file-list { margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
.file-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem; border: 1px solid #eee; border-radius: 3px; background: #faf8f5; }
.file-thumb { width: 40px; height: 40px; object-fit: cover; border-radius: 2px; image-rendering: pixelated; flex-shrink: 0; }
.file-name { flex: 1; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #1a1a1a; }
.file-size { font-size: 0.75rem; color: #888; flex-shrink: 0; }
.file-remove { background: none; border: none; cursor: pointer; color: #c53030; font-size: 0.9rem; font-weight: 700; flex-shrink: 0; padding: 0.2rem 0.4rem; }
.file-remove:hover { background: #fff5f5; border-radius: 2px; }
.file-count { font-size: 0.8rem; color: #888; margin: 0.5rem 0 0; text-align: right; }

/* Method cards */
.method-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
.method-card { border: 2px solid #ddd; border-radius: 4px; padding: 1.25rem 1rem; cursor: pointer; transition: all 0.15s; text-align: center; background: #faf8f5; }
.method-card:hover { border-color: #c53030; transform: translateY(-2px); }
.method-card.selected { border-color: #c53030; background: #fff5f5; box-shadow: 3px 3px 0 #c53030; }
.method-icon { font-size: 1.8rem; margin-bottom: 0.5rem; }
.method-name { font-weight: 700; font-size: 0.95rem; margin-bottom: 0.35rem; color: #1a1a1a; }
.method-desc { font-size: 0.78rem; color: #666; line-height: 1.4; }

/* Settings */
.settings-grid { display: flex; flex-direction: column; gap: 1.25rem; }
.setting-group { display: flex; flex-direction: column; gap: 0.4rem; }
.full-width { width: 100%; }
.setting-label { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #555; }
.option-pills { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.pill { padding: 0.35rem 0.85rem; font-size: 0.85rem; font-weight: 700; font-family: inherit; border: 2px solid #ddd; border-radius: 2px; background: #fff; cursor: pointer; transition: all 0.15s; }
.pill:hover { border-color: #c53030; }
.pill.active { background: #c53030; border-color: #c53030; color: #fff; }
.setting-select { border: 2px solid #ddd; border-radius: 2px; padding: 0.4rem 0.6rem; font-size: 0.9rem; font-family: inherit; background: #fff; width: 100%; max-width: 320px; }
.setting-select:focus { outline: none; border-color: #c53030; }

.palette-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.6rem; }
.palette-chip { border: 2px solid #ddd; border-radius: 4px; padding: 0.5rem; cursor: pointer; transition: all 0.15s; background: #fff; }
.palette-chip:hover { border-color: #c53030; }
.palette-chip.selected { border-color: #c53030; box-shadow: 3px 3px 0 #c53030; }
.palette-swatches { display: flex; height: 18px; border-radius: 2px; overflow: hidden; margin-bottom: 0.35rem; }
.palette-swatch { flex: 1; }
.palette-chip-label { font-size: 0.72rem; font-weight: 600; color: #1a1a1a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Pick reference grid */
.pick-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.75rem; }
.pick-card { border: 2px solid #ddd; border-radius: 4px; overflow: hidden; cursor: pointer; transition: all 0.15s; background: #fff; }
.pick-card:hover { border-color: #c53030; transform: translateY(-2px); }
.pick-card.selected { border-color: #c53030; box-shadow: 3px 3px 0 #c53030; }
.pick-thumb { width: 100%; height: 90px; object-fit: cover; display: block; image-rendering: pixelated; }
.pick-name { font-size: 0.7rem; padding: 0.3rem 0.4rem; color: #555; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Rendering */
.rendering-wrap { display: flex; align-items: center; justify-content: center; min-height: 60vh; width: 100%; }
.rendering-card { text-align: center; background: #fff; border: 2px solid #1a1a1a; box-shadow: 6px 6px 0 #1a1a1a; border-radius: 4px; padding: 3rem 2.5rem; max-width: 420px; width: 100%; }
.rendering-spinner { width: 48px; height: 48px; border: 4px solid #eee; border-top-color: #c53030; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1.5rem; }
.rendering-title { font-size: 1.3rem; font-weight: 700; margin: 0 0 0.5rem; color: #1a1a1a; }
.rendering-sub { color: #666; margin: 0 0 1.25rem; font-size: 0.9rem; }
.rendering-bar-track { height: 8px; background: #eee; border-radius: 4px; overflow: hidden; margin-bottom: 1rem; }
.rendering-bar-fill { height: 100%; background: #c53030; transition: width 0.3s ease; border-radius: 4px; }
.rendering-settings { font-size: 0.78rem; color: #999; margin: 0; }

/* Results */
.results-wrap { width: 100%; max-width: 1100px; }
.results-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
.t-title { font-size: 1.8rem; font-weight: 700; margin: 0; color: #1a1a1a; }
.t-sub { color: #666; margin: 0.25rem 0 0; font-size: 0.9rem; }
.results-actions-top { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: flex-start; }
.results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
.result-card { border: 2px solid #ddd; border-radius: 4px; overflow: hidden; background: #fff; }
.result-img { width: 100%; height: auto; display: block; image-rendering: pixelated; }
.result-footer { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.6rem; border-top: 1px solid #eee; }
.result-name { font-size: 0.72rem; color: #555; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
.result-dl { font-size: 1rem; text-decoration: none; flex-shrink: 0; }
.results-bottom { text-align: center; padding: 1rem 0 2rem; }

/* Buttons */
.btn-primary { display: inline-block; background: #c53030; color: #fff; border: 2px solid #c53030; padding: 0.6rem 1.5rem; font-size: 1rem; font-weight: 700; font-family: inherit; cursor: pointer; border-radius: 2px; transition: all 0.15s; text-decoration: none; text-align: center; }
.btn-primary:hover:not(:disabled) { background: #9b2c2c; border-color: #9b2c2c; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-primary.large { font-size: 1.1rem; padding: 0.8rem 2.5rem; }
.btn-ghost { display: inline-block; background: transparent; color: #1a1a1a; border: 2px solid #1a1a1a; padding: 0.6rem 1.5rem; font-size: 1rem; font-weight: 700; font-family: inherit; cursor: pointer; border-radius: 2px; transition: all 0.15s; text-decoration: none; text-align: center; }
.btn-ghost:hover { background: #1a1a1a; color: #fff; }
.w-full { width: 100%; box-sizing: border-box; }
.mt-4 { margin-top: 1rem; }

.gpl-upload-row { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #eee; }
.pal-import-col { display: flex; flex-direction: column; gap: 0.35rem; flex: 1; min-width: 160px; }
.pal-import-label { font-size: 0.75rem; font-weight: 700; color: #555; margin: 0; }
.pal-import-textarea { font-size: 0.75rem; border: 1px solid #ccc; border-radius: 2px; padding: 0.4rem; font-family: monospace; resize: vertical; }
.pal-import-btn { font-size: 0.78rem; font-weight: 700; font-family: inherit; border: 2px solid #1a1a1a; background: #fff; color: #1a1a1a; padding: 0.3rem 0.7rem; border-radius: 2px; cursor: pointer; transition: all 0.15s; display: inline-block; }
.pal-import-btn:hover { background: #1a1a1a; color: #fff; }
.pal-import-error { font-size: 0.75rem; color: #c53030; font-weight: 600; }
.pal-import-success { font-size: 0.75rem; color: #2d7a2d; font-weight: 600; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 600px) {
  .method-cards { grid-template-columns: 1fr; }
  .results-header { flex-direction: column; }
  .results-actions-top { width: 100%; }
}
</style>
