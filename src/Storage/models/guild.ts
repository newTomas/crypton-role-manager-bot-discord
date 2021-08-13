import {DataTypes} from 'sequelize'
import {ModelSQLite} from './types'

const guildModel: ModelSQLite = [
  'Guild',
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    role_academy_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }
]

export default guildModel
