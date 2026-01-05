export interface PGMetrics {
  status: 'healthy' | 'error'
  active_connections?: number
  waiting_connections?: number
  blocked_transactions?: number
  xact_commit?: number
  xact_rollback?: number
  blks_read?: number
  blks_hit?: number
  cache_hit_ratio?: string
  db_size?: string
  table_count?: number
  timestamp?: Date
  error?: string
}
const test = {
  status: 'healthy',
  active_connections: '1',
  waiting_connections: '10',
  blocked_transactions: '0',
  xact_commit: '21343',
  xact_rollback: '70',
  blks_read: '1360886996',
  blks_hit: '440574399',
  cache_hit_ratio: '24.4564995940662389',
  db_size: '1225 MB',
  table_count: '11',
  timestamp: '2026-01-05T04:06:52.830Z'
}
export interface PostgreSQLTools {
  pg_dump: boolean
  pg_restore: boolean
  psql: boolean
}

export interface BackupObject {
  success: boolean
  filePath?: string
  error?: string
}

export interface DBInfo {
  name: string
  size: string
  tablesCount: number
  totalRows: number
  lastBackup?: string
}

export interface User {
  user_id: number
  username: string
  password_hash: string
  role: string
  created_at: Date
  last_login?: Date
}

export interface AuthData {
  username: string
  password: string
}

export type AuthResponse =
  | {
      success: true
      message: string
      user: User
    }
  | {
      success: false
      message: string
    }

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
  encrypted_student_info?: string
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
