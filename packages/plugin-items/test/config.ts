import { BasicTest } from '@seagull/testing'
import 'chai/register-should'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { config, Item } from '../src'

class Something extends Item {
  id: string = 'i18n'
}

@suite('config')
export class Test extends BasicTest {
  mocks = [new this.mock.S3()]

  @test
  async 'name of the bucket is configurable'() {
    const storage = this.mocks[0].storage
    config.bucket.should.be.equal('demo-bucket')
    Something.put({ id: '1' })
    storage['demo-bucket'].should.be.deep.equal({
      'Something/1.json': '{"id":"1"}',
    })
    config.bucket = 'another-bucket'
    Something.put({ id: '1' })
    storage['another-bucket'].should.be.deep.equal({
      'Something/1.json': '{"id":"1"}',
    })
  }
}
