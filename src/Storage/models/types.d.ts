import {ModelAttributes} from 'sequelize'

declare type ModelSQLite = [string, ModelAttributes]
declare interface GuildSQLite {
  id: string,
  role_academy_id: string,
  active: boolean
}
