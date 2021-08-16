import {DataTypes} from 'sequelize'
import {ModelCreator} from './types'

export const memberModelCreator: ModelCreator = [
  'Member',
  {
    userID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    isMember: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }
]

export interface MemberModel {
  userID: string,
  isMember: boolean,
  updatedAt: Date
}
