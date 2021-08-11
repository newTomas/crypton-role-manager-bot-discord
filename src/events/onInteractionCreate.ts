import {Interaction} from 'discord.js'
import {ExecuteCommand, ExecuteEvent} from '../types'
import {EventNames} from '../enums'

const event: ExecuteEvent = {
  name: EventNames.interactionCreate,
  once: false,
  execute: (interaction: Interaction, commands: ExecuteCommand[]) => {
    if (!interaction.isCommand()) return
    const command = commands.find(value => value.name === interaction.commandName)
    if (!command) return interaction.reply({content: 'Такой команды не существует!', ephemeral: true})

    try {
      command.execute(interaction)
    } catch (error) {
      console.error(error)
      return interaction.reply({content: 'При выполнении этой команды произошла ошибка!', ephemeral: true})
    }
    return
  }
}

export default event
