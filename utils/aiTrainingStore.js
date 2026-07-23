// IndexedDB wrapper for storing dither-ranking training pairs.
// Each pair stores only small numeric feature vectors — never image
// pixel data — so the store stays tiny even after thousands of picks.

const DB_NAME = 'ditherit-ai-trainer'
const DB_VERSION = 1
const STORE_NAME = 'training_pairs'

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

// pair: { imageFeatures: number[], winnerFeatures: number[], loserFeatures: number[], timestamp }
export async function addTrainingPair(pair) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).add({ ...pair, timestamp: Date.now() })
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getAllTrainingPairs() {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).getAll()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function getTrainingPairCount() {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).count()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function clearAllTrainingPairs() {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).clear()
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// Merge an array of imported pairs into the store (used by Import Data).
export async function importTrainingPairs(pairs) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    pairs.forEach(p => {
      // Strip any old id so autoIncrement assigns fresh ones and avoids collisions
      const { id, ...rest } = p
      store.add(rest)
    })
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function exportTrainingPairsAsJson() {
  const pairs = await getAllTrainingPairs()
  return JSON.stringify({ version: 1, exportedAt: Date.now(), pairs }, null, 2)
}
