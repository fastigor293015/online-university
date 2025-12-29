export enum IpcChannels {
  // Course channels
  COURSE_FIND_ALL = 'course:findAll',
  COURSE_FIND_BY_ID = 'course:findById',
  COURSE_CREATE = 'course:create',
  COURSE_UPDATE = 'course:update',
  COURSE_DELETE = 'course:delete',

  // Student channels
  STUDENT_FIND_ALL = 'student:findAll',
  STUDENT_FIND_BY_ID = 'student:findById',
  STUDENT_CREATE = 'student:create',
  STUDENT_UPDATE = 'student:update',
  STUDENT_DELETE = 'student:delete',

  // Teacher channels
  TEACHER_FIND_ALL = 'teacher:findAll',
  TEACHER_FIND_BY_ID = 'teacher:findById',
  TEACHER_CREATE = 'teacher:create',
  TEACHER_UPDATE = 'teacher:update',
  TEACHER_DELETE = 'teacher:delete',

  // University channels
  UNIVERSITY_FIND_ALL = 'university:findAll',
  UNIVERSITY_FIND_BY_ID = 'university:findById',
  UNIVERSITY_CREATE = 'university:create',
  UNIVERSITY_UPDATE = 'university:update',
  UNIVERSITY_DELETE = 'university:delete',

  // Enrollment channels
  ENROLLMENT_FIND_ALL = 'enrollment:findAll',
  ENROLLMENT_CREATE = 'enrollment:create',
  ENROLLMENT_UPDATE = 'enrollment:update',
  ENROLLMENT_DELETE = 'enrollment:delete',
  ENROLLMENT_COMPLETE = 'enrollment:complete',

  // CourseCategory channels
  COURSE_CATEGORY_FIND_ALL = 'course-category:findAll',
  COURSE_CATEGORY_CREATE = 'course-category:create',
  COURSE_CATEGORY_UPDATE = 'course-category:update',
  COURSE_CATEGORY_DELETE = 'course-category:delete',

  // CourseFormat channels
  COURSE_FORMAT_FIND_ALL = 'course-format:findAll',
  COURSE_FORMAT_CREATE = 'course-format:create',
  COURSE_FORMAT_UPDATE = 'course-format:update',
  COURSE_FORMAT_DELETE = 'course-format:delete',

  // EnrollmentStatus channels
  ENROLLMENT_STATUS_FIND_ALL = 'enrollment-status:findAll',
  ENROLLMENT_STATUS_CREATE = 'enrollment-status:create',
  ENROLLMENT_STATUS_UPDATE = 'enrollment-status:update',
  ENROLLMENT_STATUS_DELETE = 'enrollment-status:delete'
}

export interface IpcRequest<T = any> {
  id?: string
  channel: IpcChannels
  data?: T
}

export interface IpcResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
