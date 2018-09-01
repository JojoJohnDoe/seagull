import { Folder } from '@deploy'
import { AppPlan } from '@scaffold/plans'
import { listFiles } from '@tools/util'
import 'chai/register-should'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import FunctionalTest from '../../helper/functional_test'

@suite('Integration::Deploy::Folder')
export class Test extends FunctionalTest {
  before() {
    this.mockFolder('/tmp')
  }
  after() {
    this.restoreFolder()
  }

  @test
  async 'creates public folder with all files'() {
    const appPlan = new AppPlan('/tmp', 'DemoApp', 'static')
    appPlan.apply()
    const deployCommand = new Folder('/tmp/DemoApp')
    await deployCommand.run()
    const files = listFiles('/tmp/DemoApp/public')
    files.should.include('/tmp/DemoApp/public/index.html')
    files.should.include('/tmp/DemoApp/public/assets/bundle.js')
  }
}
