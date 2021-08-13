import {Guild, GuildMember, Permissions} from 'discord.js'
import Storage from './Storage/Storage'
import CryptonData from './CryptonData'
import ClientBot from './ClientBot'
import {sleep} from './utils'

type MillisecondsIntervals = {
  guild: number,
  member: number
}

export default class RoleAssigner {
  private readonly storage: Storage
  private readonly crypton: CryptonData
  private readonly client: ClientBot
  private readonly millisecondsIntervals: MillisecondsIntervals

  public constructor(storage: Storage, crypton: CryptonData, client: ClientBot) {
    this.storage = storage
    this.crypton = crypton
    this.client = client
    this.millisecondsIntervals = {guild: 120, member: 40}
    // TODO Во избежание лимитов API Discord (не более 50 запросов/сек).
    //  Пока пойдет такой вариант, но в будущем обязательно заменить на более лучшее решение.
    //  При таких настройках изменение роли каждому участнику занимает ≈160мс.
    //  Если будет 1500 участников, которым требуется изменить роль, то это займет ≈5 минут.
  }

  private static async isCorrectRoleAcademy(guild: Guild, roleAcademyID: string): Promise<boolean> {
    const roleAcademyGuild = await guild.roles.fetch(roleAcademyID)
    const positionRoleAcademyGuild = roleAcademyGuild?.rawPosition
    const positionBotRole = guild.me?.roles.botRole?.rawPosition
    return !!positionRoleAcademyGuild && !!positionBotRole && positionRoleAcademyGuild < positionBotRole
  }

  public async startAssigning(): Promise<void> {
    const guildsStorage = await this.storage.getGuilds()
    await this.assignInEachGuild(guildsStorage)
  }

  private async assignInEachGuild(guildsStorage: GuildModel[]): Promise<void> {
    for (const guildStorage of guildsStorage) {
      await sleep(this.millisecondsIntervals.guild)
      if (!guildStorage.roleAcademyID || !guildStorage.active) continue

      const guild = await this.client.getGuildByID(guildStorage.id)
      if (!guild || guild.deleted) continue

      const isCorrectRoleAcademy = await RoleAssigner.isCorrectRoleAcademy(guild, guildStorage.roleAcademyID)
      if (!isCorrectRoleAcademy) continue

      const members = await guild.members.fetch()
      await this.assignMembers(members.values(), guildStorage.roleAcademyID)
    }
  }

  private async assignMembers(members: IterableIterator<GuildMember>, roleAcademyID: string): Promise<void> {
    for (const member of members) {
      const isAdmin = member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
      if (member.user.bot || member.deleted || isAdmin) continue
      const hasRoleAcademy = member.roles.cache.has(roleAcademyID)
      await sleep(this.millisecondsIntervals.member)
      const isMemberCrypton = this.crypton.isMember(member.user.tag)

      if (isMemberCrypton && !hasRoleAcademy) {
        await member.roles.add(roleAcademyID)
        console.info(member.user.tag, '||', member.guild.name, '|| added role')
      } else if (!isMemberCrypton && hasRoleAcademy) {
        await member.roles.remove(roleAcademyID)
        console.info(member.user.tag, '||', member.guild.name, '|| removed role')
      }
    }
  }
}
