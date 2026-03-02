<template>
  <div class="blur-root">

    <!-- ===== UPLOAD ===== -->
    <div v-if="phase === 'upload'" class="blur-wrap">
      <div class="blur-card">
        <div class="blur-header">
          <nuxt-link to="/" class="back-home">← Main menu</nuxt-link>
          <div class="blur-icon">🔍</div>
          <h2 class="blur-title">Blur Studio</h2>
          <p class="blur-subtitle">Apply GIMP-style blur methods to make dithered images look smoother</p>
        </div>
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
        <div class="upload-btns">
          <button class="btn-primary mt-6" :disabled="!uploadedFile" @click="goToEditor">✨ Manual blur →</button>
          <button class="btn-tournament mt-6" :disabled="!uploadedFile" @click="goToTournament">🏆 Blur Tournament →</button>
        </div>
      </div>
    </div>

    <!-- ===== EDITOR ===== -->
    <div v-if="phase === 'editor'" class="editor-wrap">
      <div class="editor-header">
        <div>
          <h2 class="t-title">🔍 Blur Studio</h2>
          <p class="t-sub">Adjust settings and preview your blur</p>
        </div>
        <div class="editor-header-actions">
          <button class="btn-ghost small" @click="goToTournament">🏆 Try Tournament</button>
          <nuxt-link to="/" class="btn-ghost small">← Main menu</nuxt-link>
          <button class="btn-ghost small" @click="reset">New image</button>
        </div>
      </div>
      <div class="editor-body">
        <div class="controls-panel">
          <div class="control-section">
            <h4 class="control-label">Blur Method</h4>
            <div class="method-list">
              <div
                v-for="m in blurMethods" :key="m.value"
                class="method-row"
                :class="{ selected: selectedMethod === m.value }"
                @click="selectedMethod = m.value"
              >
                <div class="method-dot"></div>
                <div class="method-info">
                  <div class="method-name">{{ m.name }}</div>
                  <div class="method-desc">{{ m.desc }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="control-section">
            <h4 class="control-label">
              {{ selectedMethod === 'pixelize' ? 'Block Size' : 'Radius' }}
              <span class="control-value">{{ radius }}</span>
            </h4>
            <input type="range" v-model.number="radius" :min="selectedMethod === 'pixelize' ? 2 : 1" :max="selectedMethod === 'pixelize' ? 64 : 40" step="1" class="slider" />
          </div>
          <div v-if="selectedMethod === 'meancurvature'" class="control-section">
            <h4 class="control-label">Iterations <span class="control-value">{{ iterations }}</span></h4>
            <input type="range" v-model.number="iterations" min="1" max="20" step="1" class="slider" />
          </div>
          <button class="btn-primary w-full" :disabled="processing" @click="applyBlur">
            <span v-if="processing">Processing…</span>
            <span v-else>✨ Apply blur</span>
          </button>
          <div v-if="resultUrl" class="download-section">
            <a :href="resultUrl" :download="'blur_' + selectedMethod + '_' + fileName" class="btn-primary w-full text-center">💾 Download result</a>
            <button class="btn-ghost w-full" @click="toggleCompare">{{ comparing ? 'Show result' : '👁 Compare original' }}</button>
          </div>
        </div>
        <div class="preview-panel">
          <div class="preview-label">{{ comparing ? 'Original' : (resultUrl ? 'Result' : 'Original') }}</div>
          <div class="canvas-wrap">
            <canvas ref="outputCanvas" class="preview-canvas" :class="{ hidden: comparing || !resultUrl }"></canvas>
            <img v-if="comparing || !resultUrl" :src="previewSrc" class="preview-canvas" alt="Original" />
            <div v-if="processing" class="processing-overlay">
              <div class="processing-spinner"></div>
              <p>Applying {{ currentMethodName }}…</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== TOURNAMENT: PROCESSING ===== -->
    <div v-if="phase === 'tourProcessing'" class="processing-wrap">
      <div class="processing-card">
        <div class="processing-spinner-lg"></div>
        <h3 class="processing-title">Rendering all blur variants…</h3>
        <p class="processing-sub">{{ tourDoneCount }} / {{ tourTotalCount }} images ready</p>
        <div class="processing-bar-track">
          <div class="processing-bar-fill" :style="{ width: tourProgressPct + '%' }"></div>
        </div>
      </div>
      <!-- Off-screen canvases -->
      <div style="position:absolute;left:-9999px;top:-9999px;">
        <img ref="tourSourceImg" :src="previewSrc" alt="" @load="onTourSourceLoad" style="display:block" />
        <canvas v-for="v in tourVariants" :key="v.id" :ref="'tc_' + v.id"></canvas>
      </div>
    </div>

    <!-- ===== TOURNAMENT: BRACKET ===== -->
    <div v-if="phase === 'tournament'" class="tournament-wrap">
      <div class="tournament-header">
        <div>
          <h2 class="t-title">🏆 Blur Tournament</h2>
          <p class="t-sub">
            <template v-if="tourCurrentRound < tourTotalRounds">Round {{ tourCurrentRound }} of {{ tourTotalRounds }} · Pick your favourite</template>
            <template v-else>Final round · One will survive</template>
          </p>
        </div>
        <div class="t-header-actions">
          <nuxt-link to="/" class="btn-ghost small">← Main menu</nuxt-link>
          <button class="btn-ghost small" @click="reset">Start over</button>
        </div>
      </div>
      <div class="t-progress-track"><div class="t-progress-fill" :style="{ width: tourRoundProgressPct + '%' }"></div></div>
      <p class="t-progress-label">{{ tourMatchIndex + 1 }} of {{ tourCurrentPairs.length }} matches this round</p>

      <div v-if="tourCurrentMatch" class="match-arena">
        <div class="match-card" @click="tourPick(tourCurrentMatch[0])">
          <div class="match-label">{{ tourCurrentMatch[0].label }}</div>
          <img :src="tourCurrentMatch[0].dataUrl" class="match-img" :alt="tourCurrentMatch[0].label" />
          <div class="match-pick-btn">✓ Pick this one</div>
        </div>
        <div class="vs-badge">VS</div>
        <div class="match-card" @click="tourPick(tourCurrentMatch[1])">
          <div class="match-label">{{ tourCurrentMatch[1].label }}</div>
          <img :src="tourCurrentMatch[1].dataUrl" class="match-img" :alt="tourCurrentMatch[1].label" />
          <div class="match-pick-btn">✓ Pick this one</div>
        </div>
      </div>
    </div>

    <!-- ===== TOURNAMENT: WINNER ===== -->
    <div v-if="phase === 'tourWinner'" class="winner-wrap">
      <div class="winner-card">
        <div class="winner-crown">👑</div>
        <h2 class="winner-title">Winner!</h2>
        <p class="winner-label">{{ tourWinner.label }}</p>
        <img :src="tourWinner.dataUrl" class="winner-img" :alt="tourWinner.label" />
        <p class="winner-settings-head">Settings used:</p>
        <div class="winner-settings">
          <div class="setting-row"><span class="setting-key">Method</span><span class="setting-val">{{ tourWinner.config.methodName }}</span></div>
          <div class="setting-row"><span class="setting-key">{{ tourWinner.config.paramLabel }}</span><span class="setting-val">{{ tourWinner.config.paramValue }}</span></div>
        </div>
        <div class="winner-actions">
          <a :href="tourWinner.dataUrl" :download="'blur_winner_' + tourWinner.id + '.png'" class="btn-primary">💾 Download</a>
          <button class="btn-ghost" @click="reset">🔁 Try again</button>
          <nuxt-link to="/" class="btn-ghost">← Main menu</nuxt-link>
        </div>
      </div>

      <!-- Survivor leaderboard -->
      <div class="leaderboard-card">
        <h3 class="leaderboard-title">📊 Survivor Rankings</h3>
        <p class="leaderboard-desc">Ranked by how many rounds each blur survived.</p>
        <div class="leaderboard-list">
          <div
            v-for="(entry, i) in tourSurvivorRankings" :key="entry.id"
            class="leaderboard-row"
            :class="{ 'leaderboard-winner': i === 0 }"
          >
            <div class="lb-rank">{{ i === 0 ? '👑' : '#' + (i + 1) }}</div>
            <div class="lb-thumb-wrap">
              <a v-if="entry.dataUrl" :href="entry.dataUrl" :download="'blur_' + entry.id + '_rank' + (i+1) + '.png'" class="lb-thumb-link">
                <img :src="entry.dataUrl" class="lb-thumb" :alt="entry.label" />
                <span class="lb-thumb-dl">💾</span>
              </a>
              <div v-else class="lb-thumb-empty">—</div>
            </div>
            <div class="lb-info">
              <div class="lb-name">{{ entry.label }}</div>
              <div class="lb-rounds">Survived {{ entry.roundsSurvived }} round{{ entry.roundsSurvived !== 1 ? 's' : '' }}</div>
              <div class="lb-action-row">
                <a v-if="entry.dataUrl" :href="entry.dataUrl" :download="'blur_' + entry.id + '_rank' + (i+1) + '.png'" class="lb-dl-link">💾 Download</a>
              </div>
            </div>
            <div class="lb-bar-wrap">
              <div class="lb-bar" :style="{ width: (entry.roundsSurvived / tourTotalRounds * 100) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Long processing warning modal -->
    <div v-if="showTimeoutWarning" class="modal-overlay">
      <div class="modal-card">
        <h3 class="modal-title">⏱ Still processing…</h3>
        <p class="modal-body">The <strong>{{ pendingVariantLabel }}</strong> variant is taking longer than 30 seconds. Large images with high radius values can be slow.</p>
        <p class="modal-body">Would you like to keep waiting, or skip this variant?</p>
        <div class="modal-actions">
          <button class="btn-primary" @click="continueProcessing">Keep waiting</button>
          <button class="btn-ghost" @click="skipCurrentVariant">Skip this one</button>
        </div>
      </div>
    </div>

    <!-- Hidden source image -->
    <img ref="sourceImg" :src="previewSrc" alt="" style="display:none" @load="onSourceLoad" />
  </div>
</template>

<script>
const TOUR_VARIANTS = [
  // Gaussian: radius 1,2,4,8,16,32,40
  ...[ 1, 2, 4, 8, 16, 32, 40 ].map(r => ({
    id: 'gaussian_' + r,
    label: 'Gaussian r=' + r,
    config: { method: 'gaussian', param: r, methodName: 'Gaussian Blur', paramLabel: 'Radius', paramValue: r }
  })),
  // Lens: radius 1,2,4,8,16,32,40
  ...[ 1, 2, 4, 8, 16, 32, 40 ].map(r => ({
    id: 'lens_' + r,
    label: 'Lens r=' + r,
    config: { method: 'lens', param: r, methodName: 'Lens Blur', paramLabel: 'Radius', paramValue: r }
  })),
  // Pixelize: block size 2,4,8,16,32,64
  ...[ 2, 4, 8, 16, 32, 64 ].map(b => ({
    id: 'pixelize_' + b,
    label: 'Pixelize ' + b + 'px',
    config: { method: 'pixelize', param: b, methodName: 'Pixelize Blur', paramLabel: 'Block Size', paramValue: b }
  })),
]

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default {
  name: 'BlurStudio',
  data() {
    return {
      phase: 'upload',
      uploadedFile: null,
      previewSrc: null,
      fileName: 'image.png',
      isDragging: false,
      processing: false,
      resultUrl: null,
      comparing: false,
      sourceReady: false,
      selectedMethod: 'gaussian',
      radius: 5,
      iterations: 3,

      blurMethods: [
        { value: 'gaussian', name: 'Gaussian Blur', desc: 'Smooth, natural-looking blur. Best for softening dither grain.' },
        { value: 'lens', name: 'Lens Blur', desc: 'Simulates a camera lens out-of-focus effect with circular bokeh.' },
        { value: 'meancurvature', name: 'Mean Curvature Blur', desc: 'Edge-preserving blur. Smooths flat areas while keeping edges sharp.' },
        { value: 'pixelize', name: 'Pixelize Blur', desc: 'Divides the image into solid-colour blocks. Classic pixel art effect.' },
      ],

      // Tournament state
      tourVariants: [],
      tourContestants: [],
      tourBracket: [],
      tourWinners: [],
      tourEliminated: [],
      tourCurrentPairs: [],
      tourMatchIndex: 0,
      tourCurrentRound: 1,
      tourTotalRounds: 1,
      tourWinner: null,
      tourDoneCount: 0,
      tourTotalCount: 0,
      tourRendering: false,

      // Timeout warning
      showTimeoutWarning: false,
      pendingVariantLabel: '',
      continueProcessingFn: null,
      skipVariantFn: null,
    }
  },
  computed: {
    currentMethodName() {
      const m = this.blurMethods.find(m => m.value === this.selectedMethod)
      return m ? m.name : ''
    },
    tourProgressPct() {
      if (this.tourTotalCount === 0) return 0
      return Math.round((this.tourDoneCount / this.tourTotalCount) * 100)
    },
    tourCurrentMatch() {
      if (this.tourCurrentPairs.length === 0) return null
      return this.tourCurrentPairs[this.tourMatchIndex] || null
    },
    tourRoundProgressPct() {
      if (this.tourCurrentPairs.length === 0) return 0
      return Math.round((this.tourMatchIndex / this.tourCurrentPairs.length) * 100)
    },
    tourSurvivorRankings() {
      return this.tourContestants
        .map(c => ({ id: c.id, label: c.label, roundsSurvived: c.roundsSurvived || 0, dataUrl: c.dataUrl, config: c.config }))
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
      this.fileName = file.name
      const reader = new FileReader()
      reader.onload = ev => { this.previewSrc = ev.target.result }
      reader.readAsDataURL(file)
    },
    onSourceLoad() { this.sourceReady = true },
    goToEditor() { this.phase = 'editor' },
    toggleCompare() { this.comparing = !this.comparing },

    goToTournament() {
      this.tourVariants = TOUR_VARIANTS.slice()
      this.tourTotalCount = this.tourVariants.length
      this.tourDoneCount = 0
      this.tourRendering = false
      this.tourContestants = []
      this.tourEliminated = []
      this.tourWinner = null
      this.phase = 'tourProcessing'
      this.$nextTick(() => {
        const img = this.$refs.tourSourceImg
        if (img && img.complete) this.renderTourVariants()
      })
    },
    onTourSourceLoad() {
      if (this.phase === 'tourProcessing' && !this.tourRendering) {
        this.renderTourVariants()
      }
    },

    // Render a single variant with a 30s timeout warning for lens blur
    renderVariantWithTimeout(v, img, paletteCtx) {
      return new Promise((resolve) => {
        let timedOut = false
        let resolved = false

        const doResolve = (result) => {
          if (resolved) return
          resolved = true
          this.showTimeoutWarning = false
          resolve(result)
        }

        // Timer — warn after 30s
        const timer = setTimeout(() => {
          if (resolved) return
          timedOut = true
          this.pendingVariantLabel = v.label
          this.showTimeoutWarning = true

          this.continueProcessingFn = () => {
            // Just keep waiting — worker will resolve when done
            this.showTimeoutWarning = false
            // Set another 30s timer
            const nextTimer = setTimeout(() => {
              if (resolved) return
              this.pendingVariantLabel = v.label
              this.showTimeoutWarning = true
            }, 30000)
            this.continueProcessingFn = () => {
              this.showTimeoutWarning = false
              clearTimeout(nextTimer)
            }
          }
          this.skipVariantFn = () => {
            doResolve(null) // null = skipped
          }
        }, 30000)

        // Do the actual work async
        const work = async () => {
          const w = img.naturalWidth
          const h = img.naturalHeight
          const tmpCanvas = document.createElement('canvas')
          tmpCanvas.width = w
          tmpCanvas.height = h
          const ctx = tmpCanvas.getContext('2d')
          ctx.drawImage(img, 0, 0, w, h)
          const imageData = ctx.getImageData(0, 0, w, h)

          let result
          if (v.config.method === 'gaussian') {
            result = this.gaussianBlur(imageData, w, h, v.config.param)
          } else if (v.config.method === 'lens') {
            result = this.lensBlur(imageData, w, h, v.config.param)
          } else if (v.config.method === 'pixelize') {
            result = this.pixelizeBlur(imageData, w, h, v.config.param)
          }

          ctx.putImageData(result, 0, 0)
          const dataUrl = tmpCanvas.toDataURL('image/png')
          clearTimeout(timer)
          doResolve(dataUrl)
        }

        work()
      })
    },

    async renderTourVariants() {
      if (this.tourRendering) return
      this.tourRendering = true

      const img = this.$refs.tourSourceImg
      const contestants = []

      for (const v of this.tourVariants) {
        await new Promise(r => setTimeout(r, 10))
        if (this.phase !== 'tourProcessing') return // user navigated away

        const dataUrl = await this.renderVariantWithTimeout(v, img)

        if (dataUrl !== null) {
          contestants.push({ ...v, dataUrl, roundsSurvived: 0 })
        }
        this.tourDoneCount++
      }

      this.tourContestants = shuffle(contestants)
      this.tourEliminated = []
      this.tourSetupRound(this.tourContestants)
      this.tourTotalRounds = Math.ceil(Math.log2(this.tourContestants.length))
      this.phase = 'tournament'
    },

    tourSetupRound(pool) {
      this.tourBracket = pool.slice()
      const pairs = []
      for (let i = 0; i + 1 < this.tourBracket.length; i += 2) {
        pairs.push([this.tourBracket[i], this.tourBracket[i + 1]])
      }
      if (this.tourBracket.length % 2 === 1) {
        const bye = this.tourBracket[this.tourBracket.length - 1]
        bye.roundsSurvived++
        this.tourWinners = [bye]
      } else {
        this.tourWinners = []
      }
      this.tourCurrentPairs = pairs
      this.tourMatchIndex = 0
    },

    tourPick(chosen) {
      const pair = this.tourCurrentPairs[this.tourMatchIndex]
      const loser = pair[0] === chosen ? pair[1] : pair[0]
      chosen.roundsSurvived++
      this.tourEliminated.push(loser)
      this.tourWinners.push(chosen)
      this.tourMatchIndex++

      if (this.tourMatchIndex >= this.tourCurrentPairs.length) {
        if (this.tourWinners.length === 1) {
          this.tourWinner = this.tourWinners[0]
          this.phase = 'tourWinner'
        } else {
          this.tourCurrentRound++
          this.tourSetupRound(shuffle(this.tourWinners))
        }
      }
    },

    continueProcessing() {
      if (this.continueProcessingFn) this.continueProcessingFn()
    },
    skipCurrentVariant() {
      if (this.skipVariantFn) this.skipVariantFn()
    },

    reset() {
      this.phase = 'upload'
      this.uploadedFile = null
      this.previewSrc = null
      this.resultUrl = null
      this.comparing = false
      this.sourceReady = false
      this.radius = 5
      this.iterations = 3
      this.selectedMethod = 'gaussian'
      this.tourVariants = []
      this.tourContestants = []
      this.tourBracket = []
      this.tourWinners = []
      this.tourEliminated = []
      this.tourCurrentPairs = []
      this.tourMatchIndex = 0
      this.tourCurrentRound = 1
      this.tourTotalRounds = 1
      this.tourWinner = null
      this.tourDoneCount = 0
      this.tourTotalCount = 0
      this.tourRendering = false
      this.showTimeoutWarning = false
    },

    async applyBlur() {
      this.processing = true
      this.comparing = false
      await this.$nextTick()
      await new Promise(r => setTimeout(r, 30))
      const img = this.$refs.sourceImg
      const canvas = this.$refs.outputCanvas
      const ctx = canvas.getContext('2d')
      const w = img.naturalWidth
      const h = img.naturalHeight
      canvas.width = w
      canvas.height = h
      ctx.drawImage(img, 0, 0, w, h)
      const imageData = ctx.getImageData(0, 0, w, h)
      let result
      switch (this.selectedMethod) {
        case 'gaussian': result = this.gaussianBlur(imageData, w, h, this.radius); break
        case 'lens': result = this.lensBlur(imageData, w, h, this.radius); break
        case 'meancurvature': result = this.meanCurvatureBlur(imageData, w, h, this.iterations); break
        case 'pixelize': result = this.pixelizeBlur(imageData, w, h, this.radius); break
        default: result = imageData
      }
      ctx.putImageData(result, 0, 0)
      this.resultUrl = canvas.toDataURL('image/png')
      this.processing = false
    },

    gaussianBlur(imageData, w, h, radius) {
      let data = new Uint8ClampedArray(imageData.data)
      for (let pass = 0; pass < 3; pass++) data = this.boxBlurPass(data, w, h, radius)
      return new ImageData(data, w, h)
    },
    boxBlurPass(src, w, h, r) {
      const dst = new Uint8ClampedArray(src.length)
      const tmp = new Uint8ClampedArray(src.length)
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let rr = 0, g = 0, b = 0, a = 0, count = 0
          for (let dx = -r; dx <= r; dx++) {
            const nx = Math.min(w - 1, Math.max(0, x + dx))
            const i = (y * w + nx) * 4
            rr += src[i]; g += src[i+1]; b += src[i+2]; a += src[i+3]; count++
          }
          const i = (y * w + x) * 4
          tmp[i] = rr/count; tmp[i+1] = g/count; tmp[i+2] = b/count; tmp[i+3] = a/count
        }
      }
      for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
          let rr = 0, g = 0, b = 0, a = 0, count = 0
          for (let dy = -r; dy <= r; dy++) {
            const ny = Math.min(h - 1, Math.max(0, y + dy))
            const i = (ny * w + x) * 4
            rr += tmp[i]; g += tmp[i+1]; b += tmp[i+2]; a += tmp[i+3]; count++
          }
          const i = (y * w + x) * 4
          dst[i] = rr/count; dst[i+1] = g/count; dst[i+2] = b/count; dst[i+3] = a/count
        }
      }
      return dst
    },
    lensBlur(imageData, w, h, radius) {
      const src = imageData.data
      const dst = new Uint8ClampedArray(src.length)
      const r2 = radius * radius
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let rr = 0, g = 0, b = 0, a = 0, count = 0
          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              if (dx*dx + dy*dy <= r2) {
                const nx = Math.min(w-1, Math.max(0, x+dx))
                const ny = Math.min(h-1, Math.max(0, y+dy))
                const i = (ny * w + nx) * 4
                rr += src[i]; g += src[i+1]; b += src[i+2]; a += src[i+3]; count++
              }
            }
          }
          const i = (y * w + x) * 4
          dst[i] = rr/count; dst[i+1] = g/count; dst[i+2] = b/count; dst[i+3] = a/count
        }
      }
      return new ImageData(dst, w, h)
    },
    meanCurvatureBlur(imageData, w, h, iterations) {
      let src = new Uint8ClampedArray(imageData.data)
      for (let iter = 0; iter < iterations; iter++) {
        const dst = new Uint8ClampedArray(src.length)
        for (let y = 1; y < h-1; y++) {
          for (let x = 1; x < w-1; x++) {
            const i = (y * w + x) * 4
            for (let c = 0; c < 3; c++) {
              const center = src[i+c]
              const left = src[i - 4 + c], right = src[i + 4 + c]
              const up = src[i - w*4 + c], down = src[i + w*4 + c]
              const laplacian = left + right + up + down - 4 * center
              const gx = (right - left) / 2, gy = (down - up) / 2
              const grad = Math.sqrt(gx*gx + gy*gy) + 0.001
              dst[i+c] = Math.min(255, Math.max(0, center + 0.25 * laplacian / grad))
            }
            dst[i+3] = src[i+3]
          }
        }
        for (let x = 0; x < w; x++) {
          const top = x * 4, bot = ((h-1)*w + x) * 4
          for (let c = 0; c < 4; c++) { dst[top+c] = src[top+c]; dst[bot+c] = src[bot+c] }
        }
        for (let y = 0; y < h; y++) {
          const left = y*w*4, right = (y*w + w-1)*4
          for (let c = 0; c < 4; c++) { dst[left+c] = src[left+c]; dst[right+c] = src[right+c] }
        }
        src = dst
      }
      return new ImageData(src, w, h)
    },
    pixelizeBlur(imageData, w, h, blockSize) {
      const src = imageData.data
      const dst = new Uint8ClampedArray(src.length)
      const bs = Math.max(2, blockSize)
      for (let by = 0; by < h; by += bs) {
        for (let bx = 0; bx < w; bx += bs) {
          let rr = 0, g = 0, b = 0, a = 0, count = 0
          for (let dy = 0; dy < bs && by+dy < h; dy++) {
            for (let dx = 0; dx < bs && bx+dx < w; dx++) {
              const i = ((by+dy)*w + (bx+dx)) * 4
              rr += src[i]; g += src[i+1]; b += src[i+2]; a += src[i+3]; count++
            }
          }
          const avgR = rr/count, avgG = g/count, avgB = b/count, avgA = a/count
          for (let dy = 0; dy < bs && by+dy < h; dy++) {
            for (let dx = 0; dx < bs && bx+dx < w; dx++) {
              const i = ((by+dy)*w + (bx+dx)) * 4
              dst[i] = avgR; dst[i+1] = avgG; dst[i+2] = avgB; dst[i+3] = avgA
            }
          }
        }
      }
      return new ImageData(dst, w, h)
    },
  },
  mounted() {
    try {
      const stored = sessionStorage.getItem('blurStudio_image')
      if (stored) {
        this.previewSrc = stored
        this.uploadedFile = { name: 'from_tournament.png' }
        this.fileName = 'from_tournament.png'
        sessionStorage.removeItem('blurStudio_image')
        this.phase = 'editor'
      }
    } catch(e) {}
  }
}
</script>

<style scoped>
.blur-root {
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

/* Upload */
.blur-wrap { width: 100%; max-width: 620px; }
.blur-card { background: #fff; border: 2px solid #1a1a1a; border-radius: 4px; box-shadow: 6px 6px 0 #1a1a1a; padding: 2.5rem 2rem; }
.blur-header { text-align: center; margin-bottom: 2rem; position: relative; }
.back-home { position: absolute; left: 0; top: 0; font-size: 0.85rem; font-weight: 700; color: #1a1a1a; text-decoration: none; border-bottom: 2px solid transparent; transition: all 0.15s; }
.back-home:hover { border-color: #c53030; color: #c53030; }
.blur-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.blur-title { font-size: 2rem; font-weight: 700; letter-spacing: -0.5px; margin: 0; color: #1a1a1a; }
.blur-subtitle { color: #666; margin: 0.25rem 0 0; font-size: 0.9rem; }
.upload-zone { border: 2px dashed #bbb; border-radius: 4px; padding: 2.5rem 1.5rem; text-align: center; cursor: pointer; transition: all 0.2s; background: #faf8f5; }
.upload-zone:hover, .upload-zone.dragging { border-color: #c53030; background: #fff5f5; }
.upload-zone.has-image { border-style: solid; border-color: #1a1a1a; padding: 1rem; }
.upload-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.upload-hint { font-size: 1rem; font-weight: 600; margin: 0; color: #1a1a1a; }
.upload-sub { font-size: 0.8rem; color: #888; margin: 0.25rem 0 0; }
.upload-preview { width: 100%; height: auto; display: block; image-rendering: pixelated; }
.upload-change { font-size: 0.8rem; color: #888; margin: 0.5rem 0 0; }
.upload-btns { display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap; }
.upload-btns .btn-primary, .upload-btns .btn-tournament { flex: 1; }

/* Editor */
.editor-wrap { width: 100%; max-width: 1100px; }
.editor-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.25rem; }
.editor-header-actions { display: flex; gap: 0.5rem; flex-shrink: 0; flex-wrap: wrap; justify-content: flex-end; }
.t-title { font-size: 1.8rem; font-weight: 700; margin: 0; color: #1a1a1a; }
.t-sub { color: #666; margin: 0.25rem 0 0; font-size: 0.9rem; }
.editor-body { display: grid; grid-template-columns: 280px 1fr; gap: 1.5rem; align-items: start; }
.controls-panel { background: #fff; border: 2px solid #1a1a1a; border-radius: 4px; box-shadow: 4px 4px 0 #1a1a1a; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
.control-section { display: flex; flex-direction: column; gap: 0.5rem; }
.control-label { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #555; margin: 0; display: flex; justify-content: space-between; }
.control-value { color: #c53030; }
.method-list { display: flex; flex-direction: column; gap: 0.5rem; }
.method-row { display: flex; align-items: flex-start; gap: 0.6rem; padding: 0.6rem 0.75rem; border: 2px solid #eee; border-radius: 3px; cursor: pointer; transition: all 0.15s; background: #faf8f5; }
.method-row:hover { border-color: #c53030; }
.method-row.selected { border-color: #c53030; background: #fff5f5; }
.method-dot { width: 10px; height: 10px; border-radius: 50%; border: 2px solid #ccc; flex-shrink: 0; margin-top: 3px; transition: all 0.15s; }
.method-row.selected .method-dot { background: #c53030; border-color: #c53030; }
.method-name { font-size: 0.88rem; font-weight: 700; color: #1a1a1a; }
.method-desc { font-size: 0.75rem; color: #666; line-height: 1.4; margin-top: 0.1rem; }
.slider { width: 100%; accent-color: #c53030; }
.download-section { display: flex; flex-direction: column; gap: 0.6rem; }
.preview-panel { background: #fff; border: 2px solid #1a1a1a; border-radius: 4px; box-shadow: 4px 4px 0 #1a1a1a; overflow: hidden; }
.preview-label { background: #1a1a1a; color: #fff; font-size: 0.78rem; font-weight: 700; padding: 0.4rem 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; }
.canvas-wrap { position: relative; min-height: 200px; }
.preview-canvas { width: 100%; max-width: 100%; height: auto; display: block; image-rendering: pixelated; }
.preview-canvas.hidden { display: none; }
.processing-overlay { position: absolute; inset: 0; background: rgba(250,248,245,0.9); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; font-size: 0.9rem; color: #555; }
.processing-spinner { width: 40px; height: 40px; border: 3px solid #eee; border-top-color: #c53030; border-radius: 50%; animation: spin 0.8s linear infinite; }

/* Tournament processing */
.processing-wrap { display: flex; align-items: center; justify-content: center; min-height: 60vh; width: 100%; }
.processing-card { text-align: center; background: #fff; border: 2px solid #1a1a1a; box-shadow: 6px 6px 0 #1a1a1a; border-radius: 4px; padding: 3rem 2.5rem; max-width: 400px; width: 100%; }
.processing-spinner-lg { width: 48px; height: 48px; border: 4px solid #eee; border-top-color: #c53030; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1.5rem; }
.processing-title { font-size: 1.3rem; font-weight: 700; margin: 0 0 0.5rem; color: #1a1a1a; }
.processing-sub { color: #666; margin: 0 0 1.25rem; font-size: 0.9rem; }
.processing-bar-track { height: 8px; background: #eee; border-radius: 4px; overflow: hidden; }
.processing-bar-fill { height: 100%; background: #c53030; transition: width 0.3s ease; border-radius: 4px; }

/* Tournament bracket */
.tournament-wrap { width: 100%; max-width: 960px; }
.tournament-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1rem; }
.t-header-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
.t-progress-track { height: 6px; background: #eee; border-radius: 3px; overflow: hidden; margin-bottom: 0.35rem; }
.t-progress-fill { height: 100%; background: #c53030; transition: width 0.4s ease; }
.t-progress-label { font-size: 0.8rem; color: #999; margin: 0 0 1.5rem; }
.match-arena { display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; align-items: center; }
.match-card { border: 2px solid #ddd; border-radius: 4px; overflow: hidden; cursor: pointer; transition: all 0.18s; background: #fff; display: flex; flex-direction: column; }
.match-card:hover { border-color: #c53030; box-shadow: 4px 4px 0 #c53030; transform: translateY(-3px); }
.match-label { font-size: 0.78rem; font-weight: 700; padding: 0.5rem 0.75rem; background: #1a1a1a; color: #fff; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.match-img { width: 100%; height: auto; display: block; image-rendering: pixelated; }
.match-pick-btn { padding: 0.6rem; text-align: center; font-size: 0.85rem; font-weight: 700; color: #c53030; border-top: 1px solid #eee; transition: all 0.15s; }
.match-card:hover .match-pick-btn { background: #c53030; color: #fff; border-color: #c53030; }
.vs-badge { font-size: 1.4rem; font-weight: 900; color: #1a1a1a; text-align: center; background: #fff; border: 2px solid #1a1a1a; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 3px 3px 0 #1a1a1a; }

/* Winner */
.winner-wrap { width: 100%; max-width: 640px; display: flex; flex-direction: column; gap: 2rem; }
.winner-card { background: #fff; border: 2px solid #1a1a1a; box-shadow: 8px 8px 0 #1a1a1a; border-radius: 4px; padding: 2.5rem 2rem; text-align: center; }
.winner-crown { font-size: 3rem; margin-bottom: 0.5rem; }
.winner-title { font-size: 2.5rem; font-weight: 900; margin: 0 0 0.25rem; color: #c53030; letter-spacing: -1px; }
.winner-label { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; margin: 0 0 1.5rem; }
.winner-img { width: 100%; height: auto; display: block; margin: 0 auto 1.5rem; border: 2px solid #eee; image-rendering: pixelated; }
.winner-settings-head { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #999; margin: 0 0 0.75rem; }
.winner-settings { text-align: left; background: #faf8f5; border: 1px solid #eee; border-radius: 4px; padding: 0.75rem 1rem; margin-bottom: 1.5rem; }
.setting-row { display: flex; justify-content: space-between; padding: 0.3rem 0; border-bottom: 1px solid #eee; font-size: 0.88rem; }
.setting-row:last-child { border-bottom: none; }
.setting-key { color: #888; font-weight: 600; }
.setting-val { color: #1a1a1a; font-weight: 700; }
.winner-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

/* Leaderboard */
.leaderboard-card { background: #fff; border: 2px solid #1a1a1a; box-shadow: 6px 6px 0 #1a1a1a; border-radius: 4px; padding: 2rem; }
.leaderboard-title { font-size: 1.3rem; font-weight: 700; margin: 0 0 0.4rem; color: #1a1a1a; }
.leaderboard-desc { font-size: 0.85rem; color: #666; margin: 0 0 1.25rem; }
.leaderboard-list { display: flex; flex-direction: column; gap: 0.6rem; }
.leaderboard-row { display: grid; grid-template-columns: 2.5rem 64px 1fr 120px; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border-radius: 3px; border: 1px solid #eee; background: #faf8f5; }
.leaderboard-row.leaderboard-winner { background: #fff5f5; border-color: #c53030; }
.lb-rank { font-size: 1rem; font-weight: 900; text-align: center; color: #1a1a1a; }
.lb-thumb-wrap { width: 64px; flex-shrink: 0; position: relative; }
.lb-thumb-link { display: block; position: relative; }
.lb-thumb { width: 64px; height: 64px; object-fit: cover; display: block; border-radius: 2px; border: 1px solid #ddd; image-rendering: pixelated; }
.lb-thumb-dl { position: absolute; bottom: 2px; right: 2px; font-size: 0.7rem; background: rgba(0,0,0,0.6); color: #fff; border-radius: 2px; padding: 1px 3px; opacity: 0; transition: opacity 0.15s; }
.lb-thumb-link:hover .lb-thumb-dl { opacity: 1; }
.lb-thumb-empty { width: 64px; height: 64px; background: #f0f0f0; border-radius: 2px; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; color: #aaa; }
.lb-info { min-width: 0; }
.lb-name { font-size: 0.85rem; font-weight: 700; color: #1a1a1a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lb-rounds { font-size: 0.75rem; color: #888; }
.lb-action-row { display: flex; gap: 0.75rem; align-items: center; margin-top: 0.25rem; flex-wrap: wrap; }
.lb-dl-link { font-size: 0.75rem; color: #c53030; font-weight: 700; text-decoration: none; }
.lb-dl-link:hover { text-decoration: underline; }
.lb-bar-wrap { height: 6px; background: #eee; border-radius: 3px; overflow: hidden; }
.lb-bar { height: 100%; background: #c53030; border-radius: 3px; }

/* Timeout modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal-card { background: #fff; border: 2px solid #1a1a1a; box-shadow: 8px 8px 0 #1a1a1a; border-radius: 4px; padding: 2rem; max-width: 420px; width: 90%; }
.modal-title { font-size: 1.2rem; font-weight: 700; margin: 0 0 0.75rem; color: #1a1a1a; }
.modal-body { font-size: 0.9rem; color: #555; margin: 0 0 0.75rem; line-height: 1.5; }
.modal-actions { display: flex; gap: 0.75rem; margin-top: 1.25rem; flex-wrap: wrap; }

/* Buttons */
.btn-primary { display: inline-block; background: #c53030; color: #fff; border: 2px solid #c53030; padding: 0.6rem 1.5rem; font-size: 1rem; font-weight: 700; font-family: inherit; cursor: pointer; border-radius: 2px; transition: all 0.15s; text-decoration: none; text-align: center; }
.btn-primary:hover:not(:disabled) { background: #9b2c2c; border-color: #9b2c2c; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-ghost { display: inline-block; background: transparent; color: #1a1a1a; border: 2px solid #1a1a1a; padding: 0.6rem 1.5rem; font-size: 1rem; font-weight: 700; font-family: inherit; cursor: pointer; border-radius: 2px; transition: all 0.15s; text-decoration: none; text-align: center; }
.btn-ghost:hover { background: #1a1a1a; color: #fff; }
.btn-ghost.small { font-size: 0.8rem; padding: 0.4rem 0.9rem; }
.btn-tournament { display: inline-block; background: #1a6b8a; color: #fff; border: 2px solid #1a6b8a; padding: 0.6rem 1.5rem; font-size: 1rem; font-weight: 700; font-family: inherit; cursor: pointer; border-radius: 2px; transition: all 0.15s; text-decoration: none; text-align: center; }
.btn-tournament:hover:not(:disabled) { background: #155a75; border-color: #155a75; transform: translateY(-1px); }
.btn-tournament:disabled { opacity: 0.4; cursor: not-allowed; }
.w-full { width: 100%; box-sizing: border-box; }
.mt-6 { margin-top: 1.5rem; }

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 700px) {
  .editor-body { grid-template-columns: 1fr; }
  .editor-header { flex-direction: column; gap: 0.75rem; }
  .editor-header-actions { width: 100%; justify-content: flex-end; }
  .match-arena { grid-template-columns: 1fr; }
  .vs-badge { margin: 0 auto; }
  .tournament-header { flex-direction: column; gap: 0.75rem; }
  .t-header-actions { width: 100%; justify-content: flex-end; }
  .leaderboard-row { grid-template-columns: 2rem 48px 1fr; }
  .lb-bar-wrap { display: none; }
  .lb-thumb { width: 48px; height: 48px; }
  .lb-thumb-empty { width: 48px; height: 48px; }
  .upload-btns { flex-direction: column; }
}
</style>
