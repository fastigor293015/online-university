import {
  Course,
  Enrollment,
  EnrollmentStatus,
  IEnrollment,
  Student,
  Teacher,
  University
} from '../models'

interface CreateEnrollmentDto extends IEnrollment {}

interface UpdateEnrollmentDto extends Pick<
  Partial<IEnrollment>,
  'completion_date' | 'certificate_issued' | 'resume_published' | 'status_id'
> {}

export class EnrollmentService {
  static async findAll(): Promise<IEnrollment[]> {
    return Enrollment.findAll({ raw: true })
  }

  static async findOne(studentId: number, courseId: number): Promise<IEnrollment | null> {
    return Enrollment.findOne({
      raw: true,
      where: { student_id: studentId, course_id: courseId },
      include: [
        {
          model: Student,
          as: 'Student'
        },
        {
          model: Course,
          as: 'Course'
        },
        {
          model: EnrollmentStatus,
          as: 'EnrollmentStatus'
        }
      ]
    })
  }

  static async create(data: CreateEnrollmentDto): Promise<IEnrollment> {
    return Enrollment.create(
      {
        ...data,
        status_id: data.status_id || 1 // Default status
      },
      { raw: true }
    )
  }

  static async update(
    studentId: number,
    courseId: number,
    data: UpdateEnrollmentDto
  ): Promise<[number, IEnrollment[]]> {
    return Enrollment.update(data, {
      where: { student_id: studentId, course_id: courseId },
      returning: true
    })
  }

  static async delete(studentId: number, courseId: number): Promise<number> {
    return Enrollment.destroy({
      where: { student_id: studentId, course_id: courseId }
    })
  }

  static async complete(
    studentId: number,
    courseId: number,
    certificateIssued: boolean = true
  ): Promise<[number, IEnrollment[]]> {
    return Enrollment.update(
      {
        completion_date: new Date(),
        certificate_issued: certificateIssued,
        status_id: 2 // Assuming 2 is "completed" status
      },
      {
        where: { student_id: studentId, course_id: courseId },
        returning: true
      }
    )
  }

  static async updateStatus(
    studentId: number,
    courseId: number,
    statusId: number
  ): Promise<[number, IEnrollment[]]> {
    return Enrollment.update(
      { status_id: statusId },
      {
        where: { student_id: studentId, course_id: courseId },
        returning: true
      }
    )
  }

  static async publishResume(
    studentId: number,
    courseId: number
  ): Promise<[number, IEnrollment[]]> {
    return Enrollment.update(
      { resume_published: true },
      {
        where: { student_id: studentId, course_id: courseId },
        returning: true
      }
    )
  }

  static async getStudentEnrollments(studentId: number): Promise<IEnrollment[]> {
    return Enrollment.findAll({
      raw: true,
      where: { student_id: studentId },
      include: [
        {
          model: Course,
          as: 'Course',
          include: [
            {
              model: Teacher,
              as: 'Teacher'
            },
            {
              model: University,
              as: 'University'
            }
          ]
        },
        {
          model: EnrollmentStatus,
          as: 'EnrollmentStatus'
        }
      ],
      order: [['enrollment_date', 'DESC']]
    })
  }

  static async getCourseEnrollments(courseId: number): Promise<IEnrollment[]> {
    return Enrollment.findAll({
      raw: true,
      where: { course_id: courseId },
      include: [
        {
          model: Student,
          as: 'Student'
        },
        {
          model: EnrollmentStatus,
          as: 'EnrollmentStatus'
        }
      ],
      order: [['enrollment_date', 'ASC']]
    })
  }

  static async getActiveEnrollmentsCount(courseId: number): Promise<number> {
    return Enrollment.count({
      where: {
        course_id: courseId,
        status_id: 1 // Assuming 1 is "active" status
      }
    })
  }

  static async getCompletedEnrollmentsCount(courseId: number): Promise<number> {
    return Enrollment.count({
      where: {
        course_id: courseId,
        status_id: 2 // Assuming 2 is "completed" status
      }
    })
  }
}
