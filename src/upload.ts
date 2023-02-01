import { Dropbox, DropboxResponseError } from 'dropbox'
import { pRateLimit, RateLimitTimeoutError } from 'p-ratelimit'
import fs from 'fs'
import config from './config'
import logger from './logger'

const limit = pRateLimit({
  interval: 1000, // 1000 ms == 1 second
  rate: 20, // 30 API calls per interval
  concurrency: 5 // no more than X running at once
  // maxDelay: 30000             // an API call delayed > X sec is rejected
})

const dbx = new Dropbox({ accessToken: config.dropbox.accessToken })

async function delay (ms: number): Promise<void> {
  return await new Promise(resolve => setTimeout(resolve, ms))
}

const upload = async (source: string, target: string): Promise<void> => {
  try {
    const contents = fs.readFileSync(source)
    await limit(async () => await dbx.filesUpload({ path: target, contents }))
  } catch (error) {
    if (error instanceof DropboxResponseError && error.status === 429) {
      const retryAfter = error.error.error.retry_after
      logger.warn('RateLimitError', { retryAfter, target, errorMessage: error.error.message })
      await delay(retryAfter * 1000)
      return await upload(source, target)
    } else if (error instanceof RateLimitTimeoutError) {
      logger.warn('Timeout', { target, errorMessage: error.message })
      await delay(5 * 1000)
      return await upload(source, target)
    } else if (error instanceof Error) {
      logger.error(`Error: ${error.message}`, error)
    }
  }
}

export default upload
