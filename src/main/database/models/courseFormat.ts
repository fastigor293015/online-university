import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize'
import { sequelize } from '../config'

export class CourseFormat extends Model<
  InferAttributes<CourseFormat>,
  InferCreationAttributes<CourseFormat>
> {
  declare format_id: CreationOptional<number>
  declare format_name: string
}

CourseFormat.init(
  {
    format_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    format_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    tableName: 'course_formats',
    timestamps: false
  }
)

export interface ICourseFormat extends InferAttributes<CourseFormat> {}
