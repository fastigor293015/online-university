import { contextBridge, ipcRenderer } from 'electron'
import { IpcChannels } from '@common/ipc/types'
import {
  Course,
  CourseCategory,
  Enrollment,
  Student,
  Teacher,
  University
} from '@common/types/database'

// Типизированный API для renderer процесса
const electronAPI = {
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
    findAll: () => ipcRenderer.invoke(IpcChannels.UNIVERSITY_FIND_ALL),
    create: (data: CourseCategory) => ipcRenderer.invoke(IpcChannels.UNIVERSITY_CREATE, data),
    update: (id: number, data: CourseCategory) =>
      ipcRenderer.invoke(IpcChannels.UNIVERSITY_UPDATE, id, data),
    delete: (id: number) => ipcRenderer.invoke(IpcChannels.UNIVERSITY_DELETE, id)
  },

  // Course Format API
  courseFormat: {
    findAll: () => ipcRenderer.invoke(IpcChannels.UNIVERSITY_FIND_ALL),
    create: (data: University) => ipcRenderer.invoke(IpcChannels.UNIVERSITY_CREATE, data),
    update: (id: number, data: University) =>
      ipcRenderer.invoke(IpcChannels.UNIVERSITY_UPDATE, id, data),
    delete: (id: number) => ipcRenderer.invoke(IpcChannels.UNIVERSITY_DELETE, id)
  },

  // Enrollment Status API
  enrollmentStatus: {
    findAll: () => ipcRenderer.invoke(IpcChannels.UNIVERSITY_FIND_ALL),
    create: (data: University) => ipcRenderer.invoke(IpcChannels.UNIVERSITY_CREATE, data),
    update: (id: number, data: University) =>
      ipcRenderer.invoke(IpcChannels.UNIVERSITY_UPDATE, id, data),
    delete: (id: number) => ipcRenderer.invoke(IpcChannels.UNIVERSITY_DELETE, id)
  },

  // Generic invoke
  invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args)
}

// Экспортируем API в renderer процесс
contextBridge.exposeInMainWorld('electronAPI', electronAPI)
