import {ExecuteCommand} from '../types'
import descriptions from '../description'
import replies from '../replies'

const command: ExecuteCommand = {
  name: 'stop',
  description: descriptions.STOP,
  execute: async (interaction, storage) => {
    const guildStorage = await storage.getGuildByID(interaction.guild!.id)
    if (guildStorage) await storage.editGuild(guildStorage.id, guildStorage.roleID, false)
    await interaction.editReply(replies.DEACTIVATED)
  }
}

export default command
