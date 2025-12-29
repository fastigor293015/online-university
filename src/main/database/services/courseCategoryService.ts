import { CourseCategory, ICourseCategory } from '../models'

interface CreateCourseCategoryDto extends ICourseCategory {}

// Все поля из CourseCategory, кроме category_id
interface UpdateCourseCategoryDto extends Omit<Partial<ICourseCategory>, 'category_id'> {}

export class CourseCategoryService {
  static async findAll(): Promise<ICourseCategory[]> {
    return CourseCategory.findAll({ raw: true })
  }

  static async findById(id: number): Promise<ICourseCategory | null> {
    return CourseCategory.findByPk(id, { raw: true })
  }

  static async create(data: CreateCourseCategoryDto): Promise<ICourseCategory> {
    return CourseCategory.create(data, { raw: true })
  }

  static async update(
    id: number,
    data: UpdateCourseCategoryDto
  ): Promise<[number, ICourseCategory[]]> {
    return CourseCategory.update(data, {
      where: { category_id: id },
      returning: true
    })
  }

  static async delete(id: number): Promise<number> {
    return CourseCategory.destroy({
      where: { category_id: id }
    })
  }

  static async findByName(categoryName: string): Promise<ICourseCategory | null> {
    return CourseCategory.findOne({
      raw: true,
      where: { category_name: categoryName }
    })
  }
}
