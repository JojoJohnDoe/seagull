import { FS } from '@seagull/commands-fs'

import { BasicTest } from '@seagull/testing'
import 'chai/register-should'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { Bundle } from '../../src'

@suite('Bundle::Backend')
export class Test extends BasicTest {
  @test
  async 'can transform a node js file into bundle file'() {
    await new FS.WriteFile('/tmp/a.js', 'module.exports = {}').execute()
    await new Bundle.Backend('/tmp/a.js', '/tmp/b.js').execute()
    const result = await new FS.ReadFile('/tmp/b.js').execute()
    result.should.be.a('string').that.is.not.equal('')
  }
}
