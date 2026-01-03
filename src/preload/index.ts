import { contextBridge, ipcRenderer } from 'electron'
import { IpcChannels } from '@common/ipc/types'
import {
  AuthData,
  AuthResponse,
  BackupObject,
  Course,
  CourseCategory,
  CourseFormat,
  DBInfo,
  Enrollment,
  EnrollmentStatus,
  PGMetrics,
  PostgreSQLTools,
  Student,
  Teacher,
  University,
  User
} from '@common/types/database'

// Типизированный API для renderer процесса
export const electronAPI = {
  // User API
  user: {
    register: (data: AuthData): Promise<AuthResponse> =>
      ipcRenderer.invoke(IpcChannels.REGISTER, data),
    login: (data: AuthData): Promise<AuthResponse> => ipcRenderer.invoke(IpcChannels.LOGIN, data),
    findAll: () => ipcRenderer.invoke(IpcChannels.USER_FIND_ALL),
    update: (id: number, data: User) => ipcRenderer.invoke(IpcChannels.USER_UPDATE, id, data),
    delete: (id: number) => ipcRenderer.invoke(IpcChannels.USER_DELETE, id)
  },

  database: {
    backup: (): Promise<BackupObject> => ipcRenderer.invoke(IpcChannels.BACKUP),
    checkPostgreSQLTools: (): Promise<PostgreSQLTools> =>
      ipcRenderer.invoke(IpcChannels.CHECK_PSQL_TOOL),
    getDatabaseInfo: (): Promise<DBInfo> => ipcRenderer.invoke(IpcChannels.GET_DB_INFO),

    // Мониторинг сервера БД
    startPgMonitoring: (interval: number): Promise<AuthResponse> =>
      ipcRenderer.invoke(IpcChannels.START_PG_MONITORING, interval),
    onPgMetricsUpdate: (callback: (newMetrics: PGMetrics) => void) => () =>
      ipcRenderer.invoke(IpcChannels.PG_METRICS_UPDATE, callback),
    stopPgMonitoring: () => ipcRenderer.invoke(IpcChannels.STOP_PG_MONITORING)
  },

  // Course API
  course: {
    findAll: () => ipcRenderer.invoke(IpcChannels.COURSE_FIND_ALL),
    findById: (id: number) => ipcRenderer.invoke(IpcChannels.COURSE_FIND_BY_ID, id),
    create: (data: Course) => ipcRenderer.invoke(IpcChannels.COURSE_CREATE, data),
    update: (id: number, data: Course) => ipcRenderer.invoke(IpcChannels.COURSE_UPDATE, id, data),
    delete: (id: number) => ipcRenderer.invoke(IpcChannels.COURSE_DELETE, id)
  },

  // Student API
  student: {
    findAll: () => ipcRenderer.invoke(IpcChannels.STUDENT_FIND_ALL),
    findById: (id: number) => ipcRenderer.invoke(IpcChannels.STUDENT_FIND_BY_ID, id),
    create: (data: Student) => ipcRenderer.invoke(IpcChannels.STUDENT_CREATE, data),
    update: (id: number, data: Student) => ipcRenderer.invoke(IpcChannels.STUDENT_UPDATE, id, data),
    delete: (id: number) => ipcRenderer.invoke(IpcChannels.STUDENT_DELETE, id)
  },

  // Teacher API
  teacher: {
    findAll: () => ipcRenderer.invoke(IpcChannels.TEACHER_FIND_ALL),
    findById: (id: number) => ipcRenderer.invoke(IpcChannels.TEACHER_FIND_BY_ID, id),
    create: (data: Teacher) => ipcRenderer.invoke(IpcChannels.TEACHER_CREATE, data),
    update: (id: number, data: Teacher) => ipcRenderer.invoke(IpcChannels.TEACHER_UPDATE, id, data),
    delete: (id: number) => ipcRenderer.invoke(IpcChannels.TEACHER_DELETE, id)
  },

  // University API
  university: {
    findAll: () => ipcRenderer.invoke(IpcChannels.UNIVERSITY_FIND_ALL),
    findById: (id: number) => ipcRenderer.invoke(IpcChannels.UNIVERSITY_FIND_BY_ID, id),
    create: (data: University) => ipcRenderer.invoke(IpcChannels.UNIVERSITY_CREATE, data),
    update: (id: number, data: University) =>
      ipcRenderer.invoke(IpcChannels.UNIVERSITY_UPDATE, id, data),
    delete: (id: number) => ipcRenderer.invoke(IpcChannels.UNIVERSITY_DELETE, id)
  },

  // Enrollment API
  enrollment: {
    findAll: () => ipcRenderer.invoke(IpcChannels.ENROLLMENT_FIND_ALL),
    create: (data: Enrollment) => ipcRenderer.invoke(IpcChannels.ENROLLMENT_CREATE, data),
    update: (studentId: number, courseId: number, data: Enrollment) =>
      ipcRenderer.invoke(IpcChannels.ENROLLMENT_UPDATE, studentId, courseId, data),
    delete: (studentId: number, courseId: number) =>
      ipcRenderer.invoke(IpcChannels.ENROLLMENT_DELETE, studentId, courseId),
    complete: (studentId: number, courseId: number) =>
      ipcRenderer.invoke(IpcChannels.ENROLLMENT_COMPLETE, studentId, courseId)
  },

  // Course Category API
  courseCategory: {
    findAll: () => ipcRenderer.invoke(IpcChannels.COURSE_CATEGORY_FIND_ALL),
    create: (data: CourseCategory) => ipcRenderer.invoke(IpcChannels.COURSE_CATEGORY_CREATE, data),
    update: (id: number, data: CourseCategory) =>
      ipcRenderer.invoke(IpcChannels.COURSE_CATEGORY_UPDATE, id, data),
    delete: (id: number) => ipcRenderer.invoke(IpcChannels.COURSE_CATEGORY_DELETE, id)
  },

  // Course Format API
  courseFormat: {
    findAll: () => ipcRenderer.invoke(IpcChannels.COURSE_FORMAT_FIND_ALL),
    create: (data: CourseFormat) => ipcRenderer.invoke(IpcChannels.COURSE_FORMAT_CREATE, data),
    update: (id: number, data: CourseFormat) =>
      ipcRenderer.invoke(IpcChannels.COURSE_FORMAT_UPDATE, id, data),
    delete: (id: number) => ipcRenderer.invoke(IpcChannels.COURSE_FORMAT_DELETE, id)
  },

  // Enrollment Status API
  enrollmentStatus: {
    findAll: () => ipcRenderer.invoke(IpcChannels.ENROLLMENT_STATUS_FIND_ALL),
    create: (data: EnrollmentStatus) =>
      ipcRenderer.invoke(IpcChannels.ENROLLMENT_STATUS_CREATE, data),
    update: (id: number, data: EnrollmentStatus) =>
      ipcRenderer.invoke(IpcChannels.ENROLLMENT_STATUS_UPDATE, id, data),
    delete: (id: number) => ipcRenderer.invoke(IpcChannels.ENROLLMENT_STATUS_DELETE, id)
  },

  // Generic invoke
  invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args)
}

// Экспортируем API в renderer процесс
contextBridge.exposeInMainWorld('electronAPI', electronAPI)
