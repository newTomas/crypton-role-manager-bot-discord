import {ExecuteCommand} from '../types'
import descriptions from '../description'
import replies from '../replies'

const command: ExecuteCommand = {
  name: 'stop',
  description: descriptions.STOP,
  execute: async (interaction, storage) => {
    await storage.editGuildActive(interaction.guild!.id, false)
    await interaction.editReply(replies.DEACTIVATED)
  }
}

export default command
