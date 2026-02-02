import { mount } from '@vue/test-utils'
import ColorPicker from '@/components/ColorPicker.vue'

// Stub the vue-color Sketch component
const stubs = {
  'sketch-picker': { template: '<div />' }
}

describe('ColorPicker', () => {
  // ── hexToRgb ─────────────────────────────────────────────────────

  describe('hexToRgb', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(ColorPicker, {
        propsData: { initialPalette: [] },
        stubs
      })
    })

    test('converts standard hex colors', () => {
      expect(wrapper.vm.hexToRgb('#ff0000')).toEqual([255, 0, 0])
      expect(wrapper.vm.hexToRgb('#00ff00')).toEqual([0, 255, 0])
      expect(wrapper.vm.hexToRgb('#0000ff')).toEqual([0, 0, 255])
    })

    test('converts hex without hash', () => {
      expect(wrapper.vm.hexToRgb('ff0000')).toEqual([255, 0, 0])
    })

    test('short hex (3-char) returns null', () => {
      expect(wrapper.vm.hexToRgb('#fff')).toBeNull()
    })

    test('invalid input returns null', () => {
      expect(wrapper.vm.hexToRgb('notacolor')).toBeNull()
      expect(wrapper.vm.hexToRgb('')).toBeNull()
    })
  })

  // ── localStorage persistence ─────────────────────────────────────

  describe('localStorage persistence', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    test('loads custom palettes from localStorage on mount', () => {
      const palettes = [{ name: 'Test', colors: [{ hex: '#ff0000' }] }]
      localStorage.setItem(
        'ditherit_custom_palettes',
        JSON.stringify(palettes)
      )

      const wrapper = mount(ColorPicker, {
        propsData: { initialPalette: [] },
        stubs
      })

      expect(wrapper.vm.customPalettes).toEqual(palettes)
    })

    test('saves custom palettes to localStorage', () => {
      const wrapper = mount(ColorPicker, {
        propsData: { initialPalette: [] },
        stubs
      })

      wrapper.vm.palette = [{ hex: '#00ff00' }]
      wrapper.vm.newPaletteName = 'My Green'

      // Mock alert
      window.alert = jest.fn()
      wrapper.vm.saveCustomPalette()

      const stored = JSON.parse(
        localStorage.getItem('ditherit_custom_palettes')
      )
      expect(stored).toHaveLength(1)
      expect(stored[0].name).toBe('My Green')
      expect(stored[0].colors).toEqual([{ hex: '#00ff00' }])
    })

    test('handles corrupted localStorage gracefully', () => {
      localStorage.setItem('ditherit_custom_palettes', 'not valid json')

      const wrapper = mount(ColorPicker, {
        propsData: { initialPalette: [] },
        stubs
      })

      expect(wrapper.vm.customPalettes).toEqual([])
    })
  })

  // ── palette selection ────────────────────────────────────────────

  describe('palette selection', () => {
    test('selects a preset palette', () => {
      const wrapper = mount(ColorPicker, {
        propsData: { initialPalette: [] },
        stubs
      })

      wrapper.vm.presetPaletteSelected({
        target: { value: 'blackwhite' }
      })

      expect(wrapper.vm.palette).toEqual([
        { hex: '#ffffff' },
        { hex: '#000000' }
      ])
    })

    test('selects original palette', () => {
      const wrapper = mount(ColorPicker, {
        propsData: { initialPalette: [] },
        stubs
      })

      wrapper.vm.originalInitialPalette = [
        { hex: '#aabbcc' },
        { hex: '#112233' }
      ]

      wrapper.vm.presetPaletteSelected({
        target: { value: 'original' }
      })

      expect(wrapper.vm.palette).toEqual([
        { hex: '#aabbcc' },
        { hex: '#112233' }
      ])
    })
  })

  // ── updatePallete event emission ─────────────────────────────────

  describe('updatePallete', () => {
    test('emits update-palette with correct RGB tuples', () => {
      const wrapper = mount(ColorPicker, {
        propsData: { initialPalette: [] },
        stubs
      })

      wrapper.vm.palette = [{ hex: '#ff0000' }, { hex: '#00ff00' }]
      wrapper.vm.updatePallete()

      expect(wrapper.emitted()['update-palette']).toBeTruthy()
      expect(wrapper.emitted()['update-palette'][0][0]).toEqual([
        [255, 0, 0],
        [0, 255, 0]
      ])
    })
  })
})
