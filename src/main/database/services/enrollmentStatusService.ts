import { EnrollmentStatus, IEnrollmentStatus } from '../models'

interface CreateEnrollmentStatusDto extends IEnrollmentStatus {}

interface UpdateEnrollmentStatusDto extends Omit<Partial<IEnrollmentStatus>, 'status_id'> {}

export class EnrollmentStatusService {
  static async findAll(): Promise<IEnrollmentStatus[]> {
    return EnrollmentStatus.findAll({ raw: true })
  }

  static async findById(id: number): Promise<IEnrollmentStatus | null> {
    return EnrollmentStatus.findByPk(id, { raw: true })
  }

  static async create(data: CreateEnrollmentStatusDto): Promise<IEnrollmentStatus> {
    return EnrollmentStatus.create(data, { raw: true })
  }

  static async update(
    id: number,
    data: UpdateEnrollmentStatusDto
  ): Promise<[number, IEnrollmentStatus[]]> {
    return EnrollmentStatus.update(data, {
      where: { status_id: id },
      returning: true
    })
  }

  static async delete(id: number): Promise<number> {
    return EnrollmentStatus.destroy({
      where: { status_id: id }
    })
  }

  static async findByName(statusName: string): Promise<IEnrollmentStatus | null> {
    return EnrollmentStatus.findOne({
      raw: true,
      where: { status_name: statusName }
    })
  }

  static async getDefaultStatus(): Promise<IEnrollmentStatus | null> {
    return EnrollmentStatus.findOne({
      raw: true,
      where: { status_id: 1 }
    })
  }
}
