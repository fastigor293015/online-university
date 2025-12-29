import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize'
import { sequelize } from '../config'

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare user_id: CreationOptional<number>
  declare username: string
  declare password_hash: string
  declare role: CreationOptional<string>
  declare created_at: CreationOptional<Date>
  declare last_login: CreationOptional<Date>
}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(20),
      defaultValue: 'viewer'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    last_login: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false
  }
)

export interface IUser extends InferAttributes<User> {}
