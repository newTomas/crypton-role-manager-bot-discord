import {readdirSync} from 'fs'
import {Command, ExecuteCommand} from './types'

export function isDifferentCommands(commandsOne: Command[], commandsTwo: Command[]): boolean {
  if (commandsOne.length !== commandsTwo.length) return true
  for (const valueCommandsOne of commandsOne) {
    const valueCommandsTwo = commandsTwo.find(value => {
      return value.name === valueCommandsOne.name && value.description === valueCommandsOne.description
    })
    if (!valueCommandsTwo) return true
  }
  return false
}

export async function loadCommandsFromFiles(pathToCommandsDirectory: string): Promise<ExecuteCommand[]> {
  const commandsExecute: ExecuteCommand[] = []
  const commandFiles = readdirSync(pathToCommandsDirectory)
  for (const file of commandFiles) {
    const fileCommand = await import(`${pathToCommandsDirectory}/${file}`) as {default: ExecuteCommand}
    const command = fileCommand.default
    commandsExecute.push(command)
  }
  return commandsExecute
}

export function throwIdenticalCommandNames(commands: Command[]): void {
  const names = commands.map(value => value.name)
  const setNames = new Set(names)
  if (setNames.size !== names.length) throw new Error('The names of the commands must be different')
}
