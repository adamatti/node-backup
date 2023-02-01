import moment from 'moment'
import prettyBytes from 'pretty-bytes'

import config from './config'
import logger from './logger'
import { walk } from './backup'

const rootTargetFolder = `/${config.targetPrefixFolder ?? 'backup'}-${moment().format('YYYY-MM-DD-HH.mm.ss')}`

const main = async (): Promise<void> => {
  logger.info('Started')
  await Promise.all(config.folders.map(async ({ source, target }) => {
    const size = await walk(source, `${rootTargetFolder}/${target}`)
    logger.info(`Total on ${source}: ${prettyBytes(size)}`)
  }))
  logger.info('Ended')
}

main()
