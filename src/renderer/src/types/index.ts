// Основные типы данных
export interface University {
  universityId: number
  uniTitle: string
  uniAddress?: string
  uniSite?: string
  uniContacts?: string
}

export interface Teacher {
  teacherId: number
  name: string
  photo?: Buffer
  info?: string
  universityId: number
  university?: University
}

export interface Student {
  studentId: number
  studentName: string
  studentPhoto?: Buffer
  studentInfo?: string
  education?: string
  work?: string
  resume?: string
  email: string
  resumeAllowed: boolean
}

export interface CourseCategory {
  categoryId: number
  categoryName: string
}

export interface CourseFormat {
  formatId: number
  formatName: string
}

export interface EnrollmentStatus {
  statusId: number
  statusName: string
}

export interface Course {
  courseId: number
  teacherId: number
  universityId: number
  title: string
  startDate: Date
  length?: number
  workload?: string
  participants?: number
  description?: string
  plan?: string
  requirements?: string
  formatId: number
  recommendedReadings?: string
  certificate: boolean
  price: number
  categoryId: number
  exam: boolean
  site?: string
  other?: string
  teacher?: Teacher
  university?: University
  category?: CourseCategory
  format?: CourseFormat
}

export interface Enrollment {
  studentId: number
  courseId: number
  enrollmentDate: Date
  completionDate?: Date
  certificateIssued: boolean
  resumePublished: boolean
  statusId: number
  student?: Student
  course?: Course
  status?: EnrollmentStatus
}

// Типы для форм
export interface UniversityFormData {
  uniTitle: string
  uniAddress?: string
  uniSite?: string
  uniContacts?: string
}

export interface TeacherFormData {
  name: string
  universityId: number
  photo?: File
  info?: string
}

export interface StudentFormData {
  studentName: string
  email: string
  education?: string
  work?: string
  resume?: string
  resumeAllowed: boolean
}

export interface CourseFormData {
  title: string
  teacherId: number
  universityId: number
  startDate: Date
  length?: number
  workload?: string
  description?: string
  plan?: string
  requirements?: string
  formatId: number
  recommendedReadings?: string
  certificate: boolean
  price: number
  categoryId: number
  exam: boolean
  site?: string
  other?: string
}

export interface EnrollmentFormData {
  studentId: number
  courseId: number
  statusId: number
}

// Типы для API ответов
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Типы для фильтров
export interface FilterOptions {
  search?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CourseFilter extends FilterOptions {
  categoryId?: number
  formatId?: number
  universityId?: number
  teacherId?: number
  startDateFrom?: Date
  startDateTo?: Date
  minPrice?: number
  maxPrice?: number
}

export interface EnrollmentFilter extends FilterOptions {
  studentId?: number
  courseId?: number
  statusId?: number
  enrollmentDateFrom?: Date
  enrollmentDateTo?: Date
}

// Типы для статистики
export interface DashboardStats {
  universities: number
  teachers: number
  students: number
  courses: number
  activeCourses: number
  completedEnrollments: number
  totalRevenue: number
}

export interface CourseStats {
  courseId: number
  title: string
  totalEnrollments: number
  completedEnrollments: number
  completionRate: number
  averageScore?: number
}

// Типы для компонентов
export interface TableColumn<T> {
  title: string
  dataIndex: keyof T
  key: string
  width?: number
  sorter?: boolean
  render?: (value: any, record: T, index: number) => React.ReactNode
}

export interface FormField {
  name: string
  label: string
  type:
    | 'text'
    | 'number'
    | 'email'
    | 'password'
    | 'date'
    | 'select'
    | 'textarea'
    | 'checkbox'
    | 'file'
  required?: boolean
  options?: Array<{ label: string; value: string | number }>
  placeholder?: string
  disabled?: boolean
  rules?: any[]
}

// Типы для Electron API
export interface Api {
  checkDbConnection: () => Promise<{ connected: boolean; error?: string }>
  backupDatabase: (path: string) => Promise<{ success: boolean; error?: string }>
  restoreDatabase: (path: string) => Promise<{ success: boolean; error?: string }>
  exportData: (
    format: 'csv' | 'excel' | 'json',
    data: any[]
  ) => Promise<{ success: boolean; error?: string }>
}
