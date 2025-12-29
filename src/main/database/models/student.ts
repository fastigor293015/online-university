import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize'
import { sequelize } from '../config'

export class Student extends Model<InferAttributes<Student>, InferCreationAttributes<Student>> {
  declare student_id: CreationOptional<number>
  declare student_name: string
  declare student_photo: Buffer
  declare student_info: string
  declare education: string
  declare work: string
  declare resume: string
  declare email: string
  declare resume_allowed: boolean
  declare encrypted_student_info: string
}

Student.init(
  {
    student_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    student_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    student_photo: {
      type: DataTypes.BLOB
    },
    student_info: {
      type: DataTypes.TEXT
    },
    education: {
      type: DataTypes.STRING(100)
    },
    work: {
      type: DataTypes.STRING(100)
    },
    resume: {
      type: DataTypes.TEXT
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    resume_allowed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    encrypted_student_info: {
      type: DataTypes.TEXT
    }
  },
  {
    sequelize,
    tableName: 'student',
    timestamps: false
  }
)

export interface IStudent extends InferAttributes<Student> {}
