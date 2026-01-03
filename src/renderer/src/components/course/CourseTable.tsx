import React, { useEffect, useState } from 'react'
import { Button, Space, Modal, message } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons'
import { Course, CourseCategory, CourseFormat, Teacher, University } from '@common/types/database'
import { CourseForm } from './CourseForm'
import { ColumnsType } from 'antd/es/table'
import { useUserStore } from '@renderer/stores/useUserStore'
import { Table } from '@renderer/components/shared'
import { compareDate, formatDate } from '@renderer/utils/helpers'

export const CourseTable: React.FC = () => {
  const { isAdmin } = useUserStore()
  const [courses, setCourses] = useState<Course[]>([])
  const [universities, setUniversities] = useState<University[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [categories, setCategories] = useState<CourseCategory[]>([])
  const [formats, setFormats] = useState<CourseFormat[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const loadData = async (): Promise<void> => {
    setLoading(true)
    try {
      const [coursesData, universitiesData, teachersData, categoriesData, formatsData] =
        await Promise.all([
          window.electronAPI.course.findAll(),
          window.electronAPI.university.findAll(),
          window.electronAPI.teacher.findAll(),
          window.electronAPI.courseCategory.findAll(),
          window.electronAPI.courseFormat.findAll()
        ])
      console.log(categoriesData)
      setCourses(coursesData)
      setUniversities(universitiesData)
      setTeachers(teachersData)
      setCategories(categoriesData)
      setFormats(formatsData)
    } catch (error) {
      message.error('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<Course> = [
    {
      title: 'course_id',
      dataIndex: 'course_id',
      key: 'column_course_id',
      sorter: (a: Course, b: Course) => a.course_id - b.course_id,
      fixed: 'start'
    },
    {
      title: 'teacher_id',
      dataIndex: 'teacher_id',
      key: 'column_teacher_id',
      sorter: (a: Course, b: Course) => a.teacher_id - b.teacher_id
    },
    {
      title: 'university_id',
      dataIndex: 'university_id',
      key: 'column_university_id',
      sorter: (a: Course, b: Course) => a.university_id - b.university_id
    },
    {
      title: 'title',
      dataIndex: 'title',
      key: 'column_title',
      sorter: (a: Course, b: Course) => a.title.localeCompare(b.title)
    },
    {
      title: 'start_date',
      dataIndex: 'start_date',
      key: 'column_start_date',
      render: (_, record) => formatDate(record.start_date),
      sorter: (a: Course, b: Course) => compareDate(a.start_date, b.start_date)
    },
    {
      title: 'length',
      dataIndex: 'length',
      key: 'column_length',
      sorter: (a: Course, b: Course) => a.length - b.length
    },
    {
      title: 'workload',
      dataIndex: 'workload',
      key: 'column_workload'
    },
    {
      title: 'participants',
      dataIndex: 'participants',
      key: 'column_participants',
      sorter: (a: Course, b: Course) => a.participants - b.participants
    },
    {
      title: 'description',
      dataIndex: 'description',
      key: 'column_description',
      ellipsis: true
    },
    {
      title: 'plan',
      dataIndex: 'plan',
      key: 'column_plan',
      ellipsis: true
    },
    {
      title: 'requirements',
      dataIndex: 'requirements',
      key: 'column_requirements',
      ellipsis: true
    },
    {
      title: 'format_id',
      dataIndex: 'format_id',
      key: 'column_format_id'
    },
    {
      title: 'recommended_readings',
      dataIndex: 'recommended_readings',
      key: 'column_recommended_readings',
      ellipsis: true
    },
    {
      title: 'certificate',
      dataIndex: 'certificate',
      key: 'column_certificate',
      render: (_, record) => String(record.certificate)
    },
    {
      title: 'price',
      dataIndex: 'price',
      key: 'column_price'
    },
    {
      title: 'category_id',
      dataIndex: 'category_id',
      key: 'column_category_id'
    },
    {
      title: 'exam',
      dataIndex: 'exam',
      key: 'column_exam',
      render: (_, record) => String(record.exam)
    },
    {
      title: 'site',
      dataIndex: 'site',
      key: 'column_site'
    },
    {
      title: 'other',
      dataIndex: 'other',
      key: 'column_other',
      ellipsis: true
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 120,
      render: (_, record: Course) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)} size="small" />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small" />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.course_id)}
            danger
            size="small"
          />
        </Space>
      ),
      fixed: 'end'
    }
  ]

  const handleView = (course: Course): void => {
    const teacher = teachers.find((item) => item.teacher_id === course.teacher_id)
    const university = universities.find((item) => item.university_id === course.university_id)
    const format = formats.find((item) => item.format_id === course.format_id)
    const category = categories.find((item) => item.category_id === course.category_id)

    Modal.info({
      title: course.title,
      content: (
        <div>
          <p>
            <strong>Сайт:</strong> {course?.site}
          </p>
          <p>
            <strong>Формат:</strong> {format?.format_name}
          </p>
          <p>
            <strong>Категория:</strong> {category?.category_name}
          </p>
          <p>
            <strong>Преподаватель:</strong> {teacher?.name}
          </p>
          <p>
            <strong>Университет:</strong> {university?.uni_title}
          </p>
          <p>
            <strong>Начало:</strong> {formatDate(course.start_date)}
          </p>
          <p>
            <strong>Нагрузка:</strong> {course.workload}
          </p>
          <p>
            <strong>Кол-во участников:</strong> {course.participants}
          </p>
          <p>
            <strong>Цена:</strong> {course.price}
          </p>
          <p>
            <strong>Описание:</strong> {course.description}
          </p>
          <p>
            <strong>Учебный план:</strong> {course.plan}
          </p>
          <p>
            <strong>Требования:</strong> {course.requirements}
          </p>
          <p>
            <strong>Рекомендуемая литература:</strong> {course.recommended_readings}
          </p>
        </div>
      ),
      width: 600
    })
  }

  const handleEdit = (course: Course): void => {
    setSelectedCourse(course)
    setModalVisible(true)
  }

  const handleDelete = async (id: number): Promise<void> => {
    Modal.confirm({
      title: 'Удалить курс?',
      content: 'Все связанные записи на курсы также будут удалены',
      onOk: async () => {
        try {
          await window.electronAPI.course.delete(id)
          message.success('Курс удален')
          loadData()
        } catch (error) {
          message.error('Ошибка удаления')
        }
      }
    })
  }

  const handleFormSubmit = async (values: any): Promise<void> => {
    try {
      if (selectedCourse) {
        await window.electronAPI.course
          .update(selectedCourse.course_id, values)
          .then((res) => console.log(res))
        message.success('Курс обновлен')
      } else {
        await window.electronAPI.course.create(values).then((res) => console.log(res))
        message.success('Курс создан')
      }
      setModalVisible(false)
      setSelectedCourse(null)
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
              setSelectedCourse(null)
              setModalVisible(true)
            }}
          >
            Добавить запись
          </Button>
        </div>
      )}

      <Table dataSource={courses} columns={columns} loading={loading} />

      <Modal
        title={selectedCourse ? 'Редактировать курс' : 'Добавить курс'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setSelectedCourse(null)
        }}
        footer={null}
        width={800}
      >
        <CourseForm
          initialValues={selectedCourse || undefined}
          universities={universities}
          teachers={teachers}
          categories={categories}
          formats={formats}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setModalVisible(false)
            setSelectedCourse(null)
          }}
        />
      </Modal>
    </>
  )
}
