import fs from 'fs'
import path from 'path'
import config, { Config } from './config'
import logger from './logger'
import upload from './upload'
import prettyBytes from 'pretty-bytes'

const shallUpload = false

export const checkShallIgnore = (config: Config, file: string): boolean => {
  const baseName = path.basename(file)
  const extension = path.extname(file)

  return (
    !!config.ignore.includes(baseName) ||
    !!config.ignore.includes(file) ||
    !!config.ignoreExt.includes(extension)
  )
}

const getFileSize = (filePath: string): number => {
  const { size } = fs.statSync(filePath)
  return size
}

export const walk = async (source: string, target: string): Promise<number> => {
  const files: string[] = fs.readdirSync(source)
  const sizes: number[] = await Promise.all(files.map(async (file) => {
    const fullSourcePath = `${source}/${file}`
    const fullTargetPath = `${target}/${file}`
    const stats = fs.lstatSync(fullSourcePath)

    const shallIgnore: boolean = checkShallIgnore(config, fullSourcePath)

    if (!shallIgnore) {
      if (stats.isDirectory()) {
        return await walk(fullSourcePath, fullTargetPath)
      } else {
        const size = getFileSize(fullSourcePath)
        logger.info(`${fullSourcePath} -> ${fullTargetPath} - ${prettyBytes(size)}`)
        if (shallUpload) {
          await upload(fullSourcePath, fullTargetPath)
        }
        return size
      }
    }
    return 0
  }))
  return sizes.reduce((sum: number, cur) => sum + cur, 0)
}
