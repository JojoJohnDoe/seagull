import { FS as FSMock } from '@seagull/mock-fs'
import { BasicTest } from '@seagull/testing'
import * as AWS from 'aws-sdk'
import {
  DescribeLogStreamsRequest,
  GetLogEventsRequest,
  InputLogEvents,
  PutLogEventsRequest,
} from 'aws-sdk/clients/cloudwatchlogs'
import 'chai/register-should'
import { Volume } from 'memfs'
import { suite, test } from 'mocha-typescript'
import * as moment from 'moment'
import { CWLMockFS } from '../src'

@suite('Mocks::CloudWatchLogs::FS')
export class Test extends BasicTest {
  logs = [
    {
      message: 'Foo',
      timestamp: moment().unix(),
    },
    {
      message: 'Bar',
      timestamp: moment().unix(),
    },
  ]

  streams = {
    logStreams: [
      { logStreamName: 'cloudwatchlogs-mock' },
      { logStreamName: 'cloudwatchlogs-mock2' },
    ],
  }

  @test
  async 'can be enabled and disabled'() {
    const fs = new Volume() as any
    const mock = new CWLMockFS('/tmp/.data', fs)

    mock.activate()
    await this.writeLog('cloudwatchlogs-mock', this.logs)
    await this.writeLog('cloudwatchlogs-mock2', this.logs)
    const response = await this.readLog('cloudwatchlogs-mock')
    const streams = await this.listStreams()
    response.events!.should.be.deep.equal(this.logs)
    streams.should.be.deep.equal(this.streams)
    mock.deactivate()
  }

  @test
  async 'can be resetted'() {
    const fs = new Volume() as any
    const mock = new CWLMockFS('/tmp/.data', fs)
    mock.activate()
    await this.writeLog('cloudwatchlogs-mock', this.logs)
    mock.reset()
    const response = await this.readLog('cloudwatchlogs-mock')
    response.events!.should.be.deep.equal([])
    mock.deactivate()
  }

  private async writeLog(logStreamName: string, logEvents: InputLogEvents) {
    const params: PutLogEventsRequest = {
      logEvents,
      logGroupName: 'test',
      logStreamName,
    }
    const client = new AWS.CloudWatchLogs({ region: process.env.AWS_REGION })
    return await client.putLogEvents(params).promise()
  }

  private async readLog(logStreamName: string) {
    const params: GetLogEventsRequest = {
      logGroupName: 'test',
      logStreamName,
    }
    const client = new AWS.CloudWatchLogs({ region: process.env.AWS_REGION })
    return await client.getLogEvents(params).promise()
  }

  private async listStreams() {
    const params: DescribeLogStreamsRequest = {
      logGroupName: 'test',
    }
    const client = new AWS.CloudWatchLogs({ region: 'eu-central-1' })
    return await client.describeLogStreams(params).promise()
  }
}
