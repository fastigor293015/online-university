import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize'
import { sequelize } from '../config'

export class Course extends Model<InferAttributes<Course>, InferCreationAttributes<Course>> {
  declare course_id: CreationOptional<number>
  declare teacher_id: number
  declare university_id: number
  declare title: string
  declare start_date: Date
  declare length: number
  declare workload: string
  declare participants: CreationOptional<number>
  declare description: string
  declare plan: string
  declare requirements: string
  declare format_id: number
  declare recommended_readings: string
  declare certificate: CreationOptional<boolean>
  declare price: number
  declare category_id: number
  declare exam: CreationOptional<boolean>
  declare site: string
  declare other: string
}

Course.init(
  {
    course_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'teacher',
        key: 'teacher_id'
      }
    },
    university_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'university',
        key: 'university_id'
      }
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE
    },
    length: {
      type: DataTypes.INTEGER
    },
    workload: {
      type: DataTypes.STRING(100)
    },
    participants: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    description: {
      type: DataTypes.TEXT
    },
    plan: {
      type: DataTypes.TEXT
    },
    requirements: {
      type: DataTypes.TEXT
    },
    format_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'course_formats',
        key: 'format_id'
      }
    },
    recommended_readings: {
      type: DataTypes.TEXT
    },
    certificate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        min: 0
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'course_categories',
        key: 'category_id'
      }
    },
    exam: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    site: {
      type: DataTypes.STRING(100)
    },
    other: {
      type: DataTypes.TEXT
    }
  },
  {
    sequelize,
    tableName: 'course',
    timestamps: false
  }
)

export interface ICourse extends InferAttributes<Course> {}
