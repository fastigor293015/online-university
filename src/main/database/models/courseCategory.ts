import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize'
import { sequelize } from '../config'

export class CourseCategory extends Model<
  InferAttributes<CourseCategory>,
  InferCreationAttributes<CourseCategory>
> {
  declare category_id: CreationOptional<number>
  declare category_name: string
}

CourseCategory.init(
  {
    category_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    category_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    tableName: 'course_categories',
    timestamps: false
  }
)

export interface ICourseCategory extends InferAttributes<CourseCategory> {}
