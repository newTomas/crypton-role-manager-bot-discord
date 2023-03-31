import {AuditLogEvent, Guild, GuildMember, Permissions, PermissionsBitField} from 'discord.js'
import Storage from './Storage/Storage'
import ClientBot from './ClientBot'
import {sleep} from './utils'

type MillisecondsIntervals = {
  guild: number,
  member: number
}

export default class RoleAssigner {
  private readonly storage: Storage
  private readonly client: ClientBot
  private readonly millisecondsIntervals: MillisecondsIntervals
  private roleAcademyID?: string

  public constructor(storage: Storage, client: ClientBot) {
    this.storage = storage
    this.client = client
    this.millisecondsIntervals = {guild: 120, member: 40}
    // TODO Во избежание лимитов API Discord (не более 50 запросов/сек).
    //  Пока пойдет такой вариант, но в будущем обязательно заменить на более лучшее решение.
    //  При таких настройках изменение роли каждому участнику занимает ≈40мс и плюс ≈120мс на каждый сервер.
    //  Если будет 10000 участников на сервере, которым требуется изменить роль, то это займет ≈7 минут.
  }

  private static async isCorrectRoleAcademy(guild: Guild, roleID: string): Promise<boolean> {
    const roleGuild = await guild.roles.fetch(roleID)
    const positionRoleGuild = roleGuild?.rawPosition
    const positionBotRole = guild.members.me?.roles.botRole?.rawPosition
    return !!positionRoleGuild && !!positionBotRole && positionRoleGuild < positionBotRole
  }

  public async startAssigning(): Promise<void> {
    await this.assignInEachGuild()
  }

  private async assignInEachGuild(): Promise<void> {
    const guildsStorage = await this.storage.getGuilds()
    for (const guildStorage of guildsStorage) {
      if (!guildStorage.roleID || !guildStorage.active) continue

      await sleep(this.millisecondsIntervals.guild)

      const guild = await this.client.getGuildByID(guildStorage.id)
      if (!guild) {
        await this.storage.removeGuild(guildStorage.id)
        continue
      }

      const isCorrectRoleAcademy = await RoleAssigner.isCorrectRoleAcademy(guild, guildStorage.roleID)
      if (!isCorrectRoleAcademy) {
        await this.storage.editGuild(guildStorage.id, null, false)
        continue
      }

      this.roleAcademyID = guildStorage.roleID
      await this.assignMembers(guild)
    }
  }

  private async assignMembers(guild: Guild): Promise<void> {
    const members = await guild.members.fetch()
    for (const member of members.values()) {
      await this.assignMember(member)
    }
  }

  private async assignMember(member: GuildMember): Promise<void> {
    const isAdmin = member.permissions.has(PermissionsBitField.Flags.Administrator)
    if (member.user.bot || isAdmin) return

    const memberStorage = await this.storage.getMemberByID(member.user.id)
    if (!memberStorage) return

    const hasRoleAcademy = member.roles.cache.has(this.roleAcademyID!)
    if (memberStorage.isMember && !hasRoleAcademy) {
      await sleep(this.millisecondsIntervals.member)
      await member.roles.add(this.roleAcademyID!)
      console.info(member.user.tag, '||', member.guild.name, '|| added role')
    } else if (!memberStorage.isMember && hasRoleAcademy) {
      await sleep(this.millisecondsIntervals.member)
      await member.roles.remove(this.roleAcademyID!)
      console.info(member.user.tag, '||', member.guild.name, '|| removed role')
    } else if (!memberStorage.isMember && !hasRoleAcademy) {
      await this.storage.removeMember(memberStorage.userID, memberStorage.updatedAt)
    }
  }
}
