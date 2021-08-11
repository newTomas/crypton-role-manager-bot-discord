import {CommandInteraction} from 'discord.js'
import {EventNames} from './enums'

declare interface ExecuteCommand extends Command {
  execute: (interaction: CommandInteraction) => Promise<void> | void
}

declare interface Command {
  name: string,
  description: string
}

declare interface ExecuteEvent {
  name: EventNames,
  once: boolean,
  execute: (...args: any) => void
}
