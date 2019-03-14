import * as fs from 'fs'
import * as path from 'path'

export function createFolderRecursive(folderPath: string, fsModule = fs) {
  const segments = folderPath.split('/').filter(c => c!!)
  const creator = (p: string, f: string) => createFolderInPath(p, f, fsModule)
  segments.reduce(creator, '/')
}

export function removeFolderRecursive(folderPath: string, fsModule = fs) {
  rimraf(fsModule, folderPath)
}

export function copyFolderRecursive(from: string, to: string, fsModule = fs) {
  copyDir(fsModule, from, to)
}

export function getAppName() {
  try {
    const packageFile = require(`${process.cwd()}/package.json`)
    if (packageFile) {
      return packageFile.name
    }
  } catch (e) {
    // no file found
  }

  const appName = process.env.APP

  if (appName) {
    return appName
  } else {
    throw new Error('NO APP NAME GIVEN')
  }
}

const createFolderInPath = (
  pathForFolder: string,
  folderName: string,
  fsModule = fs
) => {
  const newPath = `${pathForFolder}/${folderName}/`
  try {
    fsModule.mkdirSync(newPath)
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
  }
  return newPath
}

/**
 * Remove directory recursively
 * @param {string} folderPath
 * @see https://stackoverflow.com/a/42505874/3027390
 */
function rimraf(fsModule: typeof fs, folderPath: string) {
  if (fsModule.existsSync(folderPath)) {
    fsModule.readdirSync(folderPath).forEach(entry => {
      const entryPath = path.join(folderPath, entry)
      if (fsModule.lstatSync(entryPath).isDirectory()) {
        rimraf(fsModule, entryPath)
      } else {
        fsModule.unlinkSync(entryPath)
      }
    })
    fsModule.rmdirSync(folderPath)
  }
}

function copyDir(fsModule: typeof fs, from: string, to: string) {
  fsModule.mkdirSync(to)
  for (const entry of fsModule.readdirSync(from)) {
    const srcPath = path.join(from, entry)
    const destPath = path.join(to, entry)
    if (fsModule.lstatSync(srcPath).isDirectory()) {
      copyDir(fsModule, srcPath, destPath)
    } else {
      fsModule.copyFileSync(srcPath, destPath)
    }
  }
}
