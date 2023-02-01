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

const file = fs.readFileSync('./config.yaml', 'utf8')
const config: Config = YAML.parse(file)

export default config
