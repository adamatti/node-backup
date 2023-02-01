import fs from 'fs'
import YAML from 'yaml'

export interface Config {
  targetPrefixFolder?: string
  dropbox: {
    accessToken: string
  }
  folders: Array<{ source: string, target: string }>
  ignore: string[]
  ignoreExt: string[]
}

const emptyConfig: Config = {
  dropbox: {
    accessToken: ''
  },
  folders: [],
  ignore: [],
  ignoreExt: []
}

let config: Config

if (process.env['NODE_ENV'] === 'test') {
  config = emptyConfig
} else if (fs.existsSync('./config.yaml')) {
  const file = fs.readFileSync('./config.yaml', 'utf8')
  config = YAML.parse(file)
} else {
  throw new Error('config.yaml not found')
}

export default config
