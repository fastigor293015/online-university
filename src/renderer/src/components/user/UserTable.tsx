import React, { useEffect, useState } from 'react'
import { Button, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { User } from '@common/types/database'
import { ColumnsType } from 'antd/es/table'
import { RecordActions } from '@renderer/components/shared/RecordActions'
import { useUserStore } from '@renderer/stores/useUserStore'
import { Table } from '@renderer/components/shared'
import { compareDate, formatDate } from '@renderer/utils/helpers'
import { UserForm } from '@renderer/components'

export const UserTable: React.FC = () => {
  const { isAdmin } = useUserStore()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const loadData = async (): Promise<void> => {
    setLoading(true)
    try {
      const usersData = await window.electronAPI.user.findAll()
      setUsers(usersData)
    } catch (error) {
      message.error('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log(users)
  }, [users])

  useEffect(() => {
    loadData()
  }, [])

  const columns: ColumnsType<User> = [
    {
      title: 'user_id',
      dataIndex: 'user_id',
      key: 'column_user_id',
      sorter: (a, b) => a.user_id - b.user_id,
      fixed: 'start'
    },
    {
      title: 'username',
      dataIndex: 'username',
      key: 'column_username',
      sorter: (a, b) => a.username.localeCompare(b.username)
    },
    {
      title: 'password_hash',
      dataIndex: 'password_hash',
      key: 'column_password_hash'
    },
    {
      title: 'role',
      dataIndex: 'role',
      key: 'column_role',
      sorter: (a, b) => a.role.localeCompare(b.role)
    },
    {
      title: 'created_at',
      dataIndex: 'created_at',
      key: 'column_created_at',
      render: (_, record) => formatDate(record.created_at),
      sorter: (a, b) => compareDate(a.created_at, b.created_at)
    },
    {
      title: 'last_login',
      dataIndex: 'last_login',
      key: 'column_last_login',
      render: (_, record) => formatDate(record.last_login),
      sorter: (a, b) => compareDate(a.last_login, b.last_login)
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <RecordActions
          onView={() => handleView(record)}
          onEdit={() => handleEdit(record)}
          onDelete={() => handleDelete(record.user_id)}
        />
      ),
      fixed: 'end'
    }
  ]

  const handleView = (user: User): void => {
    Modal.info({
      title: user.username,
      content: (
        <div>
          <p>
            <strong>Роль:</strong> {user.role}
          </p>
          <p>
            <strong>Дата регистрации:</strong> {formatDate(user.created_at)}
          </p>
        </div>
      ),
      width: 600
    })
  }

  const handleEdit = (user: User): void => {
    setSelectedUser(user)
    setModalVisible(true)
  }

  const handleDelete = async (id: number): Promise<void> => {
    Modal.confirm({
      title: 'Удалить пользователя?',
      onOk: async () => {
        try {
          await window.electronAPI.user.delete(id)
          message.success('Пользователь удален')
          loadData()
        } catch (error) {
          message.error('Ошибка удаления')
        }
      }
    })
  }

  const handleFormSubmit = async (values: any): Promise<void> => {
    try {
      if (selectedUser) {
        await window.electronAPI.user
          .update(selectedUser.user_id, values)
          .then((res) => console.log(res))
        message.success('Пользователь обновлен')
      } else {
        await window.electronAPI.user.register(values).then((res) => console.log(res))
        message.success('Пользователь создан')
      }
      setModalVisible(false)
      setSelectedUser(null)
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
              setSelectedUser(null)
              setModalVisible(true)
            }}
          >
            Добавить запись
          </Button>
        </div>
      )}

      <Table dataSource={users} columns={columns} loading={loading} />

      <Modal
        title={selectedUser ? 'Редактировать пользователя' : 'Добавить пользователя'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setSelectedUser(null)
        }}
        footer={null}
        width={800}
      >
        <UserForm
          initialValues={selectedUser || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setModalVisible(false)
            setSelectedUser(null)
          }}
        />
      </Modal>
    </>
  )
}
