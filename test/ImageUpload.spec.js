import { mount } from '@vue/test-utils'
import ImageUpload from '@/components/ImageUpload.vue'

// Suppress fathom analytics calls in tests
global.fathom = jest.fn()

describe('ImageUpload', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ImageUpload, {
      propsData: { text: 'Upload Image', duck: 'true' }
    })
  })

  // ── file validation ──────────────────────────────────────────────

  describe('file validation', () => {
    test('rejects non-image files via drag and drop', () => {
      const event = {
        target: { files: null },
        dataTransfer: {
          files: [{ type: 'application/pdf', name: 'doc.pdf' }]
        }
      }

      wrapper.vm.imageUploaded(event)
      expect(wrapper.vm.notAnImage).toBe(true)
    })

    test('accepts image/jpeg via drag and drop', () => {
      document.getElementById = jest.fn(() => ({
        src: '',
        naturalWidth: 100,
        naturalHeight: 100
      }))

      const event = {
        target: { files: null },
        dataTransfer: {
          files: [{ type: 'image/jpeg', name: 'photo.jpg', size: 1024 }]
        }
      }

      wrapper.vm.imageUploaded(event)
      expect(wrapper.vm.notAnImage).toBe(false)
    })

    test('accepts image/png via drag and drop', () => {
      document.getElementById = jest.fn(() => ({
        src: '',
        naturalWidth: 100,
        naturalHeight: 100
      }))

      const event = {
        target: { files: null },
        dataTransfer: {
          files: [{ type: 'image/png', name: 'photo.png', size: 2048 }]
        }
      }

      wrapper.vm.imageUploaded(event)
      expect(wrapper.vm.notAnImage).toBe(false)
    })
  })

  // ── event emission ───────────────────────────────────────────────

  describe('event emission', () => {
    test('emits number-images with correct count', () => {
      wrapper.vm.reportNumberOfImages(3)
      expect(wrapper.emitted()['number-images']).toBeTruthy()
      expect(wrapper.emitted()['number-images'][0][0]).toBe(3)
    })
  })

  // ── drag state ───────────────────────────────────────────────────

  describe('drag state', () => {
    test('dragging defaults to false', () => {
      expect(wrapper.vm.dragging).toBe(false)
    })

    test('dragging toggles on dragover', async () => {
      const dropZone = wrapper.find(
        '.border-0'
      )
      await dropZone.trigger('dragover')
      expect(wrapper.vm.dragging).toBe(true)
    })

    test('dragging resets on dragleave', async () => {
      wrapper.vm.dragging = true
      const dropZone = wrapper.find(
        '.border-0'
      )
      await dropZone.trigger('dragleave')
      expect(wrapper.vm.dragging).toBe(false)
    })
  })

  // ── loading state ────────────────────────────────────────────────

  describe('loading state', () => {
    test('loading defaults to false', () => {
      expect(wrapper.vm.loading).toBe(false)
    })
  })
})
