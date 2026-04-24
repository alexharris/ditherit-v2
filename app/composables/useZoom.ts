import { type Ref, computed, ref } from 'vue'

const MIN_SCALE = 1
const MAX_SCALE = 8

export function useZoom(options: {
  containerRef: Ref<HTMLElement | null>
}) {
  const { containerRef } = options

  const scale = ref(1)
  const translateX = ref(0)
  const translateY = ref(0)
  const isPanningRef = ref(false)

  const isZoomed = computed(() => scale.value > 1.001)

  // Clamp translate so image never fully exits the container.
  // With transformOrigin 50%/50%, maxTranslate = containerSize * (scale - 1) / 2
  function clampTranslate(tx: number, ty: number, s: number, cW: number, cH: number) {
    const maxX = (cW * (s - 1)) / 2
    const maxY = (cH * (s - 1)) / 2
    return {
      x: Math.min(maxX, Math.max(-maxX, tx)),
      y: Math.min(maxY, Math.max(-maxY, ty))
    }
  }

  // CSS translate() inside scale() operates in the element's local (pre-scale) coordinate space.
  // Dividing by scale converts screen-space pixels to local-space pixels.
  const transformStyle = computed(() => ({
    transform: `scale(${scale.value}) translate(${translateX.value / scale.value}px, ${translateY.value / scale.value}px)`,
    transformOrigin: '50% 50%',
    willChange: 'transform',
    cursor: isPanningRef.value ? 'grabbing' : isZoomed.value ? 'grab' : 'default',
    userSelect: 'none' as const
  }))

  // ── Wheel (desktop scroll + trackpad pinch) ───────────────────────────────

  function onWheel(e: WheelEvent) {
    e.preventDefault()

    const container = containerRef.value
    if (!container) return

    // ctrlKey = true for trackpad pinch gesture (browser normalizes it)
    const delta = e.ctrlKey ? -e.deltaY * 0.01 : -e.deltaY * 0.001
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale.value * (1 + delta)))

    const rect = container.getBoundingClientRect()
    const cW = rect.width
    const cH = rect.height

    // Cursor offset from container center
    const cursorX = e.clientX - (rect.left + cW / 2)
    const cursorY = e.clientY - (rect.top + cH / 2)

    // Zoom toward cursor: adjust translate so the point under the cursor stays fixed.
    // With center transformOrigin: newTx = (tx - cursorFromCenter) * (newScale / scale) + cursorFromCenter
    const ratio = newScale / scale.value
    const newTx = (translateX.value - cursorX) * ratio + cursorX
    const newTy = (translateY.value - cursorY) * ratio + cursorY

    scale.value = newScale
    const clamped = clampTranslate(newTx, newTy, newScale, cW, cH)
    translateX.value = clamped.x
    translateY.value = clamped.y
  }

  // ── Pointer pan (desktop mouse drag) ─────────────────────────────────────

  let panStartX = 0
  let panStartY = 0
  let panStartTx = 0
  let panStartTy = 0

  function onPointerDown(e: PointerEvent) {
    if (scale.value <= 1.001) return
    if (e.button !== 0) return
    isPanningRef.value = true
    panStartX = e.clientX
    panStartY = e.clientY
    panStartTx = translateX.value
    panStartTy = translateY.value
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: PointerEvent) {
    if (!isPanningRef.value) return
    const container = containerRef.value
    if (!container) return
    const { width: cW, height: cH } = container.getBoundingClientRect()
    const newTx = panStartTx + (e.clientX - panStartX)
    const newTy = panStartTy + (e.clientY - panStartY)
    const clamped = clampTranslate(newTx, newTy, scale.value, cW, cH)
    translateX.value = clamped.x
    translateY.value = clamped.y
  }

  function onPointerUp() {
    isPanningRef.value = false
  }

  // ── Touch pinch + two-finger pan (mobile) ────────────────────────────────

  let touchStartDist = 0
  let touchStartScale = 0
  let touchMidStartX = 0
  let touchMidStartY = 0
  let touchStartTx = 0
  let touchStartTy = 0

  function getTouchDist(touches: TouchList): number {
    const dx = touches[0]!.clientX - touches[1]!.clientX
    const dy = touches[0]!.clientY - touches[1]!.clientY
    return Math.hypot(dx, dy)
  }

  function getTouchMidFromCenter(touches: TouchList, rect: DOMRect): { x: number; y: number } {
    const mx = (touches[0]!.clientX + touches[1]!.clientX) / 2
    const my = (touches[0]!.clientY + touches[1]!.clientY) / 2
    return { x: mx - (rect.left + rect.width / 2), y: my - (rect.top + rect.height / 2) }
  }

  function onTouchStart(e: TouchEvent) {
    if (e.touches.length === 2) {
      e.preventDefault()
      const container = containerRef.value!
      const rect = container.getBoundingClientRect()
      touchStartDist = getTouchDist(e.touches)
      touchStartScale = scale.value
      const mid = getTouchMidFromCenter(e.touches, rect)
      touchMidStartX = mid.x
      touchMidStartY = mid.y
      touchStartTx = translateX.value
      touchStartTy = translateY.value
    }
  }

  function onTouchMove(e: TouchEvent) {
    if (e.touches.length === 2) {
      e.preventDefault()
      const container = containerRef.value!
      const rect = container.getBoundingClientRect()
      const currentDist = getTouchDist(e.touches)
      const currentMid = getTouchMidFromCenter(e.touches, rect)
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, touchStartScale * (currentDist / touchStartDist)))

      // Zoom toward pinch midpoint + pan by midpoint shift
      const ratio = newScale / touchStartScale
      const panDx = currentMid.x - touchMidStartX
      const panDy = currentMid.y - touchMidStartY
      const newTx = (touchStartTx - touchMidStartX) * ratio + touchMidStartX + panDx
      const newTy = (touchStartTy - touchMidStartY) * ratio + touchMidStartY + panDy

      scale.value = newScale
      const clamped = clampTranslate(newTx, newTy, newScale, rect.width, rect.height)
      translateX.value = clamped.x
      translateY.value = clamped.y
    }
  }

  // ── Listener attachment ───────────────────────────────────────────────────

  function attachListeners(el: HTMLElement) {
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)
    el.addEventListener('touchstart', onTouchStart, { passive: false })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
  }

  function detachListeners(el: HTMLElement) {
    el.removeEventListener('wheel', onWheel)
    el.removeEventListener('pointerdown', onPointerDown)
    el.removeEventListener('pointermove', onPointerMove)
    el.removeEventListener('pointerup', onPointerUp)
    el.removeEventListener('pointercancel', onPointerUp)
    el.removeEventListener('touchstart', onTouchStart)
    el.removeEventListener('touchmove', onTouchMove)
  }

  function reset() {
    scale.value = 1
    translateX.value = 0
    translateY.value = 0
    isPanningRef.value = false
  }

  function zoomIn(step = 1.5) {
    const container = containerRef.value
    if (!container) return
    const { width: cW, height: cH } = container.getBoundingClientRect()
    const newScale = Math.min(MAX_SCALE, scale.value * step)
    const ratio = newScale / scale.value
    scale.value = newScale
    const clamped = clampTranslate(translateX.value * ratio, translateY.value * ratio, newScale, cW, cH)
    translateX.value = clamped.x
    translateY.value = clamped.y
  }

  function zoomOut(step = 1.5) {
    const container = containerRef.value
    if (!container) return
    const { width: cW, height: cH } = container.getBoundingClientRect()
    const newScale = Math.max(MIN_SCALE, scale.value / step)
    const ratio = newScale / scale.value
    scale.value = newScale
    const clamped = clampTranslate(translateX.value * ratio, translateY.value * ratio, newScale, cW, cH)
    translateX.value = clamped.x
    translateY.value = clamped.y
  }

  return {
    scale,
    isZoomed,
    transformStyle,
    attachListeners,
    detachListeners,
    reset,
    zoomIn,
    zoomOut
  }
}
