import {Model, ModelCtor, Options, Sequelize} from 'sequelize'
import {GuildModel, guildModelCreator} from './models/guild'
import {MemberModel, memberModelCreator} from './models/members'

const OPTIONS_STORAGE: Options = {
  dialect: 'sqlite',
  logging: false
}

export default class Storage {
  private readonly database: Sequelize
  private readonly Guilds: ModelCtor<Model>
  private readonly Members: ModelCtor<Model>

  public constructor(pathToStorage: string) {
    this.database = new Sequelize({...OPTIONS_STORAGE, storage: pathToStorage})
    this.Guilds = this.database.define(...guildModelCreator)
    this.Members = this.database.define(...memberModelCreator)
  }

  public async syncModels(clear?: boolean): Promise<void> {
    await Promise.all([
      this.Guilds.sync({force: clear}),
      this.Members.sync({force: clear})
    ])
  }

  public async addMember(userID: string, isMember: boolean): Promise<void> {
    await this.Members.create({userID, isMember})
  }

  public async editMember(userID: string, isMember: boolean): Promise<void> {
    await this.Members.update({isMember}, {where: {userID}})
  }

  public async getMemberByID(userID: string): Promise<MemberModel | null> {
    return await this.Members.findOne({where: {userID}}) as MemberModel | null
  }

  public async removeMember(userID: string, updatedAt?: Date): Promise<void> {
    await this.Members.destroy({where: {userID, updatedAt}})
  }

  public async addGuild(guildID: string, roleID: string, active: boolean): Promise<void> {
    await this.Guilds.create({id: guildID, roleID, active})
  }

  public async editGuild(guildID: string, newRoleID: string | null, newActive: boolean): Promise<void> {
    await this.Guilds.update({roleID: newRoleID, active: newActive}, {where: {id: guildID}})
  }

  public async getGuildByID(guildID: string): Promise<GuildModel | null> {
    return await this.Guilds.findOne({where: {id: guildID}}) as GuildModel | null
  }

  public async getGuilds(): Promise<GuildModel[]> {
    return await this.Guilds.findAll() as unknown as GuildModel[]
  }

  public async removeGuild(guildID: string): Promise<void> {
    await this.Guilds.destroy({where: {id: guildID}})
  }
}
