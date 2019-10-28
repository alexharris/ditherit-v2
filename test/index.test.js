import { mount } from '@vue/test-utils'
import ImageUpload from '@/components/ImageUpload.vue'

describe('ImageUpload', () => {
  test('uploads an image', () => {
    const componentWrapper = mount(<ImageUpload />)
    const fileContents = 'file contents'
    const file = new Blob([fileContents], { type: 'image/jpeg' })
    componentWrapper
      .find('input')
      .simulate('change', { target: { files: [file] } })
    expect(FileReader).toHaveBeenCalled()
  })
})
