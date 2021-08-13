import {isDifferentCommands, loadCommandsFromFiles, throwIdenticalCommandNames} from './command.utils'
import {loadEventsFromFiles} from './event.utils'
import {ExecuteEvent, ExecuteCommand} from './types'
import Cron from './Cron'
import ClientBot from './ClientBot'
import Storage from './Storage/Storage'
import CryptonData from './CryptonData'
import RoleAssigner from './RoleAssigner'
import config from '../config'

const EVENTS_DIR = __dirname + '/events'
const COMMANDS_DIR = __dirname + '/commands'

export default class Bot {
  private readonly roleAssigner: RoleAssigner
  private readonly crypton: CryptonData
  private readonly client: ClientBot
  private readonly storage: Storage
  private readonly cron: Cron
  private events: ExecuteEvent[]
  private commands: ExecuteCommand[]

  public constructor() {
    this.cron = new Cron(() => this.startAssigningRoles(), config.MINUTES_INTERVAL_CHECK_MEMBERS)
    this.crypton = new CryptonData()
    this.client = new ClientBot()
    this.storage = new Storage()
    this.roleAssigner = new RoleAssigner(this.storage, this.crypton, this.client)
    this.events = []
    this.commands = []
  }

  public async start(): Promise<void> {
    await this.storage.syncModels()
    this.events = await loadEventsFromFiles(EVENTS_DIR)
    this.commands = await loadCommandsFromFiles(COMMANDS_DIR)
    this.startEventListeners()
    await this.client.login()
    await this.updateCommandsIfNeed()
    this.cron.start()
  }

  private async updateCommandsIfNeed(): Promise<void> {
    throwIdenticalCommandNames(this.commands)
    const commandManager = this.client.getCommandManager()
    const fetchedCommands = await commandManager.fetchCommands()
    if (!isDifferentCommands(this.commands, fetchedCommands)) return
    await commandManager.updateCommands(this.commands)
    console.info('Commands have been updated!')
  }

  private startEventListeners(): void {
    process.on('unhandledRejection', error => console.error('Unhandled promise rejection:', error))
    for (const event of this.events) {
      if (event.once) this.client.once(event.name, (...args) => event.execute(...args, this.cron))
      else this.client.on(event.name, (...args) => event.execute(...args, this.commands, this.storage))
    }
  }

  private async startAssigningRoles(): Promise<void> {
    await this.roleAssigner.startAssigning()
  }

  public destroy(): void {
    this.client.destroy()
    this.cron.stop()
  }
}
