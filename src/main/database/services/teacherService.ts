import { ITeacher, Teacher, University } from '../models'

interface CreateTeacherDto extends ITeacher {}

interface UpdateTeacherDto extends Omit<Partial<ITeacher>, 'teacher_id'> {}

export class TeacherService {
  static async findAll(): Promise<ITeacher[]> {
    return Teacher.findAll({ raw: true })
  }

  static async findById(id: number): Promise<ITeacher | null> {
    return Teacher.findByPk(id, {
      raw: true,
      include: [
        {
          model: University,
          as: 'University'
        }
      ]
    })
  }

  static async create(data: CreateTeacherDto): Promise<ITeacher> {
    return Teacher.create(data, { raw: true })
  }

  static async update(id: number, data: UpdateTeacherDto): Promise<[number, ITeacher[]]> {
    return Teacher.update(data, {
      where: { teacher_id: id },
      returning: true
    })
  }

  static async delete(id: number): Promise<number> {
    return Teacher.destroy({
      where: { teacher_id: id }
    })
  }

  static async findByUniversity(universityId: number): Promise<ITeacher[]> {
    return Teacher.findAll({
      raw: true,
      where: { university_id: universityId },
      include: [
        {
          model: University,
          as: 'University'
        }
      ],
      order: [['name', 'ASC']]
    })
  }

  static async countByUniversity(universityId: number): Promise<number> {
    return Teacher.count({
      where: { university_id: universityId }
    })
  }
}
