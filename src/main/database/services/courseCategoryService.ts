import { CourseCategory, ICourseCategory } from '../models'

interface CreateCourseCategoryDto extends ICourseCategory {}

// Все поля из CourseCategory, кроме category_id
interface UpdateCourseCategoryDto extends Omit<Partial<ICourseCategory>, 'category_id'> {}

export class CourseCategoryService {
  static async findAll(): Promise<ICourseCategory[]> {
    return CourseCategory.findAll()
  }

  static async findById(id: number): Promise<ICourseCategory | null> {
    return CourseCategory.findByPk(id)
  }

  static async create(data: CreateCourseCategoryDto): Promise<ICourseCategory> {
    return CourseCategory.create(data)
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
      where: { category_name: categoryName }
    })
  }
}
