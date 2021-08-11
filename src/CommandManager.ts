import {ApplicationCommandManager} from 'discord.js'
import {Command} from './types'

export default class CommandManager {
  private readonly applicationCommandManager: ApplicationCommandManager

  public constructor(applicationCommandManager: ApplicationCommandManager) {
    this.applicationCommandManager = applicationCommandManager
  }

  public async updateCommands(commands: Command[]): Promise<void> {
    await this.applicationCommandManager.set(commands)
  }

  public async fetchCommands(): Promise<Command[]> {
    const commands = await this.applicationCommandManager.fetch()
    return commands.map(value => {
      return {name: value.name, description: value.description} as Command
    })
  }
}
