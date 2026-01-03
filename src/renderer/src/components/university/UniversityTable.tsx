import React, { useEffect, useState } from 'react'
import { Button, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { University } from '@common/types/database'
import { UniversityForm } from './UniversityForm'
import { ColumnsType } from 'antd/es/table'
import { useUserStore } from '@renderer/stores/useUserStore'
import { RecordActions } from '@renderer/components/shared/RecordActions'
import { Table } from '@renderer/components/shared'

export const UniversityTable: React.FC = () => {
  const { isAdmin } = useUserStore()
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null)

  const loadData = async (): Promise<void> => {
    setLoading(true)
    try {
      const universitiesData = await window.electronAPI.university.findAll()
      setUniversities(universitiesData)
    } catch (error) {
      message.error('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log(universities)
  }, [universities])

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<University> = [
    {
      title: 'university_id',
      dataIndex: 'university_id',
      key: 'column_university_id',
      sorter: (a: University, b: University) => a.university_id - b.university_id,
      fixed: 'start'
    },
    {
      title: 'uni_title',
      dataIndex: 'uni_title',
      key: 'column_uni_title',
      sorter: (a: University, b: University) => a.uni_title.localeCompare(b.uni_title)
    },
    {
      title: 'uni_address',
      dataIndex: 'uni_address',
      key: 'column_uni_address',
      sorter: (a: University, b: University) => a.uni_address.localeCompare(b.uni_address)
    },
    {
      title: 'uni_site',
      dataIndex: 'uni_site',
      key: 'column_uni_site'
    },
    {
      title: 'uni_contacts',
      dataIndex: 'uni_contacts',
      key: 'column_uni_contacts',
      ellipsis: true
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 120,
      render: (_, record: University) => (
        <RecordActions
          onView={() => handleView(record)}
          onEdit={() => handleEdit(record)}
          onDelete={() => handleDelete(record.university_id)}
        />
      ),
      fixed: 'end'
    }
  ]

  const handleView = (university: University): void => {
    Modal.info({
      title: university.uni_title,
      content: (
        <div>
          <p>
            <strong>Адрес:</strong> {university.uni_address}
          </p>
          <p>
            <strong>Сайт:</strong> {university.uni_site}
          </p>
          <p>
            <strong>Контакты:</strong> {university.uni_contacts}
          </p>
        </div>
      ),
      width: 600
    })
  }

  const handleEdit = (university: University): void => {
    setSelectedUniversity(university)
    setModalVisible(true)
  }

  const handleDelete = async (id: number): Promise<void> => {
    Modal.confirm({
      title: 'Удалить университет?',
      onOk: async () => {
        try {
          await window.electronAPI.university.delete(id)
          message.success('Университет удален')
          loadData()
        } catch (error) {
          message.error('Ошибка удаления')
        }
      }
    })
  }

  const handleFormSubmit = async (values: any): Promise<void> => {
    try {
      if (selectedUniversity) {
        await window.electronAPI.university
          .update(selectedUniversity.university_id, values)
          .then((res) => console.log(res))
        message.success('Университет обновлен')
      } else {
        await window.electronAPI.university.create(values).then((res) => console.log(res))
        message.success('Университет создан')
      }
      setModalVisible(false)
      setSelectedUniversity(null)
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
              setSelectedUniversity(null)
              setModalVisible(true)
            }}
          >
            Добавить запись
          </Button>
        </div>
      )}

      <Table dataSource={universities} columns={columns} loading={loading} />

      <Modal
        title={selectedUniversity ? 'Редактировать университет' : 'Добавить университет'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setSelectedUniversity(null)
        }}
        footer={null}
        width={800}
      >
        <UniversityForm
          initialValues={selectedUniversity || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setModalVisible(false)
            setSelectedUniversity(null)
          }}
        />
      </Modal>
    </>
  )
}
