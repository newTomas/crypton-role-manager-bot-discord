import {ExecuteCommand} from '../types'
import descriptions from '../description'
import replies from '../replies'

const command: ExecuteCommand = {
  name: 'info',
  description: descriptions.INFO,
  execute: async (interaction, storage) => {
    const guildStorage = await storage.getGuildByID(interaction.guild!.id)
    const role = guildStorage?.roleID ? interaction.guild!.roles.cache.get(guildStorage.roleID) : null
    await interaction.editReply(replies.INFO(role?.name, guildStorage?.active))
  }
}

export default command
