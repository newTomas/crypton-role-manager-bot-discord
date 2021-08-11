import {Client, Intents} from 'discord.js'
import CommandManager from './CommandManager'
import {EventNames} from './enums'
import config from '../config'

const INTENTS = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]

export default class ClientBot {
  private readonly client: Client
  private readonly token: string

  public constructor() {
    this.client = new Client({intents: INTENTS})
    this.token = config.TOKEN
  }

  public async login(): Promise<void> {
    await this.client.login(this.token)
  }

  public getCommandManager(): CommandManager {
    if (!this.client.application) throw new Error('Couldn\'t get ClientApplication')
    return new CommandManager(this.client.application.commands)
  }

  public on(eventName: EventNames, callback: (...args: any[]) => void): void {
    this.client.on(eventName, callback)
  }

  public once(eventName: EventNames, callback: (...args: any[]) => void): void {
    this.client.once(eventName, callback)
  }
}
