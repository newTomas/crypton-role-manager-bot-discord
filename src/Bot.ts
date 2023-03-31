import {isDifferentCommands, loadCommandsFromFiles, throwIdenticalCommandNames} from './command.utils'
import {loadEventsFromFiles} from './event.utils'
import {ExecuteEvent, ExecuteCommand} from './types'
import {EventsMember} from './enums'
import CryptonEventsHandler from './CryptonEventsHandler'
import RoleAssigner from './RoleAssigner'
import Storage from './Storage/Storage'
import ClientBot from './ClientBot'
import Cron from './Cron'
import config from '../config'

const EVENTS_DIR = __dirname + '/events'
const COMMANDS_DIR = __dirname + '/commands'
const PATH_TO_STORAGE = config.PATH_TO_ROOT_DIR + '/database.sqlite'

export default class Bot {
  private readonly cryptonHandler: CryptonEventsHandler
  private readonly roleAssigner: RoleAssigner
  private readonly client: ClientBot
  private readonly storage: Storage
  private readonly cron: Cron
  private events: ExecuteEvent[]
  private commands: ExecuteCommand[]

  public constructor() {
    this.events = []
    this.commands = []
    this.client = new ClientBot()
    this.storage = new Storage(PATH_TO_STORAGE)
    this.cryptonHandler = new CryptonEventsHandler()
    this.roleAssigner = new RoleAssigner(this.storage, this.client)
    this.cron = new Cron(() => this.roleAssigner.startAssigning(), config.MINUTES_INTERVAL_CHECK_MEMBERS)
  }

  public async start(): Promise<void> {
    this.events = await loadEventsFromFiles(EVENTS_DIR)
    this.commands = await loadCommandsFromFiles(COMMANDS_DIR)
    await this.storage.syncModels()
    this.startEventListeners()
    await this.client.login()
    await this.updateCommandsIfNeed()
    this.startListenCrypton()
    this.cron.start()
  }

  private async updateCommandsIfNeed(): Promise<void> {
    throwIdenticalCommandNames(this.commands)
    const commandManager = this.client.getCommandManager()
    const fetchedCommands = await commandManager.fetchCommands()
    if (!isDifferentCommands(this.commands, fetchedCommands)) return
    await commandManager.updateCommands(this.commands)
  }

  private startEventListeners(): void {
    process.on('unhandledRejection', error => console.error('Unhandled promise rejection:', error))
    process.once('SIGINT', () => this.destroy())
    process.once('SIGTERM', () => this.destroy())

    for (const event of this.events) {
      if (event.once) this.client.once(event.name, event.execute)
      else this.client.on(event.name, (...args) => event.execute(...args, this.commands, this.storage))
    }
  }

  private startListenCrypton(): void {
    this.cryptonHandler.connect();
    this.cryptonHandler.subscribe(async (event, message) => {
      try {
        console.info('New Redis Event: ', event, message)
        if (!(event in EventsMember)) return
        const messageObject = JSON.parse(message) as {discord: string}
        const userID = messageObject.discord
        const isMember = event === EventsMember.addMember

        const memberStorage = await this.storage.getMemberByID(userID)
        if (!memberStorage) await this.storage.addMember(userID, isMember)
        else await this.storage.editMember(userID, isMember)
      } catch (error) {console.error('Redis callback onMessage threw Error: ', error)}
    })
    this.cryptonHandler.onError(error => console.error('Redis threw Error:', error))
  }

  public destroy(): void {
    this.cryptonHandler.stop()
    this.client.destroy()
    this.cron.stop()
  }
}
