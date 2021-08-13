import {ExecuteCommand} from '../types'
import descriptions from '../description'
import replies from '../replies'

const command: ExecuteCommand = {
  name: 'set_role',
  description: descriptions.SET_ROLE,
  execute: async (interaction, storage) => {
    const role = interaction.options.getRole('role')
    const roleBot = interaction.guild!.me?.roles.botRole
    if (!roleBot) return
    if (!role) return interaction.editReply(replies.SET_ROLE)
    if (roleBot.rawPosition <= role.position || role.position === 0) return interaction.editReply(replies.ROLE_SHOULD_LOWER)

    const guildStorage = await storage.getGuild(interaction.guild!.id)
    if (!guildStorage) await storage.addGuild(interaction.guild!.id, role.id)
    else await storage.editGuildRoleAcademyID(guildStorage.id, role.id)

    return interaction.editReply(replies.ROLE_ASSIGNED(role.name))
  },
  options: [
    {
      name: 'role',
      description: 'Роль которая будет назначаться участникам',
      type: 'ROLE',
      required: true,
      choices: undefined,
      options: undefined
    }
  ]
}

export default command
