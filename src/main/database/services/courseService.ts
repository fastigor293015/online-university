import { Op } from 'sequelize'
import {
  Course,
  CourseCategory,
  CourseFormat,
  ICourse,
  IStudent,
  Student,
  Teacher,
  University
} from '../models'

interface CreateCourseDto extends ICourse {}

// Все поля из Course, кроме course_id
interface UpdateCourseDto extends Omit<Partial<ICourse>, 'course_id'> {}

export class CourseService {
  static async findAll(): Promise<ICourse[]> {
    return Course.findAll()
  }

  static async findById(id: number): Promise<ICourse | null> {
    return Course.findByPk(id, {
      include: [
        {
          model: Teacher,
          as: 'Teacher',
          include: [
            {
              model: University,
              as: 'University'
            }
          ]
        },
        {
          model: University,
          as: 'University'
        },
        {
          model: CourseCategory,
          as: 'CourseCategory'
        },
        {
          model: CourseFormat,
          as: 'CourseFormat'
        }
      ]
    })
  }

  static async create(data: CreateCourseDto): Promise<ICourse> {
    return Course.create(data)
  }

  static async update(id: number, data: UpdateCourseDto): Promise<[number, ICourse[]]> {
    return Course.update(data, {
      where: { course_id: id },
      returning: true
    })
  }

  static async delete(id: number): Promise<number> {
    return Course.destroy({
      where: { course_id: id }
    })
  }

  static async getActiveCourses(): Promise<ICourse[]> {
    const currentDate = new Date()

    return Course.findAll({
      where: {
        start_date: { [Op.gte]: currentDate }
      },
      include: [
        {
          model: Teacher,
          as: 'Teacher'
        },
        {
          model: University,
          as: 'University'
        }
      ],
      order: [['start_date', 'ASC']]
    })
  }

  static async getCourseStudents(courseId: number): Promise<IStudent[]> {
    const course = await Course.findByPk(courseId, {
      include: [
        {
          model: Student,
          through: {
            attributes: ['enrollment_date', 'completion_date', 'status_id'],
            as: 'enrollmentInfo'
          },
          as: 'students'
        }
      ]
    })

    return course?.students || []
  }

  static async countByCategory(categoryId: number): Promise<number> {
    return Course.count({
      where: { category_id: categoryId }
    })
  }

  static async countByUniversity(universityId: number): Promise<number> {
    return Course.count({
      where: { university_id: universityId }
    })
  }
}
