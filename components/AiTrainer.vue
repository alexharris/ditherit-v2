<template>
  <div class="trainer-root">
    <div class="page-header">
      <nuxt-link to="/" class="back-home">← Main menu</nuxt-link>
      <div class="page-icon">🤖</div>
      <h2 class="page-title">AI Dither Trainer</h2>
      <p class="page-subtitle">Train a personal model from your bracket tournament picks — then let it rank dithering options for new images</p>
    </div>

    <!-- Training data status -->
    <div class="trainer-card">
      <h3 class="card-title">📊 Training data</h3>
      <p class="card-desc">
        Every time you pick a winner in a Dither Tournament match (in the normal Dither Tournament or inside Batch Dither), that choice is quietly logged here as a training example. No images are stored — only small numeric descriptions of the image and the settings used.
      </p>
      <div class="stat-row">
        <div class="stat-box">
          <div class="stat-number">{{ pairCount }}</div>
          <div class="stat-label">training pairs collected</div>
        </div>
      </div>
      <div class="btn-row">
        <button class="btn-ghost" @click="refreshCount">🔄 Refresh count</button>
        <button class="btn-ghost danger" @click="confirmClearData">🗑️ Clear all training data</button>
      </div>
    </div>

    <!-- Export / Import training data -->
    <div class="trainer-card">
      <h3 class="card-title">💾 Backup training data</h3>
      <p class="card-desc">Save your collected picks as a JSON file, or load previously exported picks (useful when moving machines or rebuilding your Docker container).</p>
      <div class="btn-row">
        <button class="btn-primary-outline" :disabled="pairCount === 0" @click="exportData">📤 Export training data</button>
        <label class="btn-primary-outline file-btn">
          📥 Import training data
          <input ref="dataFileInput" type="file" accept=".json" class="hidden" @change="importData" />
        </label>
      </div>
      <p v-if="dataMessage" :class="['inline-msg', dataMessageType]">{{ dataMessage }}</p>
    </div>

    <!-- Train model -->
    <div class="trainer-card">
      <h3 class="card-title">🎯 Train the model</h3>
      <p class="card-desc">Trains entirely in your browser — nothing is uploaded anywhere. A few hundred pairs is enough to get useful rankings; more picks across more varied images will make it better over time.</p>

      <div v-if="pairCount < 20" class="warning-box">
        ⚠️ You have {{ pairCount }} training pair{{ pairCount !== 1 ? 's' : '' }}. At least 20-30 is recommended before training, ideally across several different source images, or the model will just guess.
      </div>

      <div v-if="!isTraining" class="epoch-input-row">
        <label class="epoch-label" for="epochInput">Number of epochs:</label>
        <input
          id="epochInput"
          type="number"
          min="1"
          max="2000"
          v-model.number="requestedEpochs"
          class="epoch-input"
        />
        <span class="epoch-hint">more epochs = longer training, potentially better fit (or overfitting if too high with little data)</span>
      </div>

      <div class="btn-row">
        <button class="btn-primary" :disabled="pairCount === 0 || isTraining" @click="startTraining">
          {{ isTraining ? '⏳ Training…' : '🚀 Train model on all collected data' }}
        </button>
        <button v-if="isTraining" class="btn-ghost danger" @click="requestStopTraining">
          ⏹️ Stop training
        </button>
      </div>

      <div v-if="isTraining" class="training-progress">
        <div class="bar-track"><div class="bar-fill" :style="{ width: trainingPct + '%' }"></div></div>
        <p class="training-status">Epoch {{ currentEpoch }} / {{ totalEpochs }} · loss {{ currentLoss.toFixed(4) }} · elapsed {{ formatDurationDHMS(trainingElapsedSeconds) }}</p>

        <div v-if="showLongTrainingWarning" class="long-training-warning">
          ⚠️ This training session has been running for 23 hours, 55 minutes. For safety it will automatically stop now and save whatever has been trained so far — the same as if you had clicked Stop &amp; save.
        </div>

        <div class="loss-chart-wrap">
          <canvas ref="lossChartCanvas" class="loss-chart-canvas"></canvas>
          <div class="loss-chart-legend">
            <span class="legend-item"><span class="legend-swatch loss-line"></span> Loss per epoch</span>
            <span class="legend-item"><span class="legend-swatch loss-margin"></span> Margin target (0 = ideal)</span>
          </div>
        </div>
      </div>

      <!-- Stop confirmation dialog -->
      <div v-if="showStopConfirm" class="stop-confirm-overlay">
        <div class="stop-confirm-card">
          <h4 class="stop-confirm-title">Stop training?</h4>
          <p class="stop-confirm-text">
            Training will stop after the current epoch finishes (currently on epoch {{ currentEpoch }} of {{ totalEpochs }}).
          </p>
          <p class="stop-confirm-text">
            Do you want to save the model as trained so far ({{ currentEpoch }} epoch{{ currentEpoch !== 1 ? 's' : '' }}), or discard this training run entirely?
          </p>
          <div class="stop-confirm-actions">
            <button class="btn-primary-outline" @click="confirmStop(true)">💾 Stop &amp; save progress</button>
            <button class="btn-ghost danger" @click="confirmStop(false)">🗑️ Stop &amp; discard</button>
            <button class="btn-ghost" @click="showStopConfirm = false">Cancel — keep training</button>
          </div>
        </div>
      </div>

      <p v-if="trainMessage" :class="['inline-msg', trainMessageType]">{{ trainMessage }}</p>

      <div v-if="pendingCsvExport" class="csv-export-row">
        <button class="btn-primary-outline" @click="downloadPendingCsv">📄 Download session CSV log</button>
        <button class="btn-ghost small" @click="dismissPendingCsv">✕ Dismiss</button>
      </div>
    </div>

    <!-- Model status / export / import -->
    <div class="trainer-card">
      <h3 class="card-title">📦 Model</h3>
      <div class="stat-row">
        <div class="model-status" :class="{ ready: hasModel }">
          {{ hasModel ? '✅ Model trained and ready' : '⭕ No trained model yet' }}
        </div>
      </div>
      <div class="btn-row">
        <button class="btn-primary-outline" :disabled="!hasModel" @click="exportModel">📤 Export model file</button>
        <label class="btn-primary-outline file-btn">
          📥 Import model file
          <input ref="modelJsonInput" type="file" accept=".json" class="hidden" @change="onModelJsonSelected" />
        </label>
      </div>
      <p class="card-desc small-note">Exporting produces two files (model.json + weights.bin). When importing, select the .json file first — you'll then be asked for the matching .bin file.</p>
      <input ref="modelWeightsInput" type="file" accept=".bin" class="hidden" @change="onModelWeightsSelected" />
      <p v-if="modelMessage" :class="['inline-msg', modelMessageType]">{{ modelMessage }}</p>
      <button v-if="hasModel" class="btn-ghost danger mt-2" @click="confirmDeleteModel">🗑️ Delete trained model</button>
    </div>

    <div class="trainer-card info-card">
      <h3 class="card-title">ℹ️ How this works</h3>
      <p class="card-desc">
        The model doesn't look at raw pixels directly — it learns from a small set of measurements (brightness, contrast, edge detail, colour saturation) taken from each source image, paired with which dithering settings you preferred for images with similar characteristics.
      </p>
      <p class="card-desc">
        Once trained, go to the Dither Tournament and your ranked predictions will appear automatically — highest predicted score first — so you can use it as a starting point rather than a rule.
      </p>
    </div>
  </div>
</template>

<script>
import {
  getTrainingPairCount,
  getAllTrainingPairs,
  clearAllTrainingPairs,
  importTrainingPairs,
  exportTrainingPairsAsJson,
} from '~/utils/aiTrainingStore'
import {
  buildModel,
  trainPairwiseModel,
  saveModel,
  loadModel,
  hasStoredModel,
  deleteStoredModel,
  exportModelAsDownload,
  importModelFromFiles,
} from '~/utils/aiRankerModel'

export default {
  name: 'AiTrainer',
  data() {
    return {
      pairCount: 0,
      hasModel: false,
      isTraining: false,
      currentEpoch: 0,
      totalEpochs: 30,
      requestedEpochs: 30,
      showStopConfirm: false,
      _cancelToken: null,
      _pendingSaveDecision: false,
      currentLoss: 0,
      lossHistory: [],
      pendingCsvExport: null,
      trainingElapsedSeconds: 0,
      showLongTrainingWarning: false,
      _trainingTimerInterval: null,
      dataMessage: '',
      dataMessageType: 'success',
      trainMessage: '',
      trainMessageType: 'success',
      modelMessage: '',
      modelMessageType: 'success',
      pendingModelJson: null,
    }
  },
  computed: {
    trainingPct() {
      return this.totalEpochs === 0 ? 0 : Math.round((this.currentEpoch / this.totalEpochs) * 100)
    }
  },
  async mounted() {
    await this.refreshCount()
    this.hasModel = await hasStoredModel()
  },
  beforeDestroy() {
    if (this._trainingTimerInterval) {
      clearInterval(this._trainingTimerInterval)
      this._trainingTimerInterval = null
    }
  },
  methods: {
    // Formats a Date as "y/m/d h:m:s" using the given getter functions
    // (either the UTC getters or the local getters), with no external
    // date library — keeps this dependency-free and avoids any risk of
    // regex-related build issues.
    _formatDateParts(date, useUtc) {
      const pad = (n) => String(n).padStart(2, '0')
      const year = useUtc ? date.getUTCFullYear() : date.getFullYear()
      const month = pad((useUtc ? date.getUTCMonth() : date.getMonth()) + 1)
      const day = pad(useUtc ? date.getUTCDate() : date.getDate())
      const hours = pad(useUtc ? date.getUTCHours() : date.getHours())
      const minutes = pad(useUtc ? date.getUTCMinutes() : date.getMinutes())
      const seconds = pad(useUtc ? date.getUTCSeconds() : date.getSeconds())
      return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
    },
    _localUtcOffsetLabel(date) {
      // getTimezoneOffset() returns minutes BEHIND UTC (so positive = west of UTC,
      // e.g. EDT/-4:00 returns +240). Flip sign to get the conventional "-4:00" style label.
      const offsetMinutes = -date.getTimezoneOffset()
      const sign = offsetMinutes >= 0 ? '+' : '-'
      const abs = Math.abs(offsetMinutes)
      const hours = String(Math.floor(abs / 60)).padStart(2, '0')
      const minutes = String(abs % 60).padStart(2, '0')
      return `${sign}${hours}:${minutes}`
    },
    formatUtcTimestamp(date) {
      return `${this._formatDateParts(date, true)} UTC`
    },
    formatLocalTimestamp(date) {
      return `${this._formatDateParts(date, false)} ${this._localUtcOffsetLabel(date)}`
    },
    // Filesystem-safe UTC timestamp for filenames, e.g. "20260609123456utc"
    // (YYYYMMDDHHMMSS + "utc", no separators, so it's valid across
    // Windows/Mac/Linux filename restrictions).
    filenameUtcStamp(date) {
      const pad = (n) => String(n).padStart(2, '0')
      const year = date.getUTCFullYear()
      const month = pad(date.getUTCMonth() + 1)
      const day = pad(date.getUTCDate())
      const hours = pad(date.getUTCHours())
      const minutes = pad(date.getUTCMinutes())
      const seconds = pad(date.getUTCSeconds())
      return `${year}${month}${day}${hours}${minutes}${seconds}utc`
    },
    drawLossChart() {
      const canvas = this.$refs.lossChartCanvas
      if (!canvas) return
      const history = this.lossHistory
      if (history.length === 0) return

      // Match canvas backing resolution to its displayed CSS size for crisp lines
      const displayWidth = canvas.clientWidth || 600
      const displayHeight = canvas.clientHeight || 160
      canvas.width = displayWidth
      canvas.height = displayHeight

      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, displayWidth, displayHeight)

      const paddingLeft = 42
      const paddingRight = 12
      const paddingTop = 12
      const paddingBottom = 22
      const plotWidth = displayWidth - paddingLeft - paddingRight
      const plotHeight = displayHeight - paddingTop - paddingBottom

      const losses = history.map(h => h.loss)
      const maxLoss = Math.max(...losses, 1.0) // include margin target (1.0) in scale
      const minLoss = 0 // loss is never negative with hinge loss

      const xForEpoch = (epochIndex) => {
        if (history.length === 1) return paddingLeft + plotWidth / 2
        return paddingLeft + (epochIndex / (history.length - 1)) * plotWidth
      }
      const yForLoss = (loss) => {
        const t = (loss - minLoss) / (maxLoss - minLoss || 1)
        return paddingTop + (1 - t) * plotHeight
      }

      // Axes
      ctx.strokeStyle = '#ddd'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(paddingLeft, paddingTop)
      ctx.lineTo(paddingLeft, paddingTop + plotHeight)
      ctx.lineTo(paddingLeft + plotWidth, paddingTop + plotHeight)
      ctx.stroke()

      // Y-axis labels (min, mid, max)
      ctx.fillStyle = '#888'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      ;[0, maxLoss / 2, maxLoss].forEach(val => {
        const y = yForLoss(val)
        ctx.fillText(val.toFixed(2), paddingLeft - 6, y)
      })

      // X-axis labels (first, mid, last epoch)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      const labelEpochs = history.length <= 2
        ? history.map(h => h.epoch)
        : [history[0].epoch, history[Math.floor(history.length / 2)].epoch, history[history.length - 1].epoch]
      labelEpochs.forEach(ep => {
        const idx = history.findIndex(h => h.epoch === ep)
        const x = xForEpoch(idx)
        ctx.fillText('ep ' + ep, x, paddingTop + plotHeight + 4)
      })

      // Margin target reference line (loss = 1.0, since margin=1.0 means "not separated at all")
      if (maxLoss >= 1.0) {
        ctx.strokeStyle = '#f0ad4e'
        ctx.setLineDash([4, 4])
        ctx.lineWidth = 1
        const marginY = yForLoss(1.0)
        ctx.beginPath()
        ctx.moveTo(paddingLeft, marginY)
        ctx.lineTo(paddingLeft + plotWidth, marginY)
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Loss line
      ctx.strokeStyle = '#c53030'
      ctx.lineWidth = 2
      ctx.beginPath()
      history.forEach((h, i) => {
        const x = xForEpoch(i)
        const y = yForLoss(h.loss)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()

      // Dot on the most recent point
      const lastIdx = history.length - 1
      const lastX = xForEpoch(lastIdx)
      const lastY = yForLoss(history[lastIdx].loss)
      ctx.fillStyle = '#c53030'
      ctx.beginPath()
      ctx.arc(lastX, lastY, 3, 0, Math.PI * 2)
      ctx.fill()
    },
    // Formats a duration given in whole seconds as "days:hours:minutes:seconds",
    // e.g. 90065 seconds -> "1:01:01:05". Always shows all four components,
    // zero-padded except the leading (days) component.
    formatDurationDHMS(totalSeconds) {
      const days = Math.floor(totalSeconds / 86400)
      const hours = Math.floor((totalSeconds % 86400) / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = Math.floor(totalSeconds % 60)
      const pad = (n) => String(n).padStart(2, '0')
      return `${days}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    },
    // Builds the CSV text and stores it (plus a suggested filename) on
    // this.pendingCsvExport, WITHOUT triggering any download. The user
    // must click the "Download session CSV" button that appears once
    // this is set, so a finished/stopped training run never silently
    // overwrites a previously downloaded file in their Downloads folder.
    buildTrainingSessionCsv({ sessionStartedAt, sessionStoppedAt, requestedEpochs, epochsCompleted, pairCount, wasCancelled, stoppedEarlyAtEpoch, autoStoppedAt24h }) {
      const durationSeconds = Math.max(0, Math.round((sessionStoppedAt.getTime() - sessionStartedAt.getTime()) / 1000))
      const durationDHMS = this.formatDurationDHMS(durationSeconds)

      const lines = []
      lines.push('Dither it! — AI Trainer session log')
      lines.push('')
      lines.push(`Session started (UTC),${this.formatUtcTimestamp(sessionStartedAt)}`)
      lines.push(`Session started (local),${this.formatLocalTimestamp(sessionStartedAt)}`)
      lines.push(`Session stopped (UTC),${this.formatUtcTimestamp(sessionStoppedAt)}`)
      lines.push(`Session stopped (local),${this.formatLocalTimestamp(sessionStoppedAt)}`)
      lines.push(`Training duration (seconds),${durationSeconds}`)
      lines.push(`Training duration (days:hours:minutes:seconds),${durationDHMS}`)
      lines.push(`Requested epochs,${requestedEpochs}`)
      lines.push(`Epochs actually trained,${epochsCompleted}`)
      lines.push(`Training pairs used,${pairCount}`)
      lines.push(`Stopped early by user,${wasCancelled ? 'Yes' : 'No'}`)
      if (wasCancelled) {
        lines.push(`Stopped at epoch,${stoppedEarlyAtEpoch}`)
        lines.push(`Stopped at (UTC),${this.formatUtcTimestamp(sessionStoppedAt)}`)
        lines.push(`Stopped at (local),${this.formatLocalTimestamp(sessionStoppedAt)}`)
      }
      lines.push(`Auto-stopped at 23h55m safety limit,${autoStoppedAt24h ? 'Yes' : 'No'}`)
      lines.push('')
      lines.push('epoch,loss')
      this.lossHistory.forEach(h => {
        lines.push(`${h.epoch},${h.loss}`)
      })

      const csvContent = lines.join('\n')
      const stamp = this.filenameUtcStamp(sessionStartedAt)
      const filename = `ditherit_training_session_${stamp}.csv`

      this.pendingCsvExport = { content: csvContent, filename }
    },
    downloadPendingCsv() {
      if (!this.pendingCsvExport) return
      const blob = new Blob([this.pendingCsvExport.content], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = this.pendingCsvExport.filename
      a.click()
      URL.revokeObjectURL(url)
    },
    dismissPendingCsv() {
      this.pendingCsvExport = null
    },
    async refreshCount() {
      try {
        this.pairCount = await getTrainingPairCount()
      } catch (e) {
        this.pairCount = 0
      }
    },
    confirmClearData() {
      if (confirm('Delete all collected training pairs? This cannot be undone. Your trained model (if any) will not be affected.')) {
        this.clearData()
      }
    },
    async clearData() {
      await clearAllTrainingPairs()
      await this.refreshCount()
      this.dataMessage = 'All training data cleared.'
      this.dataMessageType = 'success'
    },
    async exportData() {
      try {
        const json = await exportTrainingPairsAsJson()
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const stamp = this.filenameUtcStamp(new Date())
        a.download = `ditherit_training_data_${stamp}.json`
        a.click()
        URL.revokeObjectURL(url)
        this.dataMessage = 'Training data exported.'
        this.dataMessageType = 'success'
      } catch (e) {
        this.dataMessage = 'Export failed: ' + e.message
        this.dataMessageType = 'error'
      }
    },
    importData(e) {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = async (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result)
          const pairs = parsed.pairs || parsed
          if (!Array.isArray(pairs)) throw new Error('Unrecognised file format')
          await importTrainingPairs(pairs)
          await this.refreshCount()
          this.dataMessage = `Imported ${pairs.length} training pairs.`
          this.dataMessageType = 'success'
        } catch (err) {
          this.dataMessage = 'Import failed: ' + err.message
          this.dataMessageType = 'error'
        }
      }
      reader.readAsText(file)
      e.target.value = ''
    },
    requestStopTraining() {
      this.showStopConfirm = true
    },
    confirmStop(saveProgress) {
      this._pendingSaveDecision = saveProgress
      this.showStopConfirm = false
      if (this._cancelToken) {
        this._cancelToken.cancelled = true
      }
      // Training loop notices the cancel flag after the current epoch finishes;
      // startTraining()'s finally/then block handles save-vs-discard from here.
    },
    async startTraining() {
      this.isTraining = true
      this.currentEpoch = 0
      this.currentLoss = 0
      this.lossHistory = []
      this.trainMessage = ''
      this.pendingCsvExport = null
      this.trainingElapsedSeconds = 0
      this.showLongTrainingWarning = false
      this.totalEpochs = Math.max(1, Math.min(2000, this.requestedEpochs || 30))
      this._cancelToken = { cancelled: false }

      const sessionStartedAt = new Date()
      let sessionStoppedAt = null
      let stoppedEarlyAtEpoch = null
      let autoStoppedAt24h = false

      // Safety limit: 23 hours, 55 minutes, 0 seconds — matches the request
      // exactly. Past this point training auto-stops (same code path as the
      // user clicking Stop) and whatever has been trained so far is saved,
      // exactly as if the user had stopped it themselves.
      const SAFETY_LIMIT_SECONDS = (23 * 3600) + (55 * 60)
      const WARNING_THRESHOLD_SECONDS = SAFETY_LIMIT_SECONDS // warning fires at the same crossing point

      this.$nextTick(() => this.drawLossChart())

      this._trainingTimerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - sessionStartedAt.getTime()) / 1000)
        this.trainingElapsedSeconds = elapsed

        if (elapsed >= WARNING_THRESHOLD_SECONDS && !this.showLongTrainingWarning) {
          this.showLongTrainingWarning = true
        }

        if (elapsed >= SAFETY_LIMIT_SECONDS && this._cancelToken && !this._cancelToken.cancelled) {
          autoStoppedAt24h = true
          this._pendingSaveDecision = true // auto-stop always saves progress, same as a user choosing to save
          this._cancelToken.cancelled = true
        }
      }, 1000)

      try {
        const pairs = await getAllTrainingPairs()
        const model = buildModel()
        const { model: trainedModel, epochsCompleted, wasCancelled } = await trainPairwiseModel(model, pairs, {
          epochs: this.totalEpochs,
          cancelToken: this._cancelToken,
          onEpochEnd: (epoch, loss) => {
            this.currentEpoch = epoch + 1
            this.currentLoss = loss
            this.lossHistory.push({ epoch: epoch + 1, loss })
            this.$nextTick(() => this.drawLossChart())
          }
        })

        sessionStoppedAt = new Date()

        if (wasCancelled) {
          stoppedEarlyAtEpoch = epochsCompleted
          if (autoStoppedAt24h) {
            await saveModel(trainedModel)
            this.hasModel = true
            this.trainMessage = `Training automatically stopped after reaching the 23h55m safety limit at epoch ${epochsCompleted} of ${this.totalEpochs} (on ${pairs.length} pairs). Progress has been saved.`
            this.trainMessageType = 'success'
          } else if (this._pendingSaveDecision) {
            await saveModel(trainedModel)
            this.hasModel = true
            this.trainMessage = `Training stopped early and saved after ${epochsCompleted} of ${this.totalEpochs} epochs (on ${pairs.length} pairs).`
            this.trainMessageType = 'success'
          } else {
            this.trainMessage = `Training stopped after ${epochsCompleted} epochs and discarded. No changes were saved.`
            this.trainMessageType = 'success'
          }
        } else {
          await saveModel(trainedModel)
          this.hasModel = true
          this.trainMessage = `Training complete on ${pairs.length} pairs (${epochsCompleted} epochs). The model is now saved and will be used in the Dither Tournament and AI Ranker.`
          this.trainMessageType = 'success'
        }

        this.buildTrainingSessionCsv({
          sessionStartedAt,
          sessionStoppedAt,
          requestedEpochs: this.totalEpochs,
          epochsCompleted,
          pairCount: pairs.length,
          wasCancelled,
          stoppedEarlyAtEpoch,
          autoStoppedAt24h,
        })
      } catch (e) {
        this.trainMessage = 'Training failed: ' + e.message
        this.trainMessageType = 'error'
      } finally {
        this.isTraining = false
        this.showStopConfirm = false
        this.showLongTrainingWarning = false
        this._cancelToken = null
        this._pendingSaveDecision = false
        if (this._trainingTimerInterval) {
          clearInterval(this._trainingTimerInterval)
          this._trainingTimerInterval = null
        }
      }
    },
    confirmDeleteModel() {
      if (confirm('Delete the trained model? Your training data pairs will not be affected — you can retrain any time.')) {
        this.deleteModel()
      }
    },
    async deleteModel() {
      await deleteStoredModel()
      this.hasModel = false
      this.modelMessage = 'Model deleted.'
      this.modelMessageType = 'success'
    },
    async exportModel() {
      try {
        const model = await loadModel()
        if (!model) throw new Error('No model found to export')
        const stamp = this.filenameUtcStamp(new Date())
        await exportModelAsDownload(model, stamp)
        this.modelMessage = `Model exported as ditherit-ai-ranker_${stamp}.json + .bin`
        this.modelMessageType = 'success'
      } catch (e) {
        this.modelMessage = 'Export failed: ' + e.message
        this.modelMessageType = 'error'
      }
    },
    onModelJsonSelected(e) {
      const file = e.target.files[0]
      if (!file) return
      this.pendingModelJson = file
      this.modelMessage = 'Now select the matching .bin weights file.'
      this.modelMessageType = 'success'
      this.$refs.modelWeightsInput.click()
    },
    async onModelWeightsSelected(e) {
      const weightsFile = e.target.files[0]
      if (!weightsFile || !this.pendingModelJson) return
      try {
        await importModelFromFiles(this.pendingModelJson, weightsFile)
        this.hasModel = true
        this.modelMessage = 'Model imported successfully.'
        this.modelMessageType = 'success'
      } catch (err) {
        this.modelMessage = 'Import failed: ' + err.message
        this.modelMessageType = 'error'
      } finally {
        this.pendingModelJson = null
        e.target.value = ''
      }
    }
  }
}
</script>

<style scoped>
.trainer-root {
  font-family: 'Georgia', serif;
  min-height: 100vh;
  background: #faf8f5;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
.page-header { text-align: center; position: relative; width: 100%; max-width: 700px; margin-bottom: 0.5rem; }
.back-home { position: absolute; left: 0; top: 0; font-size: 0.85rem; font-weight: 700; color: #1a1a1a; text-decoration: none; border-bottom: 2px solid transparent; }
.back-home:hover { border-color: #c53030; color: #c53030; }
.page-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.page-title { font-size: 2rem; font-weight: 700; margin: 0; color: #1a1a1a; }
.page-subtitle { color: #666; font-size: 0.9rem; margin: 0.35rem 0 0; max-width: 480px; margin-left: auto; margin-right: auto; }

.trainer-card { background: #fff; border: 2px solid #1a1a1a; border-radius: 4px; box-shadow: 5px 5px 0 #1a1a1a; padding: 1.75rem; width: 100%; max-width: 700px; }
.card-title { font-size: 1.1rem; font-weight: 700; margin: 0 0 0.75rem; color: #1a1a1a; }
.card-desc { font-size: 0.85rem; color: #555; line-height: 1.5; margin: 0 0 1rem; }
.small-note { font-size: 0.75rem; color: #888; margin-top: 0.75rem; }

.stat-row { display: flex; justify-content: center; margin-bottom: 1rem; }
.stat-box { text-align: center; }
.stat-number { font-size: 2.5rem; font-weight: 900; color: #c53030; line-height: 1; }
.stat-label { font-size: 0.8rem; color: #888; margin-top: 0.25rem; }

.model-status { font-size: 1rem; font-weight: 700; color: #888; padding: 0.5rem 1rem; border-radius: 4px; background: #f5f5f5; }
.model-status.ready { color: #2d7a2d; background: #eefbee; }

.btn-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.warning-box { background: #fff8e1; border: 2px solid #f0ad4e; border-radius: 4px; padding: 0.75rem; font-size: 0.85rem; color: #856404; margin-bottom: 1rem; line-height: 1.4; }
.epoch-input-row { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1rem; flex-wrap: wrap; }
.epoch-label { font-size: 0.85rem; font-weight: 700; color: #1a1a1a; }
.epoch-input { width: 80px; padding: 0.4rem 0.5rem; font-size: 0.9rem; font-family: inherit; border: 2px solid #ddd; border-radius: 3px; text-align: center; }
.epoch-input:focus { outline: none; border-color: #c53030; }
.epoch-hint { font-size: 0.75rem; color: #888; flex: 1; min-width: 180px; }

.stop-confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
.stop-confirm-card { background: #fff; border: 2px solid #1a1a1a; border-radius: 4px; box-shadow: 6px 6px 0 #1a1a1a; padding: 1.75rem; max-width: 420px; width: 100%; }
.stop-confirm-title { font-size: 1.2rem; font-weight: 700; margin: 0 0 0.75rem; color: #1a1a1a; }
.stop-confirm-text { font-size: 0.88rem; color: #555; line-height: 1.5; margin: 0 0 0.75rem; }
.stop-confirm-actions { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; }
.stop-confirm-actions button { width: 100%; box-sizing: border-box; }

.btn-primary { display: inline-block; background: #c53030; color: #fff; border: 2px solid #c53030; padding: 0.65rem 1.5rem; font-size: 1rem; font-weight: 700; font-family: inherit; cursor: pointer; border-radius: 2px; transition: all 0.15s; text-align: center; }
.btn-primary:hover:not(:disabled) { background: #9b2c2c; border-color: #9b2c2c; }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-primary.w-full { width: 100%; }

.btn-primary-outline { display: inline-block; background: #fff; color: #c53030; border: 2px solid #c53030; padding: 0.5rem 1.1rem; font-size: 0.85rem; font-weight: 700; font-family: inherit; cursor: pointer; border-radius: 2px; transition: all 0.15s; text-align: center; }
.btn-primary-outline:hover:not(:disabled) { background: #c53030; color: #fff; }
.btn-primary-outline:disabled { opacity: 0.4; cursor: not-allowed; }
.file-btn { position: relative; }

.btn-ghost { display: inline-block; background: transparent; color: #1a1a1a; border: 2px solid #1a1a1a; padding: 0.5rem 1.1rem; font-size: 0.85rem; font-weight: 700; font-family: inherit; cursor: pointer; border-radius: 2px; transition: all 0.15s; }
.btn-ghost:hover { background: #1a1a1a; color: #fff; }
.btn-ghost.danger { border-color: #c53030; color: #c53030; }
.btn-ghost.danger:hover { background: #c53030; color: #fff; }
.mt-2 { margin-top: 0.75rem; }

.training-progress { margin-top: 1rem; }
.long-training-warning { background: #fdecea; border: 2px solid #c53030; border-radius: 4px; padding: 0.75rem; font-size: 0.85rem; color: #c53030; margin: 0.75rem 0; line-height: 1.4; font-weight: 600; }
.csv-export-row { display: flex; gap: 0.6rem; align-items: center; margin-top: 0.75rem; flex-wrap: wrap; }
.btn-ghost.small { font-size: 0.78rem; padding: 0.4rem 0.9rem; }
.bar-track { height: 8px; background: #eee; border-radius: 4px; overflow: hidden; }
.bar-fill { height: 100%; background: #c53030; transition: width 0.2s ease; }
.training-status { font-size: 0.78rem; color: #888; margin: 0.5rem 0 0; text-align: center; }
.loss-chart-wrap { margin-top: 1rem; border: 1px solid #eee; border-radius: 4px; padding: 0.75rem; background: #fcfcfc; }
.loss-chart-canvas { width: 100%; height: 160px; display: block; }
.loss-chart-legend { display: flex; gap: 1.25rem; justify-content: center; margin-top: 0.5rem; flex-wrap: wrap; }
.legend-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; color: #666; }
.legend-swatch { display: inline-block; width: 18px; height: 3px; border-radius: 2px; }
.legend-swatch.loss-line { background: #c53030; }
.legend-swatch.loss-margin { background: #f0ad4e; background-image: repeating-linear-gradient(to right, #f0ad4e 0, #f0ad4e 4px, transparent 4px, transparent 8px); }

.inline-msg { font-size: 0.82rem; margin-top: 0.75rem; padding: 0.5rem 0.75rem; border-radius: 3px; }
.inline-msg.success { background: #eefbee; color: #2d7a2d; }
.inline-msg.error { background: #fdecea; color: #c53030; }

.info-card { background: #faf8f5; }

@media (max-width: 600px) {
  .btn-row { flex-direction: column; }
  .btn-row button, .btn-row label { width: 100%; box-sizing: border-box; }
}
</style>
