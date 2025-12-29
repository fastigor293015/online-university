import {
  Course,
  Student,
  Teacher,
  University,
  Enrollment,
  CourseCategory,
  CourseFormat,
  EnrollmentStatus
} from './models'

/**
 * Инициализация связей между моделями
 */
export function initAssociations(): void {
  try {
    // 1. University - Teacher (One-to-Many)
    University.hasMany(Teacher, {
      foreignKey: 'university_id',
      as: 'teachers'
    })

    Teacher.belongsTo(University, {
      foreignKey: 'university_id',
      as: 'university'
    })

    // 2. Teacher - Course (One-to-Many)
    Teacher.hasMany(Course, {
      foreignKey: 'teacher_id',
      as: 'courses'
    })

    Course.belongsTo(Teacher, {
      foreignKey: 'teacher_id',
      as: 'teacher'
    })

    // 3. University - Course (One-to-Many)
    University.hasMany(Course, {
      foreignKey: 'university_id',
      as: 'universityCourses'
    })

    Course.belongsTo(University, {
      foreignKey: 'university_id',
      as: 'university'
    })

    // 4. CourseCategory - Course (One-to-Many)
    CourseCategory.hasMany(Course, {
      foreignKey: 'category_id',
      as: 'courses'
    })

    Course.belongsTo(CourseCategory, {
      foreignKey: 'category_id',
      as: 'courseCategory'
    })

    // 5. CourseFormat - Course (One-to-Many)
    CourseFormat.hasMany(Course, {
      foreignKey: 'format_id',
      as: 'courses'
    })

    Course.belongsTo(CourseFormat, {
      foreignKey: 'format_id',
      as: 'courseFormat'
    })

    // 6. Student - Enrollment (One-to-Many)
    Student.hasMany(Enrollment, {
      foreignKey: 'student_id',
      as: 'enrollments'
    })

    Enrollment.belongsTo(Student, {
      foreignKey: 'student_id',
      as: 'student'
    })

    // 7. Course - Enrollment (One-to-Many)
    Course.hasMany(Enrollment, {
      foreignKey: 'course_id',
      as: 'enrollments'
    })

    Enrollment.belongsTo(Course, {
      foreignKey: 'course_id',
      as: 'course'
    })

    // 8. EnrollmentStatus - Enrollment (One-to-Many)
    EnrollmentStatus.hasMany(Enrollment, {
      foreignKey: 'status_id',
      as: 'enrollments'
    })

    Enrollment.belongsTo(EnrollmentStatus, {
      foreignKey: 'status_id',
      as: 'enrollmentStatus'
    })

    // 9. Student - Course (Many-to-Many через Enrollment)
    Student.belongsToMany(Course, {
      through: Enrollment,
      foreignKey: 'student_id',
      otherKey: 'course_id',
      as: 'studentCourses'
    })

    Course.belongsToMany(Student, {
      through: Enrollment,
      foreignKey: 'course_id',
      otherKey: 'student_id',
      as: 'courseStudents'
    })

    console.log('All associations initialized successfully')
  } catch (error) {
    console.error('Error initializing associations:', error)
    throw error
  }
}
