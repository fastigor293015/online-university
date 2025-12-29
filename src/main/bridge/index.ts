import { ipcMain } from 'electron'
import {
  CourseCategoryService,
  CourseFormatService,
  EnrollmentStatusService,
  UniversityService,
  TeacherService,
  StudentService,
  CourseService,
  EnrollmentService
} from '../database/services'
import { IpcChannels } from '@common/ipc/types'

export function registerIpcHandlers(): void {
  // Student handlers
  ipcMain.handle(IpcChannels.STUDENT_FIND_ALL, async () => {
    return await StudentService.findAll()
  })

  ipcMain.handle(IpcChannels.STUDENT_FIND_BY_ID, async (_, id: number) => {
    return await StudentService.findById(id)
  })

  ipcMain.handle(IpcChannels.STUDENT_CREATE, async (_, data) => {
    return await StudentService.create(data)
  })

  ipcMain.handle(IpcChannels.STUDENT_UPDATE, async (_, id: number, data) => {
    return await StudentService.update(id, data)
  })

  ipcMain.handle(IpcChannels.STUDENT_DELETE, async (_, id: number) => {
    return await StudentService.delete(id)
  })

  // Course handlers
  ipcMain.handle(IpcChannels.COURSE_FIND_ALL, async () => {
    return await CourseService.findAll()
  })

  ipcMain.handle(IpcChannels.COURSE_FIND_BY_ID, async (_, id: number) => {
    return await CourseService.findById(id)
  })

  ipcMain.handle(IpcChannels.COURSE_CREATE, async (_, data) => {
    return await CourseService.create(data)
  })

  ipcMain.handle(IpcChannels.COURSE_UPDATE, async (_, id: number, data) => {
    return await CourseService.update(id, data)
  })

  ipcMain.handle(IpcChannels.COURSE_DELETE, async (_, id: number) => {
    return await CourseService.delete(id)
  })

  // Teacher handlers
  ipcMain.handle(IpcChannels.TEACHER_FIND_ALL, async () => {
    return await TeacherService.findAll()
  })

  ipcMain.handle(IpcChannels.TEACHER_FIND_ALL, async (_, id: number) => {
    return await TeacherService.findById(id)
  })

  ipcMain.handle(IpcChannels.TEACHER_CREATE, async (_, data) => {
    return await TeacherService.create(data)
  })

  ipcMain.handle(IpcChannels.TEACHER_UPDATE, async (_, id: number, data) => {
    return await TeacherService.update(id, data)
  })

  ipcMain.handle(IpcChannels.TEACHER_DELETE, async (_, id: number) => {
    return await TeacherService.delete(id)
  })

  // University handlers
  ipcMain.handle(IpcChannels.UNIVERSITY_FIND_ALL, async () => {
    return await UniversityService.findAll()
  })

  ipcMain.handle(IpcChannels.UNIVERSITY_FIND_BY_ID, async (_, id: number) => {
    return await UniversityService.findById(id)
  })

  ipcMain.handle(IpcChannels.UNIVERSITY_CREATE, async (_, data) => {
    return await UniversityService.create(data)
  })

  ipcMain.handle(IpcChannels.UNIVERSITY_UPDATE, async (_, id: number, data) => {
    return await UniversityService.update(id, data)
  })

  ipcMain.handle(IpcChannels.UNIVERSITY_DELETE, async (_, id: number) => {
    return await UniversityService.delete(id)
  })

  // Enrollment handlers
  ipcMain.handle(IpcChannels.ENROLLMENT_FIND_ALL, async () => {
    return await EnrollmentService.findAll()
  })

  ipcMain.handle(IpcChannels.ENROLLMENT_CREATE, async (_, data) => {
    return await EnrollmentService.create(data)
  })

  ipcMain.handle(
    IpcChannels.ENROLLMENT_UPDATE,
    async (_, studentId: number, courseId: number, data) => {
      return await EnrollmentService.update(studentId, courseId, data)
    }
  )

  ipcMain.handle(IpcChannels.ENROLLMENT_DELETE, async (_, studentId: number, courseId: number) => {
    return await EnrollmentService.delete(studentId, courseId)
  })

  ipcMain.handle(
    IpcChannels.ENROLLMENT_COMPLETE,
    async (_, studentId: number, courseId: number) => {
      return await EnrollmentService.complete(studentId, courseId)
    }
  )

  // Course Category handlers
  ipcMain.handle(IpcChannels.COURSE_CATEGORY_FIND_ALL, async () => {
    return await CourseCategoryService.findAll()
  })

  ipcMain.handle(IpcChannels.COURSE_CATEGORY_CREATE, async (_, data) => {
    return await CourseCategoryService.create(data)
  })

  ipcMain.handle(IpcChannels.COURSE_CATEGORY_UPDATE, async (_, id: number, data) => {
    return await CourseCategoryService.update(id, data)
  })

  ipcMain.handle(IpcChannels.COURSE_CATEGORY_DELETE, async (_, id: number) => {
    return await CourseCategoryService.delete(id)
  })

  // Course Format handlers
  ipcMain.handle(IpcChannels.COURSE_FORMAT_FIND_ALL, async () => {
    return await CourseFormatService.findAll()
  })

  ipcMain.handle(IpcChannels.COURSE_FORMAT_CREATE, async (_, data) => {
    return await CourseFormatService.create(data)
  })

  ipcMain.handle(IpcChannels.COURSE_FORMAT_UPDATE, async (_, id: number, data) => {
    return await CourseFormatService.update(id, data)
  })

  ipcMain.handle(IpcChannels.COURSE_FORMAT_DELETE, async (_, id: number) => {
    return await CourseFormatService.delete(id)
  })

  // Enrollment status handlers
  ipcMain.handle(IpcChannels.ENROLLMENT_STATUS_FIND_ALL, async () => {
    return await EnrollmentStatusService.findAll()
  })

  ipcMain.handle(IpcChannels.ENROLLMENT_STATUS_CREATE, async (_, data) => {
    return await EnrollmentStatusService.create(data)
  })

  ipcMain.handle(IpcChannels.ENROLLMENT_STATUS_UPDATE, async (_, id: number, data) => {
    return await EnrollmentStatusService.update(id, data)
  })

  ipcMain.handle(IpcChannels.ENROLLMENT_STATUS_DELETE, async (_, id: number) => {
    return await EnrollmentStatusService.delete(id)
  })
}
