import { IUniversity, University } from '../models'

interface CreateUniversityDto extends IUniversity {}

interface UpdateUniversityDto extends Omit<Partial<IUniversity>, 'university_id'> {}

export class UniversityService {
  static async findAll(): Promise<IUniversity[]> {
    return University.findAll({ raw: true })
  }

  static async findById(id: number): Promise<IUniversity | null> {
    return University.findByPk(id, { raw: true })
  }

  static async create(data: CreateUniversityDto): Promise<IUniversity> {
    return University.create(data, { raw: true })
  }

  static async update(id: number, data: UpdateUniversityDto): Promise<[number, IUniversity[]]> {
    return University.update(data, {
      where: { university_id: id },
      returning: true
    })
  }

  static async delete(id: number): Promise<number> {
    return University.destroy({
      where: { university_id: id }
    })
  }

  static async count(): Promise<number> {
    return University.count()
  }
}
