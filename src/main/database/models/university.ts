import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize'
import { sequelize } from '../config'

export class University extends Model<
  InferAttributes<University>,
  InferCreationAttributes<University>
> {
  declare university_id: CreationOptional<number>
  declare uni_title: string
  declare uni_address: string
  declare uni_site: string
  declare uni_contacts: string
}

University.init(
  {
    university_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    uni_title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    uni_address: {
      type: DataTypes.STRING(100)
    },
    uni_site: {
      type: DataTypes.STRING(100)
    },
    uni_contacts: {
      type: DataTypes.TEXT
    }
  },
  {
    sequelize,
    tableName: 'university',
    timestamps: false
  }
)

export interface IUniversity extends InferAttributes<University> {}
