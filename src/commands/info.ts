import {ExecuteCommand} from '../types'
import descriptions from '../description'
import replies from '../replies'

const command: ExecuteCommand = {
  name: 'info',
  description: descriptions.INFO,
  execute: async (interaction, storage) => {
    const guildStorage = await storage.getGuild(interaction.guild!.id)
    const role = interaction.guild!.roles.cache.find(value => value.id === guildStorage?.roleAcademyID)
    await interaction.editReply(replies.INFO(role?.name, guildStorage?.active))
  }
}

export default command
