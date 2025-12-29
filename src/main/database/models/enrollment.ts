import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize'
import { sequelize } from '../config/sequelize'

export class Enrollment extends Model<
  InferAttributes<Enrollment>,
  InferCreationAttributes<Enrollment>
> {
  declare student_id: number
  declare course_id: number
  declare enrollment_date: CreationOptional<Date> /* При создании указывать этот атрибут необязательно */
  declare completion_date: CreationOptional<Date> /* При создании указывать этот атрибут необязательно */
  declare certificate_issued: CreationOptional<boolean> /* При создании указывать этот атрибут необязательно */
  declare resume_published: CreationOptional<boolean> /* При создании указывать этот атрибут необязательно */
  declare status_id: CreationOptional<number> /* При создании указывать этот атрибут необязательно */
}

Enrollment.init(
  {
    student_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'student',
        key: 'student_id'
      }
    },
    course_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'course',
        key: 'course_id'
      }
    },
    enrollment_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    completion_date: {
      type: DataTypes.DATE,
      validate: {
        isAfterOrEqualEnrollmentDate(value: Date) {
          if (value && value < this.enrollment_date) {
            throw new Error('Completion date must be after or equal to enrollment date')
          }
        }
      }
    },
    certificate_issued: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    resume_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status_id: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      references: {
        model: 'enrollment_statuses',
        key: 'status_id'
      }
    }
  },
  {
    sequelize,
    tableName: 'enrollment',
    timestamps: false
  }
)

export interface IEnrollment extends InferAttributes<Enrollment> {}
