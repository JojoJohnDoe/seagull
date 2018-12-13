import { Command } from '@seagull/commands'
import * as AWS from 'aws-sdk'

/**
 * Command to delete a File from a specific S3 bucket
 */
export class DeleteFile extends Command {
  /**
   * name of the target bucket
   */
  bucketName: string

  /**
   * Absolute Path to the file including file name and extension
   */
  filePath: string

  /**
   * see the individual property descriptions within this command class
   */
  constructor(bucketName: string, filePath: string) {
    super()
    this.bucketName = bucketName
    this.filePath = filePath
  }

  /**
   * perform the command
   */
  async execute() {
    const params = { Bucket: this.bucketName, Key: this.filePath }
    const client = new AWS.S3()
    return await client.deleteObject(params).promise()
  }

  /**
   * revert the command
   */
  async revert() {
    return true // TODO: cache the file and restore it
  }
}
