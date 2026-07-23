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

      <button class="btn-primary w-full" :disabled="pairCount === 0 || isTraining" @click="startTraining">
        {{ isTraining ? '⏳ Training…' : '🚀 Train model on all collected data' }}
      </button>

      <div v-if="isTraining" class="training-progress">
        <div class="bar-track"><div class="bar-fill" :style="{ width: trainingPct + '%' }"></div></div>
        <p class="training-status">Epoch {{ currentEpoch }} / {{ totalEpochs }} · loss {{ currentLoss.toFixed(4) }}</p>
      </div>

      <p v-if="trainMessage" :class="['inline-msg', trainMessageType]">{{ trainMessage }}</p>
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
      currentLoss: 0,
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
  methods: {
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
        a.download = 'ditherit_training_data.json'
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
    async startTraining() {
      this.isTraining = true
      this.currentEpoch = 0
      this.currentLoss = 0
      this.trainMessage = ''
      try {
        const pairs = await getAllTrainingPairs()
        const model = buildModel()
        await trainPairwiseModel(model, pairs, {
          epochs: this.totalEpochs,
          onEpochEnd: (epoch, loss) => {
            this.currentEpoch = epoch + 1
            this.currentLoss = loss
          }
        })
        await saveModel(model)
        this.hasModel = true
        this.trainMessage = `Training complete on ${pairs.length} pairs. The model is now saved and will be used in the Dither Tournament.`
        this.trainMessageType = 'success'
      } catch (e) {
        this.trainMessage = 'Training failed: ' + e.message
        this.trainMessageType = 'error'
      } finally {
        this.isTraining = false
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
        await exportModelAsDownload(model)
        this.modelMessage = 'Model exported as ditherit-ai-ranker.json + .bin'
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
.bar-track { height: 8px; background: #eee; border-radius: 4px; overflow: hidden; }
.bar-fill { height: 100%; background: #c53030; transition: width 0.2s ease; }
.training-status { font-size: 0.78rem; color: #888; margin: 0.5rem 0 0; text-align: center; }

.inline-msg { font-size: 0.82rem; margin-top: 0.75rem; padding: 0.5rem 0.75rem; border-radius: 3px; }
.inline-msg.success { background: #eefbee; color: #2d7a2d; }
.inline-msg.error { background: #fdecea; color: #c53030; }

.info-card { background: #faf8f5; }

@media (max-width: 600px) {
  .btn-row { flex-direction: column; }
  .btn-row button, .btn-row label { width: 100%; box-sizing: border-box; }
}
</style>
