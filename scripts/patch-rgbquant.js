const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../node_modules/rgbquant/src/rgbquant.js')

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8')

  // Fix undeclared variable
  if (content.includes('transparentPixels = []') && !content.includes('var transparentPixels = []')) {
    content = content.replace(
      'transparentPixels = []',
      'var transparentPixels = []'
    )
    fs.writeFileSync(filePath, content)
    console.log('Patched rgbquant.js: added var declaration for transparentPixels')
  }
}
