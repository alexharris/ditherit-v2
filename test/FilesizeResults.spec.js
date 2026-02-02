import { mount } from '@vue/test-utils'
import FilesizeResults from '@/components/FilesizeResults.vue'

describe('FilesizeResults', () => {
  function createWrapper(downloadFileSize, srcLength) {
    return mount(FilesizeResults, {
      propsData: {
        ratioGood: true,
        downloadFileSize,
        selectedImage: { src: 'x'.repeat(srcLength) },
        ditheredHeight: 100,
        ditheredWidth: 100,
        rgbquant: {}
      }
    })
  }

  // ── originalFileSize computed ────────────────────────────────────

  describe('originalFileSize', () => {
    test('estimates base64 size from src length', () => {
      // src length 4000 → (round(4000 * 3 / 4)) / 1000 = 3.00
      const wrapper = createWrapper(1.5, 4000)
      expect(parseFloat(wrapper.vm.originalFileSize)).toBeCloseTo(3.0, 1)
    })

    test('returns string with 2 decimal places', () => {
      const wrapper = createWrapper(1, 5000)
      expect(wrapper.vm.originalFileSize).toMatch(/^\d+\.\d{2}$/)
    })
  })

  // ── strokeDashArray computed ─────────────────────────────────────

  describe('strokeDashArray', () => {
    test('calculates SVG donut stroke-dasharray', () => {
      // originalFileSize = (round(4000*3/4))/1000 = 3.00
      // percentage = (1.5 / 3.00) * 100 = 50
      // dasharray = "50 50"
      const wrapper = createWrapper(1.5, 4000)
      expect(wrapper.vm.strokeDashArray).toBe('50 50')
    })

    test('returns 100 0 when files are same size', () => {
      // originalFileSize = 3.00, downloadFileSize = 3.00
      const wrapper = createWrapper(3.0, 4000)
      expect(wrapper.vm.strokeDashArray).toBe('100 0')
    })
  })

  // ── percentage display ───────────────────────────────────────────

  describe('percentage display', () => {
    test('shows correct percentage in template', () => {
      const wrapper = createWrapper(1.5, 4000)
      const text = wrapper.text()
      expect(text).toContain('50.00%')
    })
  })
})
