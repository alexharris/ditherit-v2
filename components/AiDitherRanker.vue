<template>
  <div class="ranker-root">

    <!-- ===== UPLOAD PHASE ===== -->
    <div v-if="phase === 'upload'" class="upload-wrap">
      <div class="page-header">
        <nuxt-link to="/" class="back-home">← Main menu</nuxt-link>
        <div class="page-icon">🤖</div>
        <h2 class="page-title">AI Dither Ranker</h2>
        <p class="page-subtitle">Upload an image and your trained model will rank every dithering option, best to worst — no bracket needed.</p>
      </div>

      <div v-if="!aiModelAvailable" class="no-model-warning">
        ⚠️ No trained model was found yet. Go to the <nuxt-link to="/ai-trainer" class="inline-link">AI Trainer</nuxt-link> page to train one from your bracket tournament picks first, or continue anyway to see the (unranked) dithering options.
      </div>

      <div class="setup-card">
        <h3 class="card-title">1 — Upload an image</h3>
        <div
          class="upload-zone"
          :class="{ dragging: isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="onDrop"
          @click="$refs.fileInput.click()"
        >
          <input ref="fileInput" type="file" accept=".jpg,.jpeg,.png,.gif" class="hidden" @change="onFileChange" />
          <div v-if="!previewSrc" class="upload-icon">📁</div>
          <img v-else :src="previewSrc" class="upload-preview" alt="preview" />
          <p v-if="!previewSrc" class="upload-hint">Click or drag &amp; drop an image</p>
        </div>
      </div>

      <div v-if="previewSrc" class="setup-card">
        <h3 class="card-title">2 — Settings to rank</h3>

        <div class="settings-grid">
          <div class="setting-group">
            <label class="setting-label">Dither Mode</label>
            <div class="option-pills">
              <button class="pill" :class="{ active: settings.mode === 'error' }" @click="settings.mode = 'error'">Error Diffusion</button>
              <button class="pill" :class="{ active: settings.mode === 'bayer' }" @click="settings.mode = 'bayer'">Bayer</button>
              <button class="pill" :class="{ active: settings.mode === 'both' }" @click="settings.mode = 'both'">Both</button>
            </div>
          </div>

          <div v-if="settings.mode !== 'bayer'" class="setting-group">
            <label class="setting-label">Serpentine</label>
            <div class="option-pills">
              <button class="pill" :class="{ active: settings.serpentine === false }" @click="settings.serpentine = false">Off</button>
              <button class="pill" :class="{ active: settings.serpentine === true }" @click="settings.serpentine = true">On</button>
              <button class="pill" :class="{ active: settings.serpentine === 'both' }" @click="settings.serpentine = 'both'">Both</button>
            </div>
          </div>

          <div class="setting-group full-width">
            <label class="setting-label">Palette</label>
            <div class="palette-grid">
              <div
                v-for="p in presetPalettes" :key="p.value"
                class="palette-chip"
                :class="{ selected: settings.palette === p.value }"
                @click="settings.palette = p.value"
              >
                <div class="palette-swatches">
                  <div v-for="c in p.colors.slice(0,5)" :key="c" class="palette-swatch" :style="{ background: c }"></div>
                </div>
                <div class="palette-chip-label">{{ p.name }}</div>
              </div>
              <div
                v-if="customGplPalette"
                class="palette-chip"
                :class="{ selected: settings.palette === 'custom-gpl' }"
                @click="settings.palette = 'custom-gpl'"
              >
                <div class="palette-swatches">
                  <div v-for="c in customGplPalette.colors.slice(0,5)" :key="c" class="palette-swatch" :style="{ background: c }"></div>
                </div>
                <div class="palette-chip-label">📄 {{ customGplPalette.name }}</div>
              </div>
            </div>
            <div class="pal-import-row">
              <label class="pal-import-btn">
                📂 Upload GIMP .gpl palette
                <input type="file" accept=".gpl" class="hidden" @change="loadGplPalette" />
              </label>
              <span v-if="gplError" class="pal-import-error">{{ gplError }}</span>
              <span v-if="gplSuccess" class="pal-import-success">{{ gplSuccess }}</span>
            </div>
          </div>
        </div>

        <button
          class="btn-primary w-full mt-4"
          :disabled="!settingsReady"
          @click="startRanking"
        >
          🤖 Rank all dithering options
        </button>
      </div>
    </div>

    <!-- ===== PROCESSING PHASE ===== -->
    <div v-if="phase === 'processing'" class="processing-wrap">
      <div class="processing-card">
        <div class="processing-spinner"></div>
        <h3>Rendering &amp; scoring…</h3>
        <p>{{ doneCount }} / {{ totalCount }}</p>
        <div class="bar-track"><div class="bar-fill" :style="{ width: progressPct + '%' }"></div></div>
      </div>
      <div style="position:absolute;left:-9999px;top:-9999px;">
        <img ref="sourceImg" :src="previewSrc" alt="" />
      </div>
    </div>

    <!-- ===== RESULTS PHASE ===== -->
    <div v-if="phase === 'results'" class="results-wrap">
      <div class="results-header">
        <div>
          <h2 class="t-title">{{ aiModelAvailable ? '🤖 AI-ranked results' : 'Results (unranked — no model)' }}</h2>
          <p class="t-sub">{{ rankedResults.length }} option{{ rankedResults.length !== 1 ? 's' : '' }} rendered{{ aiModelAvailable ? ', sorted by predicted score — highest first' : '' }}</p>
        </div>
        <div class="results-actions-top">
          <button class="btn-ghost" @click="reset">🔁 Try another image</button>
          <nuxt-link to="/" class="btn-ghost">← Main menu</nuxt-link>
        </div>
      </div>

      <div v-if="selectedResult" class="selected-banner">
        ✅ Selected: <strong>{{ selectedResult.label }}</strong> — <a :href="selectedResult.dataUrl" download="dithered_selected.png" class="selected-dl">💾 Download this version</a>
      </div>

      <div class="ranked-list">
        <div
          v-for="(r, i) in rankedResults" :key="r.id"
          class="ranked-row"
          :class="{ selected: selectedResult === r }"
        >
          <div class="rank-num">#{{ i + 1 }}</div>
          <img :src="r.dataUrl" class="rank-thumb" :alt="r.label" />
          <div class="rank-info">
            <div class="rank-label">{{ r.label }}</div>
            <div v-if="aiModelAvailable" class="rank-score">predicted score: {{ r.aiScore.toFixed(2) }}</div>
          </div>
          <div class="rank-actions">
            <a :href="r.dataUrl" :download="downloadFilenameFor(r.label)" class="rank-dl-btn">💾</a>
            <button class="rank-pick-btn" @click="selectResult(r)">
              {{ selectedResult === r ? '✓ Selected' : 'Select this' }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ERROR_ALGORITHMS, PRESET_PALETTES, buildVariants, resolvePaletteRgb } from '~/utils/ditherVariants'
import { renderAllVariants } from '~/utils/ditherRenderer'
import { extractImageFeatures, extractCandidateFeatures } from '~/utils/aiFeatures'
import { loadModel, predictScores, hasStoredModel } from '~/utils/aiRankerModel'

export default {
  name: 'AiDitherRanker',
  data() {
    return {
      phase: 'upload',
      isDragging: false,
      previewSrc: null,

      settings: {
        mode: 'error',
        serpentine: false,
        palette: 'blackwhite',
      },

      customGplPalette: null,
      gplError: '',
      gplSuccess: '',

      doneCount: 0,
      totalCount: 0,

      rankedResults: [],
      selectedResult: null,

      aiModelAvailable: false,

      errorAlgorithms: ERROR_ALGORITHMS,
      presetPalettes: PRESET_PALETTES,
    }
  },
  computed: {
    progressPct() {
      return this.totalCount === 0 ? 0 : Math.round((this.doneCount / this.totalCount) * 100)
    },
    settingsReady() {
      if (!this.settings.mode) return false
      if (!this.settings.palette) return false
      if (this.settings.mode !== 'bayer' && this.settings.serpentine === null) return false
      return true
    }
  },
  async mounted() {
    try {
      this.aiModelAvailable = await hasStoredModel()
    } catch (e) {
      this.aiModelAvailable = false
    }
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0]
      if (file) this.loadFile(file)
      e.target.value = ''
    },
    onDrop(e) {
      this.isDragging = false
      const file = e.dataTransfer.files[0]
      if (file) this.loadFile(file)
    },
    loadFile(file) {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = ev => { this.previewSrc = ev.target.result }
      reader.readAsDataURL(file)
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
          rgb: result.colors.map(h => this.hexToRgbLocal(h)).filter(Boolean)
        }
        this.settings.palette = 'custom-gpl'
        this.gplSuccess = `Loaded "${result.name}" — ${result.colors.length} colours`
      }
      reader.onerror = () => { this.gplError = 'Could not read the file.' }
      reader.readAsText(file)
      e.target.value = ''
    },
    hexToRgbLocal(hex) {
      const result = new RegExp('^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$', 'i').exec(hex)
      return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null
    },
    parseGpl(text) {
      const lines = text.split('\n').map(l => l.charAt(l.length - 1) === '\r' ? l.slice(0, -1) : l)
      if (!lines[0] || lines[0].trim() !== 'GIMP Palette') return { error: 'Not a valid GIMP .gpl file.' }
      let name = 'Custom GPL'
      const colors = []
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line || line.charAt(0) === '#') continue
        if (line.indexOf('Name:') === 0) { name = line.slice(5).trim(); continue }
        if (line.indexOf('Columns:') === 0) continue
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

    async startRanking() {
      this.phase = 'processing'
      this.doneCount = 0
      await this.$nextTick()

      const img = this.$refs.sourceImg
      if (!img.complete) {
        await new Promise(resolve => { img.onload = resolve })
      }

      const variants = buildVariants(this.settings.mode, this.settings.serpentine)
      this.totalCount = variants.length

      const paletteRgb = resolvePaletteRgb(this.settings.palette, this.customGplPalette)

      const rendered = await renderAllVariants(img, variants, paletteRgb, (done, total) => {
        this.doneCount = done
        this.totalCount = total
      })

      // Score with AI model if available
      let imageFeatures = null
      try {
        imageFeatures = extractImageFeatures(img)
      } catch (e) {
        imageFeatures = null
      }

      if (imageFeatures && this.aiModelAvailable) {
        try {
          const model = await loadModel()
          if (model) {
            const candidateFeatureList = rendered.map(r => extractCandidateFeatures(r.config))
            const scores = predictScores(model, imageFeatures, candidateFeatureList)
            rendered.forEach((r, i) => { r.aiScore = scores[i] })
            rendered.sort((a, b) => b.aiScore - a.aiScore)
          } else {
            this.aiModelAvailable = false
          }
        } catch (e) {
          this.aiModelAvailable = false
        }
      }

      this.rankedResults = rendered
      this.selectedResult = null
      this.phase = 'results'
    },

    selectResult(r) {
      this.selectedResult = r
    },
    downloadFilenameFor(label) {
      const safe = label
        .toLowerCase()
        .split('')
        .map(ch => (ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9') ? ch : '_')
        .join('')
      return 'dithered_' + safe + '.png'
    },

    reset() {
      this.phase = 'upload'
      this.previewSrc = null
      this.settings = { mode: 'error', serpentine: false, palette: 'blackwhite' }
      this.customGplPalette = null
      this.gplError = ''
      this.gplSuccess = ''
      this.doneCount = 0
      this.totalCount = 0
      this.rankedResults = []
      this.selectedResult = null
    }
  }
}
</script>

<style scoped>
.ranker-root {
  font-family: 'Georgia', serif;
  min-height: 100vh;
  background: #faf8f5;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.page-header { text-align: center; position: relative; width: 100%; max-width: 860px; margin-bottom: 0.5rem; }
.back-home { position: absolute; left: 0; top: 0; font-size: 0.85rem; font-weight: 700; color: #1a1a1a; text-decoration: none; border-bottom: 2px solid transparent; transition: all 0.15s; }
.back-home:hover { border-color: #c53030; color: #c53030; }
.page-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.page-title { font-size: 2rem; font-weight: 700; margin: 0; color: #1a1a1a; }
.page-subtitle { color: #666; font-size: 0.9rem; margin: 0.25rem 0 0; }

.no-model-warning { background: #fff8e1; border: 2px solid #f0ad4e; border-radius: 4px; padding: 0.9rem 1.1rem; font-size: 0.88rem; color: #856404; max-width: 860px; width: 100%; line-height: 1.5; }
.inline-link { color: #2a6ebb; font-weight: 700; text-decoration: underline; }

.upload-wrap { width: 100%; max-width: 860px; display: flex; flex-direction: column; gap: 1.5rem; }
.setup-card { background: #fff; border: 2px solid #1a1a1a; border-radius: 4px; box-shadow: 5px 5px 0 #1a1a1a; padding: 1.75rem; }
.card-title { font-size: 1.1rem; font-weight: 700; margin: 0 0 1rem; color: #1a1a1a; }

.upload-zone { border: 2px dashed #bbb; border-radius: 4px; padding: 2rem; text-align: center; cursor: pointer; transition: all 0.2s; background: #faf8f5; min-height: 120px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.upload-zone:hover, .upload-zone.dragging { border-color: #c53030; background: #fff5f5; }
.upload-icon { font-size: 2rem; margin-bottom: 0.5rem; }
.upload-hint { font-weight: 600; margin: 0; color: #1a1a1a; }
.upload-preview { max-width: 100%; max-height: 260px; width: auto; image-rendering: pixelated; border-radius: 3px; }

.settings-grid { display: flex; flex-direction: column; gap: 1.25rem; }
.setting-group { display: flex; flex-direction: column; gap: 0.4rem; }
.full-width { width: 100%; }
.setting-label { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #555; }
.option-pills { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.pill { padding: 0.35rem 0.85rem; font-size: 0.85rem; font-weight: 700; font-family: inherit; border: 2px solid #ddd; border-radius: 2px; background: #fff; cursor: pointer; transition: all 0.15s; }
.pill:hover { border-color: #c53030; }
.pill.active { background: #c53030; border-color: #c53030; color: #fff; }

.palette-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.6rem; }
.palette-chip { border: 2px solid #ddd; border-radius: 4px; padding: 0.5rem; cursor: pointer; transition: all 0.15s; background: #fff; }
.palette-chip:hover { border-color: #c53030; }
.palette-chip.selected { border-color: #c53030; box-shadow: 3px 3px 0 #c53030; }
.palette-swatches { display: flex; height: 18px; border-radius: 2px; overflow: hidden; margin-bottom: 0.35rem; }
.palette-swatch { flex: 1; }
.palette-chip-label { font-size: 0.72rem; font-weight: 600; color: #1a1a1a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.pal-import-row { display: flex; align-items: center; gap: 0.75rem; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #eee; flex-wrap: wrap; }
.pal-import-btn { font-size: 0.8rem; font-weight: 700; font-family: inherit; border: 2px solid #1a1a1a; background: #fff; color: #1a1a1a; padding: 0.3rem 0.75rem; border-radius: 2px; cursor: pointer; transition: all 0.15s; display: inline-block; }
.pal-import-btn:hover { background: #1a1a1a; color: #fff; }
.pal-import-error { font-size: 0.78rem; color: #c53030; font-weight: 600; }
.pal-import-success { font-size: 0.78rem; color: #2d7a2d; font-weight: 600; }

.btn-primary { display: inline-block; background: #c53030; color: #fff; border: 2px solid #c53030; padding: 0.6rem 1.5rem; font-size: 1rem; font-weight: 700; font-family: inherit; cursor: pointer; border-radius: 2px; transition: all 0.15s; text-decoration: none; text-align: center; }
.btn-primary:hover:not(:disabled) { background: #9b2c2c; border-color: #9b2c2c; }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.w-full { width: 100%; box-sizing: border-box; }
.mt-4 { margin-top: 1rem; }

.btn-ghost { display: inline-block; background: transparent; color: #1a1a1a; border: 2px solid #1a1a1a; padding: 0.6rem 1.5rem; font-size: 1rem; font-weight: 700; font-family: inherit; cursor: pointer; border-radius: 2px; transition: all 0.15s; text-decoration: none; text-align: center; }
.btn-ghost:hover { background: #1a1a1a; color: #fff; }

.processing-wrap { display: flex; align-items: center; justify-content: center; min-height: 60vh; width: 100%; }
.processing-card { text-align: center; background: #fff; border: 2px solid #1a1a1a; box-shadow: 6px 6px 0 #1a1a1a; border-radius: 4px; padding: 3rem 2.5rem; max-width: 420px; width: 100%; }
.processing-spinner { width: 48px; height: 48px; border: 4px solid #eee; border-top-color: #c53030; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1.5rem; }
.bar-track { height: 8px; background: #eee; border-radius: 4px; overflow: hidden; margin-top: 1rem; }
.bar-fill { height: 100%; background: #c53030; transition: width 0.3s ease; border-radius: 4px; }

.results-wrap { width: 100%; max-width: 900px; }
.results-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem; }
.t-title { font-size: 1.6rem; font-weight: 700; margin: 0; color: #1a1a1a; }
.t-sub { color: #666; margin: 0.25rem 0 0; font-size: 0.85rem; }
.results-actions-top { display: flex; gap: 0.5rem; flex-wrap: wrap; }

.selected-banner { background: #eefbee; border: 2px solid #2d7a2d; border-radius: 4px; padding: 0.75rem 1rem; margin-bottom: 1.25rem; font-size: 0.9rem; color: #2d7a2d; }
.selected-dl { color: #2d7a2d; font-weight: 700; text-decoration: underline; }

.ranked-list { display: flex; flex-direction: column; gap: 0.6rem; }
.ranked-row { display: flex; align-items: center; gap: 1rem; border: 2px solid #ddd; border-radius: 4px; padding: 0.7rem; background: #fff; transition: all 0.15s; }
.ranked-row.selected { border-color: #2d7a2d; box-shadow: 3px 3px 0 #2d7a2d; }
.rank-num { font-size: 1.15rem; font-weight: 900; color: #c53030; width: 2.4rem; text-align: center; flex-shrink: 0; }
.rank-thumb { width: 72px; height: 72px; object-fit: cover; border-radius: 3px; image-rendering: pixelated; flex-shrink: 0; }
.rank-info { flex: 1; min-width: 0; }
.rank-label { font-weight: 700; font-size: 0.92rem; color: #1a1a1a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rank-score { font-size: 0.78rem; color: #888; margin-top: 0.15rem; }
.rank-actions { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }
.rank-dl-btn { font-size: 1.1rem; text-decoration: none; padding: 0.3rem; }
.rank-pick-btn { font-size: 0.82rem; font-weight: 700; font-family: inherit; border: 2px solid #c53030; background: #fff; color: #c53030; padding: 0.4rem 0.9rem; border-radius: 2px; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
.rank-pick-btn:hover { background: #c53030; color: #fff; }

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 600px) {
  .results-header { flex-direction: column; }
  .ranked-row { flex-wrap: wrap; }
  .rank-actions { width: 100%; justify-content: flex-end; }
}
</style>
