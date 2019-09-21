const path = require('path')
const { join } = path
const execa = require('execa')
const { tmpdir: getTmpDir } = require('os')
const uuid = require('uuid')

function getBin () {
  const libPath = join(__dirname, 'lib')
  switch (process.platform) {
    case 'darwin':
      return join(libPath, 'gif2apng-macosx')
    case 'win32':
      return join(libPath, 'gif2apng-win32.exe')
    case 'linux':
      return join(libPath, 'gif2apng-linux')
    default:
      throw new Error(`No bin specified for platform ${process.platform}`)
  }
}

// gif2apng [options] anim.gif [anim.png]
const bin = getBin()

const changeExtension = (input, ext) => {
  const { name } = path.parse(input)
  return `${name}.${ext.replace('.', '')}`
}

const getDest = (inputDest, srcDir, srcFileName) => {
  if (!inputDest || inputDest === '') return changeExtension(srcFileName, 'png')

  const { dir: destDir, base } = path.parse(inputDest)
  const relativeDest = path.relative(srcDir, destDir) 
  return join(relativeDest, base)
}
async function convert (src, inputDest, opts = {}) {
  // TODO: Move bin and source to tmp
  // This is because the gif2apng bin does not handle absolute dirs...
  // const tmpDir = join(getTmpDir(), 'convert', uuid())
  // await fs.ensureDir(tmpDir)
  // await fs.move(src, tmpDir)

  const { dir: cwd, base: fileName } = path.parse(src)
  const dest = getDest(inputDest, cwd, fileName)
  try {
    await execa(bin, [fileName, dest], { cwd })
  } catch (error) {
    throw new Error(`Could not convert gif`)
  }
}


module.exports = convert