import {ExecuteCommand} from '../types'
import descriptions from '../description'
import replies from '../replies'
import { ApplicationCommandOptionType } from 'discord.js'

const command: ExecuteCommand = {
  name: 'set_role',
  description: descriptions.SET_ROLE,
  execute: async (interaction, storage) => {
    const role = interaction.options.get('role')?.role
    const roleBot = interaction.guild!.members.me?.roles.botRole
    if (!roleBot) return
    if (!role) return interaction.editReply(replies.SET_ROLE)
    if (roleBot.rawPosition <= role.position || role.position === 0) return interaction.editReply(replies.ROLE_SHOULD_LOWER)

    const guildStorage = await storage.getGuildByID(interaction.guild!.id)
    if (!guildStorage) await storage.addGuild(interaction.guild!.id, role.id, false)
    else await storage.editGuild(guildStorage.id, role.id, guildStorage.active)

    return interaction.editReply(replies.ROLE_ASSIGNED(role.name))
  },
  options: [
    {
      name: 'role',
      description: 'Роль которая будет назначаться участникам',
      type: ApplicationCommandOptionType.Role,
      required: true,
      choices: undefined,
      options: undefined
    }
  ]
}

export default command
