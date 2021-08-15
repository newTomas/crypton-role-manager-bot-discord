import {Interaction, Permissions} from 'discord.js'
import {ExecuteCommand, ExecuteEvent} from '../types'
import Storage from '../Storage/Storage'
import replies from '../replies'

const event: ExecuteEvent = {
  name: 'interactionCreate',
  once: false,
  execute: async (interaction: Interaction, commands: ExecuteCommand[], storage: Storage) => {
    if (!interaction.isCommand() || !interaction.guild || interaction.user.bot) return false
    await interaction.deferReply({ephemeral: true})

    const permissions = interaction.member?.permissions as Permissions
    if (!permissions || !permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      await interaction.editReply(replies.ONLY_ADMIN)
      return true
    }

    const command = commands.find(value => value.name === interaction.commandName)
    if (!command) {
      await interaction.editReply(replies.NOT_FOUND_COMMAND)
      return true
    }

    try {
      await command.execute(interaction, storage)
    } catch (error) {
      console.error(error)
      await interaction.editReply(replies.COMMAND_ERROR)
    }
    return true
  }
}

export default event
