import React, { useEffect, useState } from 'react'
import { Button, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Course, Enrollment, EnrollmentStatus, Student } from '@common/types/database'
import { EnrollmentForm } from './EnrollmentForm'
import { ColumnsType } from 'antd/es/table'
import { useUserStore } from '@renderer/stores/useUserStore'
import { RecordActions } from '@renderer/components/shared/RecordActions'
import { Table } from '@renderer/components/shared'
import { compareDate, formatDate } from '@renderer/utils/helpers'

export const EnrollmentTable: React.FC = () => {
  const { isAdmin } = useUserStore()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollmentStatuses, setEnrollmentStatuses] = useState<EnrollmentStatus[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null)

  const loadData = async (): Promise<void> => {
    setLoading(true)
    try {
      const [enrollmentsData, studentsData, coursesData, enrollmentStatusesData] =
        await Promise.all([
          window.electronAPI.enrollment.findAll(),
          window.electronAPI.student.findAll(),
          window.electronAPI.course.findAll(),
          window.electronAPI.enrollmentStatus.findAll()
        ])
      setEnrollments(enrollmentsData)
      setStudents(studentsData)
      setCourses(coursesData)
      setEnrollmentStatuses(enrollmentStatusesData)
    } catch (error) {
      message.error('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log(enrollments)
  }, [enrollments])

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<Enrollment> = [
    {
      title: 'student_id',
      dataIndex: 'student_id',
      key: 'column_student_id',
      sorter: (a, b) => a.student_id - b.student_id,
      fixed: 'start'
    },
    {
      title: 'course_id',
      dataIndex: 'course_id',
      key: 'column_course_id',
      sorter: (a, b) => a.course_id - b.course_id,
      fixed: 'start'
    },
    {
      title: 'enrollment_date',
      dataIndex: 'enrollment_date',
      key: 'column_enrollment_date',
      render: (_, record) => (record.enrollment_date ? formatDate(record.enrollment_date) : 'null'),
      sorter: (a, b) => compareDate(a.enrollment_date, b.enrollment_date)
    },
    {
      title: 'completion_date',
      dataIndex: 'completion_date',
      key: 'column_completion_date',
      render: (_, record) => (record.completion_date ? formatDate(record.completion_date) : 'null'),
      sorter: (a, b) => compareDate(a.completion_date, b.completion_date)
    },
    {
      title: 'certificate_issued',
      dataIndex: 'certificate_issued',
      key: 'column_certificate_issued',
      render: (_, record) => String(record.certificate_issued)
    },
    {
      title: 'resume_published',
      dataIndex: 'resume_published',
      key: 'column_resume_published',
      render: (_, record) => String(record.resume_published)
    },
    {
      title: 'status_id',
      dataIndex: 'status_id',
      key: 'column_status_id',
      sorter: (a, b) => a.status_id - b.status_id
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 120,
      render: (_, record: Enrollment) => (
        <RecordActions
          onView={() => handleView(record)}
          onEdit={() => handleEdit(record)}
          onDelete={() => handleDelete(record)}
        />
      ),
      fixed: 'end'
    }
  ]

  const handleView = (enrollment: Enrollment): void => {
    const student = students.find((value) => value.student_id === enrollment.student_id)
    const course = courses.find((value) => value.course_id === enrollment.course_id)
    const status = enrollmentStatuses.find((value) => value.status_id === enrollment.status_id)
    Modal.info({
      title: 'Запись на курс',
      content: (
        <div>
          <p>
            <strong>Курс:</strong> {course?.title}
          </p>
          <p>
            <strong>ФИО студента:</strong> {student?.student_name}
          </p>
          <p>
            <strong>Дата зачисления:</strong> {formatDate(enrollment.enrollment_date)}
          </p>
          <p>
            <strong>Статус:</strong> {status?.status_name}
          </p>
        </div>
      ),
      width: 600
    })
  }

  const handleEdit = (enrollment: Enrollment): void => {
    setSelectedEnrollment(enrollment)
    setModalVisible(true)
  }

  const handleDelete = async (enrollment: Enrollment): Promise<void> => {
    Modal.confirm({
      title: 'Удалить запись на курс?',
      onOk: async () => {
        try {
          await window.electronAPI.enrollment.delete(enrollment.student_id, enrollment.course_id)
          message.success('Запись на курс удалена')
          loadData()
        } catch (error) {
          message.error('Ошибка удаления')
        }
      }
    })
  }

  const handleFormSubmit = async (values: any): Promise<void> => {
    try {
      if (selectedEnrollment) {
        await window.electronAPI.enrollment
          .update(selectedEnrollment.student_id, selectedEnrollment.course_id, values)
          .then((res) => console.log(res))
        message.success('Запись на курс обновлена')
      } else {
        await window.electronAPI.enrollment.create(values).then((res) => console.log(res))
        message.success('Запись на курс создана')
      }
      setModalVisible(false)
      setSelectedEnrollment(null)
      loadData()
    } catch (error) {
      message.error('Ошибка сохранения')
    }
  }

  return (
    <>
      {isAdmin && (
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedEnrollment(null)
              setModalVisible(true)
            }}
          >
            Добавить запись
          </Button>
        </div>
      )}

      <Table dataSource={enrollments} columns={columns} loading={loading} />

      <Modal
        title={selectedEnrollment ? 'Редактировать запись на курс' : 'Добавить запись на курс'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setSelectedEnrollment(null)
        }}
        footer={null}
        width={800}
      >
        <EnrollmentForm
          initialValues={selectedEnrollment || undefined}
          students={students}
          courses={courses}
          enrollmentStatuses={enrollmentStatuses}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setModalVisible(false)
            setSelectedEnrollment(null)
          }}
        />
      </Modal>
    </>
  )
}
