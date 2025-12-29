import { Course, ICourse, IStudent, Student } from '../models'

interface CreateStudentDto extends IStudent {}

interface UpdateStudentDto extends Omit<Partial<IStudent>, 'student_id'> {}

export class StudentService {
  static async findAll(): Promise<IStudent[]> {
    return Student.findAll({ raw: true })
  }

  static async findById(id: number): Promise<IStudent | null> {
    return Student.findByPk(id, { raw: true })
  }

  static async findByEmail(email: string): Promise<IStudent | null> {
    return Student.findOne({
      raw: true,
      where: { email }
    })
  }

  static async create(data: CreateStudentDto): Promise<IStudent> {
    return Student.create(data, { raw: true })
  }

  static async update(id: number, data: UpdateStudentDto): Promise<[number, IStudent[]]> {
    return Student.update(data, {
      where: { student_id: id },
      returning: true
    })
  }

  static async delete(id: number): Promise<number> {
    return Student.destroy({
      where: { student_id: id }
    })
  }

  static async getStudentCourses(studentId: number): Promise<ICourse[]> {
    const student = await Student.findByPk(studentId, {
      raw: true,
      include: [
        {
          model: Course,
          through: {
            attributes: ['enrollment_date', 'completion_date', 'status_id'],
            as: 'enrollmentInfo'
          },
          as: 'courses'
        }
      ]
    })

    return student?.courses || []
  }

  static async updateResumePermission(
    studentId: number,
    allowed: boolean
  ): Promise<[number, IStudent[]]> {
    return Student.update(
      { resume_allowed: allowed },
      {
        where: { student_id: studentId },
        returning: true
      }
    )
  }

  static async count(): Promise<number> {
    return Student.count()
  }
}
