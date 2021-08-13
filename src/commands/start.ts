import {ExecuteCommand} from '../types'
import descriptions from '../description'
import replies from '../replies'

const command: ExecuteCommand = {
  name: 'start',
  description: descriptions.START,
  execute: async (interaction, storage) => {
    const guildStorage = await storage.getGuild(interaction.guild!.id)
    if (!guildStorage?.roleAcademyID) return interaction.editReply(replies.FIRST_SET_ROLE)
    await storage.editGuildActive(guildStorage.id, true)
    return  interaction.editReply(replies.ACTIVATED)
  }
}

export default command
