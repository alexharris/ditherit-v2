// Small TensorFlow.js model that learns to score a (image, candidate)
// pair. Trained via pairwise ranking: given a winner's features and a
// loser's features (same source image), push winner's predicted score
// above loser's predicted score.
//
// The model is tiny by design — a few hundred to a few thousand
// training pairs is plenty, and it should train in a few seconds
// entirely in the browser.

import * as tf from '@tensorflow/tfjs'
import { TOTAL_FEATURE_SIZE } from './aiFeatures'

const MODEL_STORAGE_KEY = 'indexeddb://ditherit-ai-ranker'

export function buildModel() {
  const model = tf.sequential()
  model.add(tf.layers.dense({ inputShape: [TOTAL_FEATURE_SIZE], units: 24, activation: 'relu' }))
  model.add(tf.layers.dense({ units: 12, activation: 'relu' }))
  model.add(tf.layers.dense({ units: 1, activation: 'linear' }))
  return model
}

// Trains using a pairwise ranking loss: for each (winnerVec, loserVec)
// pair, minimise max(0, margin - (score(winner) - score(loser))).
// This is implemented manually since tf.js doesn't ship a built-in
// ranking loss, using a custom training loop with tf.tidy for memory safety.
export async function trainPairwiseModel(model, pairs, options = {}) {
  const {
    epochs = 30,
    batchSize = 16,
    margin = 1.0,
    learningRate = 0.01,
    onEpochEnd = null,
  } = options

  if (pairs.length === 0) throw new Error('No training pairs provided')

  const winnerVecs = pairs.map(p => [...p.imageFeatures, ...p.winnerFeatures])
  const loserVecs = pairs.map(p => [...p.imageFeatures, ...p.loserFeatures])

  const optimizer = tf.train.adam(learningRate)

  for (let epoch = 0; epoch < epochs; epoch++) {
    let epochLoss = 0
    let batches = 0

    // Shuffle indices each epoch
    const indices = Array.from({ length: pairs.length }, (_, i) => i)
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }

    for (let b = 0; b < indices.length; b += batchSize) {
      const batchIdx = indices.slice(b, b + batchSize)
      const wBatch = batchIdx.map(idx => winnerVecs[idx])
      const lBatch = batchIdx.map(idx => loserVecs[idx])

      const lossVal = optimizer.minimize(() => {
        return tf.tidy(() => {
          const wTensor = tf.tensor2d(wBatch)
          const lTensor = tf.tensor2d(lBatch)
          const wScore = model.apply(wTensor)
          const lScore = model.apply(lTensor)
          const diff = tf.sub(wScore, lScore)
          const marginTensor = tf.scalar(margin)
          const hinge = tf.relu(tf.sub(marginTensor, diff))
          return tf.mean(hinge)
        })
      }, true)

      epochLoss += await lossVal.data().then(d => d[0])
      lossVal.dispose()
      batches++
    }

    if (onEpochEnd) {
      onEpochEnd(epoch, epochLoss / Math.max(1, batches))
    }
    // Yield to the browser so the UI can update progress
    await new Promise(r => setTimeout(r, 0))
  }

  return model
}

export function predictScores(model, imageFeatures, candidateFeatureList) {
  return tf.tidy(() => {
    const vecs = candidateFeatureList.map(cf => [...imageFeatures, ...cf])
    const input = tf.tensor2d(vecs)
    const scores = model.predict(input)
    return Array.from(scores.dataSync())
  })
}

export async function saveModel(model) {
  await model.save(MODEL_STORAGE_KEY)
}

export async function loadModel() {
  try {
    const model = await tf.loadLayersModel(MODEL_STORAGE_KEY)
    return model
  } catch (e) {
    return null
  }
}

export async function hasStoredModel() {
  try {
    const models = await tf.io.listModels()
    return Object.keys(models).includes(MODEL_STORAGE_KEY)
  } catch (e) {
    return false
  }
}

export async function deleteStoredModel() {
  try {
    await tf.io.removeModel(MODEL_STORAGE_KEY)
  } catch (e) {
    // ignore if nothing to remove
  }
}

// Export the model as downloadable files (model.json + weights.bin)
export async function exportModelAsDownload(model) {
  await model.save('downloads://ditherit-ai-ranker')
}

// Import a model from user-selected files (model.json + weights.bin)
export async function importModelFromFiles(jsonFile, weightsFile) {
  const model = await tf.loadLayersModel(tf.io.browserFiles([jsonFile, weightsFile]))
  await model.save(MODEL_STORAGE_KEY)
  return model
}
