import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize'
import { sequelize } from '../config'

export class Teacher extends Model<InferAttributes<Teacher>, InferCreationAttributes<Teacher>> {
  declare teacher_id: CreationOptional<number>
  declare name: string
  declare photo: Buffer
  declare info: string
  declare university_id: number
}

Teacher.init(
  {
    teacher_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    photo: {
      type: DataTypes.BLOB
    },
    info: {
      type: DataTypes.TEXT
    },
    university_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'university',
        key: 'university_id'
      }
    }
  },
  {
    sequelize,
    tableName: 'teacher',
    timestamps: false
  }
)

export interface ITeacher extends InferAttributes<Teacher> {}
