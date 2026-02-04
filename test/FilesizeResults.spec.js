import { mount } from '@vue/test-utils'
import FilesizeResults from '@/components/FilesizeResults.vue'

describe('FilesizeResults', () => {
  function createWrapper(downloadFileSize, originalFileSize) {
    return mount(FilesizeResults, {
      propsData: {
        ratioGood: true,
        downloadFileSize,
        originalFileSize,
        ditheredHeight: 100,
        ditheredWidth: 100
      }
    })
  }

  // ── strokeDashArray computed ─────────────────────────────────────

  describe('strokeDashArray', () => {
    test('calculates SVG donut stroke-dasharray', () => {
      // percentage = (1.5 / 3.00) * 100 = 50
      // dasharray = "50 50"
      const wrapper = createWrapper(1.5, 3.0)
      expect(wrapper.vm.strokeDashArray).toBe('50 50')
    })

    test('returns 100 0 when files are same size', () => {
      const wrapper = createWrapper(3.0, 3.0)
      expect(wrapper.vm.strokeDashArray).toBe('100 0')
    })

    test('returns 0 100 when originalFileSize is 0', () => {
      const wrapper = createWrapper(1.5, 0)
      expect(wrapper.vm.strokeDashArray).toBe('0 100')
    })
  })

  // ── percentage display ───────────────────────────────────────────

  describe('percentage display', () => {
    test('shows correct percentage in template', () => {
      const wrapper = createWrapper(1.5, 3.0)
      const text = wrapper.text()
      expect(text).toContain('50.00%')
    })

    test('shows 0 when originalFileSize is 0', () => {
      const wrapper = createWrapper(1.5, 0)
      const text = wrapper.text()
      expect(text).toContain('0%')
    })
  })

  // ── file size display ────────────────────────────────────────────

  describe('file size display', () => {
    test('displays original and dithered file sizes', () => {
      const wrapper = createWrapper(1.5, 3.0)
      const text = wrapper.text()
      expect(text).toContain('3.00kb')
      expect(text).toContain('1.50kb')
    })
  })
})
