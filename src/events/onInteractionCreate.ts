import {Interaction, Permissions} from 'discord.js'
import {ExecuteCommand, ExecuteEvent} from '../types'
import Storage from '../Storage/Storage'
import replies from '../replies'

const event: ExecuteEvent = {
  name: 'interactionCreate',
  once: false,
  execute: async (interaction: Interaction, commands: ExecuteCommand[], storage: Storage) => {
    if (!interaction.isCommand() || !interaction.guild || interaction.user.bot) return
    await interaction.deferReply({ephemeral: true})

    const permissions = interaction.member?.permissions as Permissions
    if (!permissions || !permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.editReply(replies.ONLY_ADMIN)

    const command = commands.find(value => value.name === interaction.commandName)
    if (!command) return interaction.editReply(replies.NOT_FOUND_COMMAND)

    try {
      await command.execute(interaction, storage)
    } catch (error) {
      console.error(error)
      await interaction.editReply(replies.COMMAND_ERROR)
    }
    return
  }
}

export default event
