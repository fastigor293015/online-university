import { CourseFormat, ICourseFormat } from '../models'

interface CreateCourseFormatDto extends ICourseFormat {}

// Все поля из CourseFormat, кроме format_id
interface UpdateCourseFormatDto extends Omit<Partial<ICourseFormat>, 'format_id'> {}

export class CourseFormatService {
  static async findAll(): Promise<ICourseFormat[]> {
    return CourseFormat.findAll()
  }

  static async findById(id: number): Promise<ICourseFormat | null> {
    return CourseFormat.findByPk(id)
  }

  static async create(data: CreateCourseFormatDto): Promise<ICourseFormat> {
    return CourseFormat.create(data)
  }

  static async update(id: number, data: UpdateCourseFormatDto): Promise<[number, ICourseFormat[]]> {
    return CourseFormat.update(data, {
      where: { format_id: id },
      returning: true
    })
  }

  static async delete(id: number): Promise<number> {
    return CourseFormat.destroy({
      where: { format_id: id }
    })
  }

  static async findByName(formatName: string): Promise<ICourseFormat | null> {
    return CourseFormat.findOne({
      where: { format_name: formatName }
    })
  }
}
