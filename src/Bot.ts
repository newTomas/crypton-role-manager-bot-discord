import {ExecuteEvent, ExecuteCommand} from './types'
import {isDifferentCommands, loadCommandsFromFiles, throwIdenticalCommandNames} from './command.utils'
import {loadEventsFromFiles} from './event.utils'
import ClientBot from './ClientBot'

const EVENTS_DIR = __dirname + '/events'
const COMMANDS_DIR = __dirname + '/commands'

export default class Bot {
  private readonly client: ClientBot
  private events: ExecuteEvent[]
  private commands: ExecuteCommand[]

  public constructor() {
    this.client = new ClientBot()
    this.events = []
    this.commands = []
  }

  public async start(): Promise<void> {
    this.events = await loadEventsFromFiles(EVENTS_DIR)
    this.commands = await loadCommandsFromFiles(COMMANDS_DIR)
    this.startEventListeners()
    await this.client.login()
    await this.updateCommandsIfNeed()
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
    for (const event of this.events) {
      if (event.once) this.client.once(event.name, event.execute)
      else this.client.on(event.name, (...args) => event.execute(...args, this.commands))
    }
  }
}
