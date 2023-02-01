import { describe, beforeEach, before, test, it } from 'node:test'
import { strict as assert } from 'node:assert'

import { Config } from './config'
import { checkShallIgnore } from './backup'

describe('main process', async () => {
  describe('checkShallIgnore', async () => {
    let config: Config

    beforeEach(() => {
      config = {
        dropbox: {
          accessToken: 'fake'
        },
        folders: [],
        ignore: [
          'node_modules',
          '/tmp/test.txt'
        ],
        ignoreExt: ['.log']
      }
    })

    it(() => {
      assert.equal(!!config, true, 'Config shall not be empty');
      [
        ['/home/node_modules', true],
        ['/tmp/test.txt', true],
        ['/tmp/test.log', true],
        ['/tmp/ok.txt', false]
      ].forEach(([path, resultExpected]) => {
        assert.equal(checkShallIgnore(config, `${path}`), resultExpected, `${path} should result ${resultExpected}`)
      })
    })
  })
})
