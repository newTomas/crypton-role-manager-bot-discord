import {RedisClientType, createClient} from 'redis'
import {EventsMember} from './enums'
import config from '../config'

const OPTIONS_REDIS = {
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  auth_pass: config.REDIS_AUTH_PASS
}

export default class CryptonEventsHandler {
  private readonly client: RedisClientType

  public constructor() {
    this.client = createClient({url: `redis://:${OPTIONS_REDIS.auth_pass}@${OPTIONS_REDIS.host}:${OPTIONS_REDIS.port}`})
  }

  public async connect(){
    await this.client.connect();
  }

  public subscribe(callback: (event: string, message: string) => void): void {
    this.client.subscribe(EventsMember.addMember, message => callback(EventsMember.addMember, message))
    this.client.subscribe(EventsMember.removeMember, message => callback(EventsMember.removeMember, message))
    this.client.on("message", (...args) => {
      console.log("message", args);
    })
  }

  public stop(): void {
    this.client.quit()
  }

  public onError(callback: <T extends Error>(error: T) => void): void {
    this.client.on('error', callback)
  }
}
