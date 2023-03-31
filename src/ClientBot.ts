import { Client, ClientEvents, Guild, GatewayIntentBits } from 'discord.js'
import CommandManager from './CommandManager'
import config from '../config'

const INTENTS = [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers]

export default class ClientBot {
  private readonly client: Client
  private readonly token: string

  public constructor() {
    this.client = new Client({ intents: INTENTS })
    this.token = config.TOKEN
  }

  public async login(): Promise<void> {
    await this.client.login(this.token)
  }

  public getCommandManager(): CommandManager {
    if (!this.client.application) throw new Error('Couldn\'t get ClientApplication')
    return new CommandManager(this.client.application.commands)
  }

  public on<K extends keyof ClientEvents>(eventName: K, callback: (...args: ClientEvents[K]) => void): void {
    this.client.on(eventName, callback)
  }

  public once<K extends keyof ClientEvents>(eventName: K, callback: (...args: ClientEvents[K]) => void): void {
    this.client.once(eventName, callback)
  }

  public async getGuildByID(guildID: string): Promise<Guild | undefined> {
    const guilds = await this.client.guilds.fetch()
    const guild = guilds.find(value => value.id === guildID)
    return guild?.fetch()
  }

  public destroy(): void {
    this.client.destroy()
  }
}
