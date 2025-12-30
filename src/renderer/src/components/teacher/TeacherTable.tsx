import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, message, Tag, Image } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons'
import { Teacher, University } from '@common/types/database'
import { TeacherForm } from './TeacherForm'
import { ColumnsType } from 'antd/es/table'
import { generateId } from '@renderer/utils/helpers'
import { useUserStore } from '@renderer/stores/useUserStore'
import { RecordActions } from '@renderer/components/shared/RecordActions'

export const TeacherTable: React.FC = () => {
  const { isAdmin } = useUserStore()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [photoPreviewVisible, setPhotoPreviewVisible] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState<string>('')

  const loadData = async (): Promise<void> => {
    setLoading(true)
    try {
      const [teachersData, universitiesData] = await Promise.all([
        window.electronAPI.teacher.findAll(),
        window.electronAPI.university.findAll()
      ])
      setTeachers(teachersData)
      setUniversities(universitiesData)
    } catch (error) {
      message.error('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log(teachers)
  }, [teachers])

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<Teacher> = [
    {
      title: 'teacher_id',
      dataIndex: 'teacher_id',
      key: 'column_teacher_id',
      sorter: (a: Teacher, b: Teacher) => a.teacher_id - b.teacher_id
    },
    {
      title: 'name',
      dataIndex: 'name',
      key: 'column_name',
      sorter: (a: Teacher, b: Teacher) => a.name.localeCompare(b.name)
    },
    {
      title: 'photo',
      dataIndex: 'photo',
      key: 'column_photo'
    },
    {
      title: 'info',
      dataIndex: 'info',
      key: 'column_info',
      ellipsis: true
    },
    {
      title: 'university_id',
      dataIndex: 'university_id',
      key: 'column_university_id',
      sorter: (a: Teacher, b: Teacher) => a.university_id - b.university_id
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 120,
      render: (_: any, record: Teacher) => (
        <RecordActions
          onView={() => handleView(record)}
          onEdit={() => handleEdit(record)}
          onDelete={() => handleDelete(record.teacher_id)}
        />
      )
    }
  ]

  const handleView = (teacher: Teacher): void => {
    Modal.info({
      title: teacher.name,
      content: (
        <div>
          <p>
            <strong>Фото:</strong> {teacher.name}
          </p>
          <p>
            <strong>Описание:</strong> {teacher.info}
          </p>
        </div>
      ),
      width: 600
    })
  }

  const handleEdit = (teacher: Teacher): void => {
    setSelectedTeacher(teacher)
    setModalVisible(true)
  }

  const handleDelete = async (id: number): Promise<void> => {
    Modal.confirm({
      title: 'Удалить преподавателя?',
      content: 'Все связанные курсы также будут удалены',
      onOk: async () => {
        try {
          await window.electronAPI.teacher.delete(id)
          message.success('Преподаватель удален')
          loadData()
        } catch (error) {
          message.error('Ошибка удаления')
        }
      }
    })
  }

  const handleFormSubmit = async (values: any): Promise<void> => {
    try {
      if (selectedTeacher) {
        await window.electronAPI.teacher
          .update(selectedTeacher.teacher_id, values)
          .then((res) => console.log(res))
        message.success('Преподаватель обновлен')
      } else {
        await window.electronAPI.teacher.create(values).then((res) => console.log(res))
        message.success('Преподаватель создан')
      }
      setModalVisible(false)
      setSelectedTeacher(null)
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
              setSelectedTeacher(null)
              setModalVisible(true)
            }}
          >
            Добавить запись
          </Button>
        </div>
      )}

      <Table
        dataSource={teachers}
        columns={columns}
        rowKey={(record) => `${record.teacher_id || 'temp'}_${generateId()}`}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={selectedTeacher ? 'Редактировать преподавателя' : 'Добавить преподавателя'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setSelectedTeacher(null)
        }}
        footer={null}
        width={800}
      >
        <TeacherForm
          initialValues={selectedTeacher || undefined}
          universities={universities}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setModalVisible(false)
            setSelectedTeacher(null)
          }}
        />
      </Modal>
    </>
  )
}
