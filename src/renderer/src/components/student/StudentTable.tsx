import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, message, Tag, Image } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Student } from '@common/types/database'
import { StudentForm } from './StudentForm'
import { ColumnsType } from 'antd/es/table'
import { generateId } from '@renderer/utils/helpers'
import { RecordActions } from '@renderer/components/shared/RecordActions'

export const StudentTable: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [photoPreviewVisible, setPhotoPreviewVisible] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState<string>('')

  const loadData = async (): Promise<void> => {
    setLoading(true)
    try {
      const studentsData = await window.electronAPI.student.findAll()
      setStudents(studentsData)
    } catch (error) {
      message.error('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log(students)
  }, [students])

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<Student> = [
    {
      title: 'student_id',
      dataIndex: 'student_id',
      key: 'column_student_id',
      sorter: (a: Student, b: Student) => a.student_id - b.student_id
    },
    {
      title: 'student_name',
      dataIndex: 'student_name',
      key: 'column_student_name',
      sorter: (a: Student, b: Student) => a.student_name.localeCompare(b.student_name),
      ellipsis: true
    },
    {
      title: 'student_photo',
      dataIndex: 'student_photo',
      key: 'column_student_photo'
    },
    {
      title: 'student_info',
      dataIndex: 'student_info',
      key: 'column_student_info',
      ellipsis: true
    },
    {
      title: 'encrypted_student_info',
      dataIndex: 'encrypted_student_info',
      key: 'column_encrypted_student_info',
      ellipsis: true,
      render: (_: any, record: Student) => String(record.encrypted_student_info)
    },
    {
      title: 'education',
      dataIndex: 'education',
      key: 'column_education',
      ellipsis: true
    },
    {
      title: 'work',
      dataIndex: 'work',
      key: 'column_work'
    },
    {
      title: 'resume_allowed',
      dataIndex: 'resume_allowed',
      key: 'column_resume_allowed',
      render: (_: any, record: Student) => String(record.resume_allowed)
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 120,
      render: (_: any, record: Student) => (
        <RecordActions
          onView={() => handleView(record)}
          onEdit={() => handleEdit(record)}
          onDelete={() => handleDelete(record.student_id)}
        />
      )
    }
  ]

  const handleView = (student: Student): void => {
    Modal.info({
      title: student.student_name,
      content: (
        <div>
          <p>
            <strong>Фото:</strong> {student.student_name}
          </p>
          <p>
            <strong>Описание:</strong> {student.student_info}
          </p>
        </div>
      ),
      width: 600
    })
  }

  const handleEdit = (student: Student): void => {
    setSelectedStudent(student)
    setModalVisible(true)
  }

  const handleDelete = async (id: number): Promise<void> => {
    Modal.confirm({
      title: 'Удалить студента?',
      content: 'Все связанные записи на курсы также будут удалены',
      onOk: async () => {
        try {
          await window.electronAPI.student.delete(id)
          message.success('Студент удален')
          loadData()
        } catch (error) {
          message.error('Ошибка удаления')
        }
      }
    })
  }

  const handleFormSubmit = async (values: any): Promise<void> => {
    try {
      if (selectedStudent) {
        await window.electronAPI.student
          .update(selectedStudent.student_id, values)
          .then((res) => console.log(res))
        message.success('Студент обновлен')
      } else {
        await window.electronAPI.student.create(values).then((res) => console.log(res))
        message.success('Студент создан')
      }
      setModalVisible(false)
      setSelectedStudent(null)
      loadData()
    } catch (error) {
      message.error('Ошибка сохранения')
    }
  }

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedStudent(null)
            setModalVisible(true)
          }}
        >
          Добавить запись
        </Button>
      </div>

      <Table
        dataSource={students}
        columns={columns}
        rowKey={(record) => `${record.student_id || 'temp'}_${generateId()}`}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={selectedStudent ? 'Редактировать студента' : 'Добавить студента'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setSelectedStudent(null)
        }}
        footer={null}
        width={800}
      >
        <StudentForm
          initialValues={selectedStudent || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setModalVisible(false)
            setSelectedStudent(null)
          }}
        />
      </Modal>
    </>
  )
}
