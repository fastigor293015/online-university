import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize'
import { sequelize } from '../config'

export class EnrollmentStatus extends Model<
  InferAttributes<EnrollmentStatus>,
  InferCreationAttributes<EnrollmentStatus>
> {
  declare status_id: CreationOptional<number>
  declare status_name: string
}

EnrollmentStatus.init(
  {
    status_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    status_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    tableName: 'enrollment_statuses',
    timestamps: false
  }
)

export interface IEnrollmentStatus extends InferAttributes<EnrollmentStatus> {}
