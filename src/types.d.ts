import {ClientEvents, CommandInteraction} from 'discord.js'
import Storage from './Storage/Storage'

declare interface ExecuteCommand extends Command {
  execute: (interaction: CommandInteraction, storage: Storage) => void
}

declare interface Command {
  name: string,
  description: string,
  options?: OptionCommand[]
}

declare interface OptionCommand {
  name: string,
  description: string,
  type: 'STRING' | 'INTEGER' | 'NUMBER' | 'BOOLEAN' | 'USER' | 'CHANNEL' | 'ROLE' | 'MENTIONABLE'
  required?: boolean,
  choices: undefined,
  options: undefined
}

declare interface ExecuteEvent {
  name: keyof ClientEvents,
  once: boolean,
  execute: (...args: any[]) => boolean | Promise<boolean>
}
