import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, message, Tag, Image } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons'
import { Teacher } from '@common/types/database'
import { TeacherForm } from '@renderer/components/teacher/TeacherForm'

export const TeacherTable: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [universities, setUniversities] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [photoPreviewVisible, setPhotoPreviewVisible] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState<string>('')

  const loadData = async () => {
    setLoading(true)
    try {
      const [teachersData, universitiesData] = await Promise.all([
        TeacherService.getAll(),
        UniversityService.getAll()
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
    loadData()
  }, [])

  const columns = [
    {
      title: 'Фото',
      dataIndex: 'photo',
      key: 'photo',
      width: 80,
      render: (photo: Buffer) =>
        photo ? (
          <>
            <Image
              width={50}
              height={50}
              src={`data:image/jpeg;base64,${Buffer.from(photo).toString('base64')}`}
              preview={{
                visible: photoPreviewVisible,
                src: `data:image/jpeg;base64,${Buffer.from(photo).toString('base64')}`,
                onVisibleChange: (visible) => setPhotoPreviewVisible(visible)
              }}
              onClick={() => {
                setCurrentPhoto(`data:image/jpeg;base64,${Buffer.from(photo).toString('base64')}`)
                setPhotoPreviewVisible(true)
              }}
              style={{ cursor: 'pointer', borderRadius: '4px' }}
            />
          </>
        ) : (
          <div style={{ width: 50, height: 50, background: '#f0f0f0', borderRadius: '4px' }} />
        )
    },
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Teacher, b: Teacher) => a.name.localeCompare(b.name)
    },
    {
      title: 'Университет',
      key: 'university',
      render: (_: any, record: Teacher) =>
        record.university ? <Tag color="blue">{record.university.uniTitle}</Tag> : '-'
    },
    {
      title: 'Информация',
      dataIndex: 'info',
      key: 'info',
      ellipsis: true
    },
    {
      title: 'Количество курсов',
      key: 'courseCount',
      render: (_: any, record: Teacher) => record.courses?.length || 0
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 120,
      render: (_: any, record: Teacher) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)} size="small" />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small" />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.teacherId)}
            danger
            size="small"
          />
        </Space>
      )
    }
  ]

  const handleView = (teacher: Teacher) => {
    Modal.info({
      title: teacher.name,
      content: (
        <div>
          {teacher.university && (
            <p>
              <strong>Университет:</strong> {teacher.university.uniTitle}
            </p>
          )}
          {teacher.info && (
            <p>
              <strong>Информация:</strong> {teacher.info}
            </p>
          )}
          <p>
            <strong>Количество курсов:</strong> {teacher.courses?.length || 0}
          </p>
        </div>
      ),
      width: 600
    })
  }

  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Удалить преподавателя?',
      content: 'Все связанные курсы также будут удалены',
      onOk: async () => {
        try {
          await TeacherService.delete(id)
          message.success('Преподаватель удален')
          loadData()
        } catch (error) {
          message.error('Ошибка удаления')
        }
      }
    })
  }

  const handleFormSubmit = async (values: any) => {
    try {
      if (selectedTeacher) {
        await TeacherService.update(selectedTeacher.teacherId, values)
        message.success('Преподаватель обновлен')
      } else {
        await TeacherService.create(values)
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedTeacher(null)
            setModalVisible(true)
          }}
        >
          Добавить преподавателя
        </Button>
      </div>

      <Table
        dataSource={teachers}
        columns={columns}
        rowKey="teacherId"
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
