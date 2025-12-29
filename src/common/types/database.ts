export interface Course {
  course_id: number
  teacher_id: number
  university_id: number
  title: string
  start_date: Date
  length: number
  workload: string
  participants: number
  description: string
  plan: string
  requirements: string
  format_id: number
  recommended_readings: string
  certificate: boolean
  price: number
  category_id: number
  exam: boolean
  site: string
  other: string
}

export interface Student {
  student_id: number
  student_name: string
  student_photo?: string // В браузере используем base64 вместо Buffer
  student_info: string
  education: string
  work: string
  resume: string
  email: string
  resume_allowed: boolean
}

export interface Teacher {
  teacher_id: number
  name: string
  photo?: string // В браузере используем base64 вместо Buffer
  info: string
  university_id: number
}

export interface University {
  university_id: number
  uni_title: string
  uni_address: string
  uni_site: string
  uni_contacts: string
}

export interface Enrollment {
  student_id: number
  course_id: number
  enrollment_date: Date
  completion_date?: Date
  certificate_issued: boolean
  resume_published: boolean
  status_id: number
}

export interface CourseCategory {
  category_id: number
  category_name: string
}

export interface CourseFormat {
  format_id: number
  format_name: string
}

export interface EnrollmentStatus {
  status_id: number
  status_name: string
}

// DTO для создания/обновления
export interface CreateCourseDto {
  teacher_id: number
  university_id: number
  title: string
  start_date?: Date
  length?: number
  workload?: string
  description?: string
  plan?: string
  requirements?: string
  format_id: number
  recommended_readings?: string
  certificate?: boolean
  price: number
  category_id: number
  exam?: boolean
  site?: string
  other?: string
}

export interface UpdateCourseDto {
  teacher_id?: number
  university_id?: number
  title?: string
  start_date?: Date
  length?: number
  workload?: string
  description?: string
  plan?: string
  requirements?: string
  format_id?: number
  recommended_readings?: string
  certificate?: boolean
  price?: number
  category_id?: number
  exam?: boolean
  site?: string
  other?: string
}

// Фильтры
export interface CourseFilters {
  categoryId?: number
  formatId?: number
  universityId?: number
  teacherId?: number
  hasCertificate?: boolean
  hasExam?: boolean
  minPrice?: number
  maxPrice?: number
  search?: string
  limit?: number
  offset?: number
}
