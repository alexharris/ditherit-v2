<template>
  <div class="tournament-root">

    <!-- ===================== STEP WIZARD ===================== -->
    <div v-if="phase === 'wizard'" class="wizard-wrap">
      <div class="wizard-card">
        <div class="wizard-header">
          <nuxt-link to="/" class="back-home">← Main menu</nuxt-link>
          <div class="trophy-icon">🏆</div>
          <h2 class="wizard-title">Dither Tournament</h2>
          <p class="wizard-subtitle">Find your perfect dither by elimination</p>
        </div>

        <div class="step-dots">
          <div v-for="s in totalSteps" :key="s"
            class="step-dot"
            :class="{ active: wizardStep === s, done: wizardStep > s }"
          ></div>
        </div>

        <!-- STEP 1: Upload -->
        <div v-if="wizardStep === 1" class="wizard-step">
          <h3 class="step-heading">Step 1 — Upload your image</h3>
          <div
            class="upload-zone"
            :class="{ dragging: isDragging, 'has-image': !!uploadedFile }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
            @click="$refs.fileInput.click()"
          >
            <input ref="fileInput" type="file" accept=".jpg,.jpeg,.png,.gif" class="hidden" @change="onFileChange" />
            <template v-if="!previewSrc">
              <div class="upload-icon">📁</div>
              <p class="upload-hint">Click or drag &amp; drop an image</p>
              <p class="upload-sub">JPG, PNG or GIF</p>
            </template>
            <template v-else>
              <img :src="previewSrc" class="upload-preview" alt="Preview" />
              <p class="upload-change">Click to change image</p>
            </template>
          </div>
          <button class="wiz-btn-primary mt-6" :disabled="!uploadedFile" @click="wizardStep = 2">Next →</button>
        </div>

        <!-- STEP 2: Blind or labelled -->
        <div v-if="wizardStep === 2" class="wizard-step">
          <h3 class="step-heading">Step 2 — Show algorithm names?</h3>
          <p class="step-desc">Showing names lets you learn what each algorithm looks like. Hiding them removes any bias — you pick purely on how the image looks.</p>
          <div class="mode-cards">
            <div class="mode-card" :class="{ selected: options.showLabels === true }" @click="options.showLabels = true">
              <div class="mode-icon">🏷️</div>
              <div class="mode-name">Show names</div>
              <div class="mode-desc">Algorithm name shown above each image during the bracket.</div>
            </div>
            <div class="mode-card" :class="{ selected: options.showLabels === false }" @click="options.showLabels = false">
              <div class="mode-icon">🙈</div>
              <div class="mode-name">Blind comparison</div>
              <div class="mode-desc">No names shown. Pure visual comparison, zero bias.</div>
            </div>
          </div>
          <div class="wiz-btn-row">
            <button class="wiz-btn-ghost" @click="wizardStep = 1">← Back</button>
            <button class="wiz-btn-primary" :disabled="options.showLabels === null" @click="wizardStep = 3">Next →</button>
          </div>
        </div>

        <!-- STEP 3: Dither Mode -->
        <div v-if="wizardStep === 3" class="wizard-step">
          <h3 class="step-heading">Step 3 — Dither mode</h3>
          <p class="step-desc">Which dithering style do you want to try?</p>
          <div class="mode-cards">
            <div class="mode-card" :class="{ selected: options.mode === 'error' }" @click="options.mode = 'error'">
              <div class="mode-icon">〰️</div>
              <div class="mode-name">Error Diffusion</div>
              <div class="mode-desc">Spreads quantization error to neighbours. Organic, painterly look. 11 algorithms.</div>
            </div>
            <div class="mode-card" :class="{ selected: options.mode === 'bayer' }" @click="options.mode = 'bayer'">
              <div class="mode-icon">⬛</div>
              <div class="mode-name">Bayer (Ordered)</div>
              <div class="mode-desc">Uses a threshold matrix. Structured, geometric. Classic retro feel.</div>
            </div>
            <div class="mode-card" :class="{ selected: options.mode === 'both' }" @click="options.mode = 'both'">
              <div class="mode-icon">⚡</div>
              <div class="mode-name">Both</div>
              <div class="mode-desc">All algorithms from both modes fight it out.</div>
            </div>
          </div>
          <div class="wiz-btn-row">
            <button class="wiz-btn-ghost" @click="wizardStep = 2">← Back</button>
            <button class="wiz-btn-primary" :disabled="!options.mode" @click="wizardStep = 4">Next →</button>
          </div>
        </div>

        <!-- STEP 4: Palette -->
        <div v-if="wizardStep === 4" class="wizard-step">
          <h3 class="step-heading">Step 4 — Colour palette</h3>
          <p class="step-desc">Pick the palette used during dithering.</p>
          <div class="palette-grid">
            <div
              v-for="p in paletteOptions" :key="p.value"
              class="palette-chip"
              :class="{ selected: options.palette === p.value }"
              @click="options.palette = p.value"
            >
              <div class="palette-swatches">
                <div v-for="c in p.colors.slice(0, 5)" :key="c" class="palette-swatch" :style="{ background: c }"></div>
              </div>
              <div class="palette-label">{{ p.name }}</div>
            </div>
          </div>
          <div class="wiz-btn-row">
            <button class="wiz-btn-ghost" @click="wizardStep = 3">← Back</button>
            <button class="wiz-btn-primary" :disabled="!options.palette" @click="onPaletteNext">Next →</button>
          </div>
        </div>

        <!-- STEP 5: Serpentine (error diffusion only) -->
        <div v-if="wizardStep === 5" class="wizard-step">
          <h3 class="step-heading">Step 5 — Serpentine dithering</h3>
          <p class="step-desc">Serpentine alternates the scan direction each row. Can reduce visible banding artefacts.</p>
          <div class="mode-cards">
            <div class="mode-card" :class="{ selected: options.serpentine === false }" @click="options.serpentine = false">
              <div class="mode-icon">➡️</div>
              <div class="mode-name">Off</div>
              <div class="mode-desc">Scan left to right, top to bottom.</div>
            </div>
            <div class="mode-card" :class="{ selected: options.serpentine === true }" @click="options.serpentine = true">
              <div class="mode-icon">🐍</div>
              <div class="mode-name">On</div>
              <div class="mode-desc">Snake scan — alternate direction each row.</div>
            </div>
            <div class="mode-card" :class="{ selected: options.serpentine === 'both' }" @click="options.serpentine = 'both'">
              <div class="mode-icon">🔀</div>
              <div class="mode-name">Try both</div>
              <div class="mode-desc">Include both versions in the tournament.</div>
            </div>
          </div>

          <div v-if="willProduceSingleVariant" class="single-warning">
            ⚠️ Your current options will only produce <strong>1 image</strong> — there is nothing to compare! Choose "Try both" for serpentine, or go back and pick a different dither mode.
          </div>

          <div class="wiz-btn-row">
            <button class="wiz-btn-ghost" @click="wizardStep = 4">← Back</button>
            <button class="wiz-btn-primary" :disabled="options.serpentine === null || willProduceSingleVariant" @click="startProcessing">🏁 Start tournament</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===================== PROCESSING ===================== -->
    <div v-if="phase === 'processing'" class="processing-wrap">
      <div class="processing-card">
        <div class="processing-spinner"></div>
        <h3 class="processing-title">Rendering all variants…</h3>
        <p class="processing-sub">{{ doneCount }} / {{ totalCount }} images ready</p>
        <div class="processing-bar-track">
          <div class="processing-bar-fill" :style="{ width: progressPct + '%' }"></div>
        </div>
      </div>
      <div style="position:absolute;left:-9999px;top:-9999px;">
        <img ref="sourceImg" :src="previewSrc" alt="" @load="onSourceImgLoad" style="display:block" />
        <canvas v-for="v in variants" :key="v.id" :ref="'canvas_' + v.id" :id="'tc_' + v.id"></canvas>
      </div>
    </div>

    <!-- ===================== TOURNAMENT ===================== -->
    <div v-if="phase === 'tournament'" class="tournament-wrap">
      <div class="tournament-header">
        <div>
          <h2 class="t-title">🏆 Dither Tournament</h2>
          <p class="t-sub">
            <template v-if="currentRound < totalRounds">Round {{ currentRound }} of {{ totalRounds }} · Pick your favourite</template>
            <template v-else>Final round · One will survive</template>
          </p>
        </div>
        <div class="t-header-actions">
          <nuxt-link to="/" class="wiz-btn-ghost small">← Main menu</nuxt-link>
          <button class="wiz-btn-ghost small" @click="reset">Start over</button>
        </div>
      </div>

      <div class="t-progress-track">
        <div class="t-progress-fill" :style="{ width: roundProgressPct + '%' }"></div>
      </div>
      <p class="t-progress-label">{{ matchIndex + 1 }} of {{ currentPairs.length }} matches this round</p>

      <div v-if="currentMatch" class="match-arena">
        <div class="match-card" @click="pick(currentMatch[0])">
          <div class="match-label">{{ options.showLabels ? currentMatch[0].label : 'Option A' }}</div>
          <img :src="currentMatch[0].dataUrl" class="match-img" :alt="currentMatch[0].label" />
          <div class="match-pick-btn">✓ Pick this one</div>
        </div>

        <div class="vs-badge">VS</div>

        <div class="match-card" @click="pick(currentMatch[1])">
          <div class="match-label">{{ options.showLabels ? currentMatch[1].label : 'Option B' }}</div>
          <img :src="currentMatch[1].dataUrl" class="match-img" :alt="currentMatch[1].label" />
          <div class="match-pick-btn">✓ Pick this one</div>
        </div>
      </div>
    </div>

    <!-- ===================== WINNER ===================== -->
    <div v-if="phase === 'winner'" class="winner-wrap">
      <div class="winner-card">
        <div class="winner-crown">👑</div>
        <h2 class="winner-title">Winner!</h2>
        <p class="winner-label">{{ winner.label }}</p>
        <img :src="winner.dataUrl" class="winner-img" :alt="winner.label" />
        <p class="winner-settings-head">Settings used:</p>
        <div class="winner-settings">
          <div class="setting-row"><span class="setting-key">Mode</span><span class="setting-val">{{ winner.config.mode }}</span></div>
          <div v-if="winner.config.algorithm" class="setting-row"><span class="setting-key">Algorithm</span><span class="setting-val">{{ winner.config.algorithm }}</span></div>
          <div v-if="winner.config.serpentine !== undefined" class="setting-row"><span class="setting-key">Serpentine</span><span class="setting-val">{{ winner.config.serpentine ? 'On' : 'Off' }}</span></div>
          <div class="setting-row"><span class="setting-key">Palette</span><span class="setting-val">{{ winner.config.paletteName }}</span></div>
        </div>
        <div class="winner-actions">
          <a :href="winner.dataUrl" :download="'dither_winner_' + (winner.config.algorithm || 'bayer') + '.png'" class="wiz-btn-primary">💾 Download</a>
          <button class="wiz-btn-ghost" @click="reset">🔁 Try again</button>
          <nuxt-link to="/" class="wiz-btn-ghost">← Main menu</nuxt-link>
        </div>
      </div>

      <!-- Survivor leaderboard -->
      <div class="leaderboard-card">
        <h3 class="leaderboard-title">📊 Survivor Rankings</h3>
        <p class="leaderboard-desc">Ranked by how many rounds each variant survived before being eliminated. The ones at the top were the hardest to beat.</p>
        <div class="leaderboard-list">
          <div
            v-for="(entry, i) in survivorRankings"
            :key="entry.id"
            class="leaderboard-row"
            :class="{ 'leaderboard-winner': i === 0 }"
          >
            <div class="lb-rank">{{ i === 0 ? '👑' : '#' + (i + 1) }}</div>
            <div class="lb-info">
              <div class="lb-name">{{ entry.label }}</div>
              <div class="lb-rounds">Survived {{ entry.roundsSurvived }} round{{ entry.roundsSurvived !== 1 ? 's' : '' }}</div>
            </div>
            <div class="lb-bar-wrap">
              <div class="lb-bar" :style="{ width: (entry.roundsSurvived / totalRounds * 100) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import RgbQuant from 'rgbquant'
import { bayerDither } from '~/utils/dithering'

const ERROR_ALGORITHMS = [
  'FloydSteinberg', 'Atkinson', 'Sierra24A', 'Fan', 'ShiauFan',
  'ShiauFan2', 'JarvisJudiceNinke', 'Stucki', 'Burkes', 'Sierra3', 'Sierra2'
]

const PRESET_PALETTES = [
  { name: 'Original (auto)', value: 'original', colors: ['#888', '#444', '#ccc', '#222', '#fff'] },
  { name: 'Black & White', value: 'blackwhite', colors: ['#ffffff', '#000000'] },
  { name: 'CMYK', value: 'cmyk', colors: ['#000000', '#ffff00', '#00FFFF', '#FF00FF', '#FFFFFF'] },
  { name: 'Game Boy', value: 'gameboy', colors: ['#CADC9F', '#0F380F', '#306230', '#8BAC0F', '#9BBC0F'] },
  { name: 'Red Monochrome', value: 'redmono', colors: ['#ffe3db', '#4f1403'] },
  { name: 'Blue & Yellow', value: 'blueyellow', colors: ['#134E87', '#FFF585'] },
  { name: 'Green Monochrome', value: 'greenmono', colors: ['#eeffdb', '#1d3801'] },
  { name: 'Red', value: 'red', colors: ['#ffffff', '#f46842', '#aa2f0d', '#000000'] },
  { name: 'Black White Red', value: 'bwr', colors: ['#FFFFFF', '#000000', '#FF0000'] },
  { name: 'Purple & Green', value: 'purplegreen', colors: ['#76C066', '#AD2BBB'] },
]

const PALETTE_COLORS = {
  original: null,
  blackwhite: [['#ffffff'], ['#000000']],
  cmyk: [['#000000'], ['#ffff00'], ['#00FFFF'], ['#FF00FF'], ['#FFFFFF']],
  gameboy: [['#CADC9F'], ['#0F380F'], ['#306230'], ['#8BAC0F'], ['#9BBC0F']],
  redmono: [['#ffe3db'], ['#4f1403']],
  blueyellow: [['#134E87'], ['#FFF585']],
  greenmono: [['#eeffdb'], ['#1d3801']],
  red: [['#ffffff'], ['#f46842'], ['#aa2f0d'], ['#000000']],
  bwr: [['#FFFFFF'], ['#000000'], ['#FF0000']],
  purplegreen: [['#76C066'], ['#AD2BBB']],
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null
}

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildVariants(mode, serpentineOpt) {
  const variants = []
  if (mode === 'error' || mode === 'both') {
    const serpOptions = serpentineOpt === 'both' ? [false, true] : [serpentineOpt]
    ERROR_ALGORITHMS.forEach(algo => {
      serpOptions.forEach(serp => {
        variants.push({
          id: 'err_' + algo + '_' + (serp ? 'serp' : 'noserp'),
          label: algo + (serp ? ' (serpentine)' : ''),
          config: { mode: 'Error Diffusion', algorithm: algo, serpentine: serp }
        })
      })
    })
  }
  if (mode === 'bayer' || mode === 'both') {
    variants.push({
      id: 'bayer',
      label: 'Bayer (Ordered)',
      config: { mode: 'Bayer (Ordered)' }
    })
  }
  return variants
}

export default {
  name: 'DitherTournament',
  data() {
    return {
      phase: 'wizard',
      wizardStep: 1,
      totalSteps: 5,

      uploadedFile: null,
      previewSrc: null,
      isDragging: false,
      options: {
        mode: null,
        palette: null,
        serpentine: null,
        showLabels: null,
      },

      variants: [],
      doneCount: 0,
      totalCount: 0,
      rendering: false,

      contestants: [],
      bracket: [],
      winners: [],
      eliminated: [],
      currentPairs: [],
      matchIndex: 0,
      currentRound: 1,
      totalRounds: 1,

      winner: null,
    }
  },
  computed: {
    progressPct() {
      if (this.totalCount === 0) return 0
      return Math.round((this.doneCount / this.totalCount) * 100)
    },
    currentMatch() {
      if (this.currentPairs.length === 0) return null
      return this.currentPairs[this.matchIndex] || null
    },
    roundProgressPct() {
      if (this.currentPairs.length === 0) return 0
      return Math.round((this.matchIndex / this.currentPairs.length) * 100)
    },
    paletteOptions() {
      return PRESET_PALETTES
    },
    willProduceSingleVariant() {
      if (!this.options.mode || this.options.serpentine === null) return false
      return buildVariants(this.options.mode, this.options.serpentine).length <= 1
    },
    survivorRankings() {
      return this.contestants
        .map(c => ({ id: c.id, label: c.label, roundsSurvived: c.roundsSurvived || 0 }))
        .sort((a, b) => b.roundsSurvived - a.roundsSurvived)
    }
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0]
      if (file) this.loadFile(file)
    },
    onDrop(e) {
      this.isDragging = false
      const file = e.dataTransfer.files[0]
      if (file) this.loadFile(file)
    },
    loadFile(file) {
      this.uploadedFile = file
      const reader = new FileReader()
      reader.onload = (ev) => { this.previewSrc = ev.target.result }
      reader.readAsDataURL(file)
    },
    onPaletteNext() {
      if (this.options.mode === 'bayer') {
        this.options.serpentine = false
        this.startProcessing()
      } else {
        this.wizardStep = 5
      }
    },
    async startProcessing() {
      this.phase = 'processing'
      this.rendering = false
      this.variants = buildVariants(this.options.mode, this.options.serpentine)
      this.variants.forEach(v => {
        v.config.paletteName = PRESET_PALETTES.find(p => p.value === this.options.palette)?.name || 'Original'
      })
      this.totalCount = this.variants.length
      this.doneCount = 0
      await this.$nextTick()
      if (this.$refs.sourceImg && this.$refs.sourceImg.complete) {
        await this.renderAllVariants()
      }
    },
    async onSourceImgLoad() {
      if (this.phase === 'processing' && !this.rendering) {
        await this.renderAllVariants()
      }
    },
    async renderAllVariants() {
      if (this.rendering) return
      this.rendering = true

      const img = this.$refs.sourceImg
      const w = img.naturalWidth
      const h = img.naturalHeight

      let paletteRgb = null
      if (this.options.palette !== 'original') {
        const hexColors = PALETTE_COLORS[this.options.palette]
        if (hexColors) {
          paletteRgb = hexColors.map(c => hexToRgb(Array.isArray(c) ? c[0] : c)).filter(Boolean)
        }
      }

      const contestants = []

      for (const v of this.variants) {
        await new Promise(resolve => setTimeout(resolve, 10))

        const canvasRef = this.$refs['canvas_' + v.id]
        const canvas = Array.isArray(canvasRef) ? canvasRef[0] : canvasRef
        if (!canvas) { this.doneCount++; continue }

        const ctx = canvas.getContext('2d')
        canvas.width = w
        canvas.height = h
        ctx.drawImage(img, 0, 0, w, h)

        try {
          if (v.config.mode === 'Bayer (Ordered)') {
            const imgData = ctx.getImageData(0, 0, w, h)
            const pal = paletteRgb || this.autoSamplePalette(img)
            bayerDither(ctx, imgData, pal, 1)
          } else {
            const qOpts = {
              colors: paletteRgb ? paletteRgb.length : 8,
              method: 2,
              boxSize: [8, 8],
              boxPxls: 2,
              initColors: 4096,
              minHueCols: 2000,
              dithKern: v.config.algorithm,
              dithDelta: 0,
              dithSerp: v.config.serpentine,
              reIndex: false,
              useCache: true,
              cacheFreq: 10,
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
        } catch (err) {
          // fall through
        }

        const dataUrl = canvas.toDataURL('image/png')
        contestants.push({ ...v, dataUrl, roundsSurvived: 0 })

        canvas.width = 1
        canvas.height = 1
        this.doneCount++
      }

      this.contestants = shuffle(contestants)
      this.eliminated = []
      this.setupRound(this.contestants)
      this.totalRounds = Math.ceil(Math.log2(this.contestants.length))
      this.phase = 'tournament'
    },
    autoSamplePalette(img) {
      const canvas = document.createElement('canvas')
      canvas.width = 16; canvas.height = 16
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, 16, 16)
      const data = ctx.getImageData(0, 0, 16, 16).data
      const colors = []
      for (let i = 0; i < data.length; i += 64) {
        colors.push([data[i], data[i + 1], data[i + 2]])
      }
      return colors.slice(0, 16)
    },
    setupRound(pool) {
      this.bracket = pool.slice()
      const pairs = []
      for (let i = 0; i + 1 < this.bracket.length; i += 2) {
        pairs.push([this.bracket[i], this.bracket[i + 1]])
      }
      if (this.bracket.length % 2 === 1) {
        const bye = this.bracket[this.bracket.length - 1]
        bye.roundsSurvived++
        this.winners = [bye]
      } else {
        this.winners = []
      }
      this.currentPairs = pairs
      this.matchIndex = 0
    },
    freeLoser(loser) {
      if (loser && loser.dataUrl) {
        loser.dataUrl = null
      }
    },
    pick(chosen) {
      const pair = this.currentPairs[this.matchIndex]
      const loser = pair[0] === chosen ? pair[1] : pair[0]

      chosen.roundsSurvived++
      this.eliminated.push(loser)
      this.freeLoser(loser)

      this.winners.push(chosen)
      this.matchIndex++

      if (this.matchIndex >= this.currentPairs.length) {
        if (this.winners.length === 1) {
          this.winner = this.winners[0]
          this.phase = 'winner'
          this.purgeAllExcept(this.winner)
        } else {
          this.currentRound++
          this.setupRound(shuffle(this.winners))
        }
      }
    },
    purgeAllExcept(keep) {
      this.contestants.forEach(c => {
        if (c !== keep) this.freeLoser(c)
      })
    },
    purgeAll() {
      this.contestants.forEach(c => this.freeLoser(c))
      if (this.winner) this.freeLoser(this.winner)
      this.winners.forEach(c => this.freeLoser(c))
      if (this.variants) {
        this.variants.forEach(v => {
          const ref = this.$refs ? this.$refs['canvas_' + v.id] : null
          const canvas = Array.isArray(ref) ? ref[0] : ref
          if (canvas) { canvas.width = 1; canvas.height = 1 }
        })
      }
      this.previewSrc = null
    },
    reset() {
      this.purgeAll()
      this.phase = 'wizard'
      this.wizardStep = 1
      this.uploadedFile = null
      this.previewSrc = null
      this.options = { mode: null, palette: null, serpentine: null, showLabels: null }
      this.variants = []
      this.doneCount = 0
      this.totalCount = 0
      this.rendering = false
      this.contestants = []
      this.bracket = []
      this.winners = []
      this.eliminated = []
      this.currentPairs = []
      this.matchIndex = 0
      this.currentRound = 1
      this.totalRounds = 1
      this.winner = null
    }
  },
  beforeDestroy() {
    this.purgeAll()
  }
}
</script>

<style scoped>
.tournament-root {
  font-family: 'Georgia', serif;
  min-height: 100vh;
  background: #faf8f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem 1rem;
  gap: 2rem;
}

.wizard-wrap { width: 100%; max-width: 680px; }
.wizard-card {
  background: #fff;
  border: 2px solid #1a1a1a;
  border-radius: 4px;
  box-shadow: 6px 6px 0 #1a1a1a;
  padding: 2.5rem 2rem;
}
.wizard-header { text-align: center; margin-bottom: 2rem; position: relative; }
.back-home {
  position: absolute; left: 0; top: 0;
  font-size: 0.85rem; font-weight: 700; color: #1a1a1a;
  text-decoration: none; border-bottom: 2px solid transparent; transition: all 0.15s;
}
.back-home:hover { border-color: #c53030; color: #c53030; }
.trophy-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.wizard-title { font-size: 2rem; font-weight: 700; letter-spacing: -0.5px; margin: 0; color: #1a1a1a; }
.wizard-subtitle { color: #666; margin: 0.25rem 0 0; font-size: 0.9rem; }

.step-dots { display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 2rem; }
.step-dot { width: 10px; height: 10px; border-radius: 50%; background: #ddd; transition: all 0.2s; }
.step-dot.active { background: #c53030; transform: scale(1.3); }
.step-dot.done { background: #1a1a1a; }

.wizard-step { display: flex; flex-direction: column; gap: 1rem; }
.step-heading { font-size: 1.3rem; font-weight: 700; margin: 0; color: #1a1a1a; }
.step-desc { color: #555; margin: 0; font-size: 0.95rem; }

.upload-zone {
  border: 2px dashed #bbb; border-radius: 4px; padding: 2.5rem 1.5rem;
  text-align: center; cursor: pointer; transition: all 0.2s; background: #faf8f5;
}
.upload-zone:hover, .upload-zone.dragging { border-color: #c53030; background: #fff5f5; }
.upload-zone.has-image { border-style: solid; border-color: #1a1a1a; padding: 1rem; }
.upload-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.upload-hint { font-size: 1rem; font-weight: 600; margin: 0; color: #1a1a1a; }
.upload-sub { font-size: 0.8rem; color: #888; margin: 0.25rem 0 0; }
.upload-preview { max-width: 100%; max-height: 220px; object-fit: contain; display: block; margin: 0 auto; }
.upload-change { font-size: 0.8rem; color: #888; margin: 0.5rem 0 0; }

.mode-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; }
.mode-card {
  border: 2px solid #ddd; border-radius: 4px; padding: 1.25rem 1rem;
  cursor: pointer; transition: all 0.15s; text-align: center; background: #fff;
}
.mode-card:hover { border-color: #c53030; transform: translateY(-2px); }
.mode-card.selected { border-color: #c53030; background: #fff5f5; box-shadow: 3px 3px 0 #c53030; }
.mode-icon { font-size: 1.8rem; margin-bottom: 0.5rem; }
.mode-name { font-weight: 700; font-size: 0.95rem; margin-bottom: 0.35rem; color: #1a1a1a; }
.mode-desc { font-size: 0.78rem; color: #666; line-height: 1.4; }

.palette-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.75rem; max-height: 340px; overflow-y: auto;
}
.palette-chip { border: 2px solid #ddd; border-radius: 4px; padding: 0.6rem; cursor: pointer; transition: all 0.15s; background: #fff; }
.palette-chip:hover { border-color: #c53030; }
.palette-chip.selected { border-color: #c53030; box-shadow: 3px 3px 0 #c53030; }
.palette-swatches { display: flex; height: 20px; border-radius: 2px; overflow: hidden; margin-bottom: 0.4rem; }
.palette-swatch { flex: 1; }
.palette-label { font-size: 0.75rem; font-weight: 600; color: #1a1a1a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.single-warning {
  background: #fff3cd; border: 2px solid #f0ad4e; border-radius: 4px;
  padding: 0.85rem 1rem; font-size: 0.9rem; color: #856404; line-height: 1.5;
}

.wiz-btn-primary {
  display: inline-block; background: #c53030; color: #fff; border: 2px solid #c53030;
  padding: 0.6rem 1.5rem; font-size: 1rem; font-weight: 700; font-family: inherit;
  cursor: pointer; border-radius: 2px; transition: all 0.15s; text-decoration: none; text-align: center;
}
.wiz-btn-primary:hover:not(:disabled) { background: #9b2c2c; border-color: #9b2c2c; transform: translateY(-1px); }
.wiz-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

.wiz-btn-ghost {
  display: inline-block; background: transparent; color: #1a1a1a; border: 2px solid #1a1a1a;
  padding: 0.6rem 1.5rem; font-size: 1rem; font-weight: 700; font-family: inherit;
  cursor: pointer; border-radius: 2px; transition: all 0.15s; text-decoration: none; text-align: center;
}
.wiz-btn-ghost:hover { background: #1a1a1a; color: #fff; }
.wiz-btn-ghost.small { font-size: 0.8rem; padding: 0.4rem 0.9rem; }

.wiz-btn-row { display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; }
.mt-6 { margin-top: 1.5rem; }

.processing-wrap { display: flex; align-items: center; justify-content: center; min-height: 60vh; width: 100%; }
.processing-card {
  text-align: center; background: #fff; border: 2px solid #1a1a1a;
  box-shadow: 6px 6px 0 #1a1a1a; border-radius: 4px; padding: 3rem 2.5rem; max-width: 400px; width: 100%;
}
.processing-spinner {
  width: 48px; height: 48px; border: 4px solid #eee; border-top-color: #c53030;
  border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1.5rem;
}
@keyframes spin { to { transform: rotate(360deg); } }
.processing-title { font-size: 1.3rem; font-weight: 700; margin: 0 0 0.5rem; color: #1a1a1a; }
.processing-sub { color: #666; margin: 0 0 1.25rem; font-size: 0.9rem; }
.processing-bar-track { height: 8px; background: #eee; border-radius: 4px; overflow: hidden; }
.processing-bar-fill { height: 100%; background: #c53030; transition: width 0.3s ease; border-radius: 4px; }

.tournament-wrap { width: 100%; max-width: 960px; }
.tournament-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1rem; }
.t-header-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
.t-title { font-size: 1.8rem; font-weight: 700; margin: 0; color: #1a1a1a; }
.t-sub { color: #666; margin: 0.25rem 0 0; font-size: 0.9rem; }
.t-progress-track { height: 6px; background: #eee; border-radius: 3px; overflow: hidden; margin-bottom: 0.35rem; }
.t-progress-fill { height: 100%; background: #c53030; transition: width 0.4s ease; }
.t-progress-label { font-size: 0.8rem; color: #999; margin: 0 0 1.5rem; }

.match-arena { display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; align-items: center; }
.match-card {
  border: 2px solid #ddd; border-radius: 4px; overflow: hidden; cursor: pointer;
  transition: all 0.18s; background: #fff; display: flex; flex-direction: column;
}
.match-card:hover { border-color: #c53030; box-shadow: 4px 4px 0 #c53030; transform: translateY(-3px); }
.match-label { font-size: 0.78rem; font-weight: 700; padding: 0.5rem 0.75rem; background: #1a1a1a; color: #fff; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.match-img { width: 100%; display: block; object-fit: contain; max-height: 420px; image-rendering: pixelated; }
.match-pick-btn { padding: 0.6rem; text-align: center; font-size: 0.85rem; font-weight: 700; color: #c53030; border-top: 1px solid #eee; transition: all 0.15s; }
.match-card:hover .match-pick-btn { background: #c53030; color: #fff; border-color: #c53030; }
.vs-badge {
  font-size: 1.4rem; font-weight: 900; color: #1a1a1a; text-align: center;
  background: #fff; border: 2px solid #1a1a1a; border-radius: 50%;
  width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; box-shadow: 3px 3px 0 #1a1a1a;
}

.winner-wrap { width: 100%; max-width: 640px; display: flex; flex-direction: column; gap: 2rem; }
.winner-card {
  background: #fff; border: 2px solid #1a1a1a; box-shadow: 8px 8px 0 #1a1a1a;
  border-radius: 4px; padding: 2.5rem 2rem; text-align: center;
}
.winner-crown { font-size: 3rem; margin-bottom: 0.5rem; }
.winner-title { font-size: 2.5rem; font-weight: 900; margin: 0 0 0.25rem; color: #c53030; letter-spacing: -1px; }
.winner-label { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; margin: 0 0 1.5rem; }
.winner-img { max-width: 100%; max-height: 360px; object-fit: contain; display: block; margin: 0 auto 1.5rem; border: 2px solid #eee; image-rendering: pixelated; }
.winner-settings-head { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #999; margin: 0 0 0.75rem; }
.winner-settings { text-align: left; background: #faf8f5; border: 1px solid #eee; border-radius: 4px; padding: 0.75rem 1rem; margin-bottom: 1.5rem; }
.setting-row { display: flex; justify-content: space-between; padding: 0.3rem 0; border-bottom: 1px solid #eee; font-size: 0.88rem; }
.setting-row:last-child { border-bottom: none; }
.setting-key { color: #888; font-weight: 600; }
.setting-val { color: #1a1a1a; font-weight: 700; }
.winner-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

.leaderboard-card {
  background: #fff; border: 2px solid #1a1a1a; box-shadow: 6px 6px 0 #1a1a1a;
  border-radius: 4px; padding: 2rem;
}
.leaderboard-title { font-size: 1.3rem; font-weight: 700; margin: 0 0 0.4rem; color: #1a1a1a; }
.leaderboard-desc { font-size: 0.85rem; color: #666; margin: 0 0 1.25rem; }
.leaderboard-list { display: flex; flex-direction: column; gap: 0.6rem; }
.leaderboard-row {
  display: grid; grid-template-columns: 2.5rem 1fr 120px;
  align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem;
  border-radius: 3px; border: 1px solid #eee; background: #faf8f5;
}
.leaderboard-row.leaderboard-winner { background: #fff5f5; border-color: #c53030; }
.lb-rank { font-size: 1rem; font-weight: 900; text-align: center; color: #1a1a1a; }
.lb-info { min-width: 0; }
.lb-name { font-size: 0.85rem; font-weight: 700; color: #1a1a1a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lb-rounds { font-size: 0.75rem; color: #888; }
.lb-bar-wrap { height: 6px; background: #eee; border-radius: 3px; overflow: hidden; }
.lb-bar { height: 100%; background: #c53030; border-radius: 3px; }

@media (max-width: 600px) {
  .match-arena { grid-template-columns: 1fr; }
  .vs-badge { margin: 0 auto; }
  .tournament-header { flex-direction: column; gap: 0.75rem; }
  .t-header-actions { width: 100%; justify-content: flex-end; }
  .wiz-btn-row { flex-direction: column-reverse; gap: 0.75rem; }
  .wiz-btn-primary, .wiz-btn-ghost { width: 100%; text-align: center; }
  .leaderboard-row { grid-template-columns: 2rem 1fr; }
  .lb-bar-wrap { display: none; }
}
</style>
