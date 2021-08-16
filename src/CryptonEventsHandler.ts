import {RedisClient, createClient} from 'redis'
import {EventsMember} from './enums'
import config from '../config'

type Message = `{"discord": "${string}"}`
const OPTIONS_REDIS = {
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  auth_pass: config.REDIS_AUTH_PASS
}

export default class CryptonEventsHandler {
  private readonly client: RedisClient

  public constructor() {
    this.client = createClient(OPTIONS_REDIS)
  }

  public subscribe(): void {
    this.client.subscribe(EventsMember.addMember, EventsMember.removeMember)
  }

  public stop(): void {
    this.client.quit()
  }

  public onMessage(callback: (event: string, message: Message) => void): void {
    this.client.on('message', callback)
  }

  public onError(callback: <T extends Error>(error: T) => void): void {
    this.client.on('error', callback)
  }
}
