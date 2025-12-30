import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, message } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons'
import { Course, CourseCategory, CourseFormat, Teacher, University } from '@common/types/database'
import { CourseForm } from './CourseForm'
import { ColumnsType } from 'antd/es/table'
import { generateId } from '@renderer/utils/helpers'
import { useUserStore } from '@renderer/stores/useUserStore'

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
    console.log(courses)
  }, [courses])

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<Course> = [
    {
      title: 'course_id',
      dataIndex: 'course_id',
      key: 'column_course_id',
      sorter: (a: Course, b: Course) => a.course_id - b.course_id
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
      title: 'description',
      dataIndex: 'description',
      key: 'column_description',
      ellipsis: true
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 120,
      render: (_: any, record: Course) => (
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
      )
    }
  ]

  const handleView = (course: Course): void => {
    Modal.info({
      title: course.title,
      content: (
        <div>
          <p>
            <strong>Фото:</strong> {course.title}
          </p>
          <p>
            <strong>Описание:</strong> {course.description}
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
      content: 'Все связанные курсы также будут удалены',
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

      <Table
        dataSource={courses}
        columns={columns}
        rowKey={(record) => `${record.course_id || 'temp'}_${generateId()}`}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

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
