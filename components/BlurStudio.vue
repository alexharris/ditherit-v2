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

        <button class="btn-primary mt-6" :disabled="!uploadedFile" @click="goToEditor">
          Next — Choose blur →
        </button>
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
          <nuxt-link to="/" class="btn-ghost small">← Main menu</nuxt-link>
          <button class="btn-ghost small" @click="reset">New image</button>
        </div>
      </div>

      <div class="editor-body">
        <!-- Controls -->
        <div class="controls-panel">

          <!-- Blur method -->
          <div class="control-section">
            <h4 class="control-label">Blur Method</h4>
            <div class="method-list">
              <div
                v-for="m in blurMethods"
                :key="m.value"
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

          <!-- Radius / strength -->
          <div class="control-section">
            <h4 class="control-label">
              {{ selectedMethod === 'pixelize' ? 'Block Size' : 'Radius' }}
              <span class="control-value">{{ radius }}</span>
            </h4>
            <input
              type="range"
              v-model.number="radius"
              :min="selectedMethod === 'pixelize' ? 2 : 1"
              :max="selectedMethod === 'pixelize' ? 64 : 40"
              step="1"
              class="slider"
            />
          </div>

          <!-- Iterations (mean curvature only) -->
          <div v-if="selectedMethod === 'meancurvature'" class="control-section">
            <h4 class="control-label">Iterations <span class="control-value">{{ iterations }}</span></h4>
            <input type="range" v-model.number="iterations" min="1" max="20" step="1" class="slider" />
          </div>

          <button class="btn-primary w-full" :disabled="processing" @click="applyBlur">
            <span v-if="processing">Processing…</span>
            <span v-else>✨ Apply blur</span>
          </button>

          <div v-if="resultUrl" class="download-section">
            <a :href="resultUrl" :download="'blur_' + selectedMethod + '_' + fileName" class="btn-primary w-full text-center">
              💾 Download result
            </a>
            <button class="btn-ghost w-full" @click="toggleCompare">
              {{ comparing ? 'Show result' : '👁 Compare original' }}
            </button>
          </div>

          <div class="control-section">
            <h4 class="control-label">Preview Zoom</h4>
            <div class="zoom-controls">
              <button class="zoom-pill" :class="{ active: imageZoom === 1 }" @click="imageZoom = 1">1x</button>
              <button class="zoom-pill" :class="{ active: imageZoom === 2 }" @click="imageZoom = 2">2x</button>
              <button class="zoom-pill" :class="{ active: imageZoom === 4 }" @click="imageZoom = 4">4x</button>
              <button class="zoom-pill" :class="{ active: imageZoom === 8 }" @click="imageZoom = 8">8x</button>
            </div>
          </div>
        </div>

        <!-- Canvas preview -->
        <div class="preview-panel">
          <div class="preview-label">{{ comparing ? 'Original' : (resultUrl ? 'Result' : 'Original') }}</div>
          <div class="canvas-wrap">
            <canvas ref="outputCanvas" class="preview-canvas" :class="{ hidden: comparing || !resultUrl }" :style="{ width: (imageZoom * 100) + '%', imageRendering: 'pixelated' }"></canvas>
            <img v-if="comparing || !resultUrl" :src="previewSrc" class="preview-canvas" :style="{ width: (imageZoom * 100) + '%', imageRendering: 'pixelated' }" alt="Original" />
            <div v-if="processing" class="processing-overlay">
              <div class="processing-spinner"></div>
              <p>Applying {{ currentMethodName }}…</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden source image -->
    <img ref="sourceImg" :src="previewSrc" alt="" style="display:none" @load="onSourceLoad" />
  </div>
</template>

<script>
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

      imageZoom: 1,
      blurMethods: [
        {
          value: 'gaussian',
          name: 'Gaussian Blur',
          desc: 'Smooth, natural-looking blur. Best for softening dither grain.',
        },
        {
          value: 'lens',
          name: 'Lens Blur',
          desc: 'Simulates a camera lens out-of-focus effect with circular bokeh.',
        },
        {
          value: 'meancurvature',
          name: 'Mean Curvature Blur',
          desc: 'Edge-preserving blur. Smooths flat areas while keeping edges sharp.',
        },
        {
          value: 'pixelize',
          name: 'Pixelize Blur',
          desc: 'Divides the image into solid-colour blocks. Classic pixel art effect.',
        },
      ],
    }
  },
  computed: {
    currentMethodName() {
      const m = this.blurMethods.find(m => m.value === this.selectedMethod)
      return m ? m.name : ''
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
    onSourceLoad() {
      this.sourceReady = true
    },
    goToEditor() {
      this.phase = 'editor'
    },
    toggleCompare() {
      this.comparing = !this.comparing
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
      this.imageZoom = 1
    },

    async applyBlur() {
      this.processing = true
      this.comparing = false
      await this.$nextTick()
      // Small delay so spinner renders
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
        case 'gaussian':
          result = this.gaussianBlur(imageData, w, h, this.radius)
          break
        case 'lens':
          result = this.lensBlur(imageData, w, h, this.radius)
          break
        case 'meancurvature':
          result = this.meanCurvatureBlur(imageData, w, h, this.iterations)
          break
        case 'pixelize':
          result = this.pixelizeBlur(imageData, w, h, this.radius)
          break
        default:
          result = imageData
      }

      ctx.putImageData(result, 0, 0)
      this.resultUrl = canvas.toDataURL('image/png')
      this.processing = false
    },

    // ─── Gaussian blur via repeated box blur passes (fast approximation) ───
    gaussianBlur(imageData, w, h, radius) {
      let data = new Uint8ClampedArray(imageData.data)
      // 3 passes of box blur approximates Gaussian
      for (let pass = 0; pass < 3; pass++) {
        data = this.boxBlurPass(data, w, h, radius)
      }
      return new ImageData(data, w, h)
    },

    boxBlurPass(src, w, h, r) {
      const dst = new Uint8ClampedArray(src.length)
      // Horizontal
      const tmp = new Uint8ClampedArray(src.length)
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let rr = 0, g = 0, b = 0, a = 0, count = 0
          for (let dx = -r; dx <= r; dx++) {
            const nx = Math.min(w - 1, Math.max(0, x + dx))
            const i = (y * w + nx) * 4
            rr += src[i]; g += src[i+1]; b += src[i+2]; a += src[i+3]
            count++
          }
          const i = (y * w + x) * 4
          tmp[i] = rr/count; tmp[i+1] = g/count; tmp[i+2] = b/count; tmp[i+3] = a/count
        }
      }
      // Vertical
      for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
          let rr = 0, g = 0, b = 0, a = 0, count = 0
          for (let dy = -r; dy <= r; dy++) {
            const ny = Math.min(h - 1, Math.max(0, y + dy))
            const i = (ny * w + x) * 4
            rr += tmp[i]; g += tmp[i+1]; b += tmp[i+2]; a += tmp[i+3]
            count++
          }
          const i = (y * w + x) * 4
          dst[i] = rr/count; dst[i+1] = g/count; dst[i+2] = b/count; dst[i+3] = a/count
        }
      }
      return dst
    },

    // ─── Lens blur — circular disk kernel (bokeh feel) ───
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
                rr += src[i]; g += src[i+1]; b += src[i+2]; a += src[i+3]
                count++
              }
            }
          }
          const i = (y * w + x) * 4
          dst[i] = rr/count; dst[i+1] = g/count; dst[i+2] = b/count; dst[i+3] = a/count
        }
      }
      return new ImageData(dst, w, h)
    },

    // ─── Mean curvature blur — edge-preserving smoothing ───
    meanCurvatureBlur(imageData, w, h, iterations) {
      let src = new Uint8ClampedArray(imageData.data)

      for (let iter = 0; iter < iterations; iter++) {
        const dst = new Uint8ClampedArray(src.length)
        for (let y = 1; y < h-1; y++) {
          for (let x = 1; x < w-1; x++) {
            const i = (y * w + x) * 4
            for (let c = 0; c < 3; c++) {
              const center = src[i+c]
              const left   = src[i - 4 + c]
              const right  = src[i + 4 + c]
              const up     = src[i - w*4 + c]
              const down   = src[i + w*4 + c]

              // Laplacian
              const laplacian = left + right + up + down - 4 * center

              // Gradient magnitude (simple finite diff)
              const gx = (right - left) / 2
              const gy = (down - up) / 2
              const grad = Math.sqrt(gx*gx + gy*gy) + 0.001

              // Mean curvature flow step
              dst[i+c] = Math.min(255, Math.max(0, center + 0.25 * laplacian / grad))
            }
            dst[i+3] = src[i+3]
          }
        }
        // Copy border pixels unchanged
        for (let x = 0; x < w; x++) {
          const top = x * 4
          const bot = ((h-1)*w + x) * 4
          for (let c = 0; c < 4; c++) { dst[top+c] = src[top+c]; dst[bot+c] = src[bot+c] }
        }
        for (let y = 0; y < h; y++) {
          const left = y*w*4
          const right = (y*w + w-1)*4
          for (let c = 0; c < 4; c++) { dst[left+c] = src[left+c]; dst[right+c] = src[right+c] }
        }
        src = dst
      }
      return new ImageData(src, w, h)
    },

    // ─── Pixelize — solid colour blocks ───
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
              rr += src[i]; g += src[i+1]; b += src[i+2]; a += src[i+3]
              count++
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
}

/* ── Upload ── */
.blur-wrap { width: 100%; max-width: 620px; }
.blur-card {
  background: #fff;
  border: 2px solid #1a1a1a;
  border-radius: 4px;
  box-shadow: 6px 6px 0 #1a1a1a;
  padding: 2.5rem 2rem;
}
.blur-header { text-align: center; margin-bottom: 2rem; position: relative; }
.back-home {
  position: absolute; left: 0; top: 0;
  font-size: 0.85rem; font-weight: 700; color: #1a1a1a;
  text-decoration: none; border-bottom: 2px solid transparent; transition: all 0.15s;
}
.back-home:hover { border-color: #c53030; color: #c53030; }
.blur-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.blur-title { font-size: 2rem; font-weight: 700; letter-spacing: -0.5px; margin: 0; color: #1a1a1a; }
.blur-subtitle { color: #666; margin: 0.25rem 0 0; font-size: 0.9rem; }

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

/* ── Editor ── */
.editor-wrap { width: 100%; max-width: 1100px; }
.editor-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 1.25rem;
}
.editor-header-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
.t-title { font-size: 1.8rem; font-weight: 700; margin: 0; color: #1a1a1a; }
.t-sub { color: #666; margin: 0.25rem 0 0; font-size: 0.9rem; }

.editor-body {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1.5rem;
  align-items: start;
}

/* Controls */
.controls-panel {
  background: #fff;
  border: 2px solid #1a1a1a;
  border-radius: 4px;
  box-shadow: 4px 4px 0 #1a1a1a;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.control-section { display: flex; flex-direction: column; gap: 0.5rem; }
.control-label {
  font-size: 0.78rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.5px; color: #555; margin: 0; display: flex; justify-content: space-between;
}
.control-value { color: #c53030; }

.method-list { display: flex; flex-direction: column; gap: 0.5rem; }
.method-row {
  display: flex; align-items: flex-start; gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  border: 2px solid #eee; border-radius: 3px;
  cursor: pointer; transition: all 0.15s; background: #faf8f5;
}
.method-row:hover { border-color: #c53030; }
.method-row.selected { border-color: #c53030; background: #fff5f5; }
.method-dot {
  width: 10px; height: 10px; border-radius: 50%;
  border: 2px solid #ccc; flex-shrink: 0; margin-top: 3px; transition: all 0.15s;
}
.method-row.selected .method-dot { background: #c53030; border-color: #c53030; }
.method-name { font-size: 0.88rem; font-weight: 700; color: #1a1a1a; }
.method-desc { font-size: 0.75rem; color: #666; line-height: 1.4; margin-top: 0.1rem; }

.slider { width: 100%; accent-color: #c53030; }

.download-section { display: flex; flex-direction: column; gap: 0.6rem; }

/* Preview */
.preview-panel {
  background: #fff;
  border: 2px solid #1a1a1a;
  border-radius: 4px;
  box-shadow: 4px 4px 0 #1a1a1a;
  overflow: hidden;
}
.preview-label {
  background: #1a1a1a; color: #fff;
  font-size: 0.78rem; font-weight: 700;
  padding: 0.4rem 0.75rem;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.canvas-wrap { position: relative; min-height: 200px; overflow: auto; display: flex; align-items: flex-start; justify-content: flex-start; }
.preview-canvas { display: block; image-rendering: pixelated; transition: width 0.2s; min-width: 100%; }
.preview-canvas.hidden { display: none; }
.zoom-controls { display: flex; gap: 0.4rem; }
.zoom-pill { flex: 1; padding: 0.35rem 0; font-size: 0.8rem; font-weight: 700; font-family: inherit; border: 2px solid #ddd; border-radius: 2px; background: #fff; cursor: pointer; transition: all 0.15s; }
.zoom-pill:hover { border-color: #c53030; color: #c53030; }
.zoom-pill.active { background: #c53030; border-color: #c53030; color: #fff; }

.processing-overlay {
  position: absolute; inset: 0;
  background: rgba(250,248,245,0.9);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 0.75rem; font-size: 0.9rem; color: #555;
}
.processing-spinner {
  width: 40px; height: 40px;
  border: 3px solid #eee; border-top-color: #c53030;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Buttons */
.btn-primary {
  display: inline-block; background: #c53030; color: #fff;
  border: 2px solid #c53030; padding: 0.6rem 1.5rem;
  font-size: 1rem; font-weight: 700; font-family: inherit;
  cursor: pointer; border-radius: 2px; transition: all 0.15s;
  text-decoration: none; text-align: center;
}
.btn-primary:hover:not(:disabled) { background: #9b2c2c; border-color: #9b2c2c; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-ghost {
  display: inline-block; background: transparent; color: #1a1a1a;
  border: 2px solid #1a1a1a; padding: 0.6rem 1.5rem;
  font-size: 1rem; font-weight: 700; font-family: inherit;
  cursor: pointer; border-radius: 2px; transition: all 0.15s;
  text-decoration: none; text-align: center;
}
.btn-ghost:hover { background: #1a1a1a; color: #fff; }
.btn-ghost.small { font-size: 0.8rem; padding: 0.4rem 0.9rem; }
.w-full { width: 100%; box-sizing: border-box; }
.mt-6 { margin-top: 1.5rem; }

/* Responsive */
@media (max-width: 700px) {
  .editor-body { grid-template-columns: 1fr; }
  .editor-header { flex-direction: column; gap: 0.75rem; }
  .editor-header-actions { width: 100%; justify-content: flex-end; }
}
</style>
