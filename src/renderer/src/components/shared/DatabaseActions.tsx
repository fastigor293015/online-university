import { Button, List, Modal, Space, Tag, Tooltip, Typography } from 'antd'
import { DownloadOutlined, UploadOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { DBInfo, PostgreSQLTools } from '@common/types/database'

const { Paragraph, Text, Title } = Typography

export const DatabaseActions: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [toolsStatus, setToolsStatus] = useState<{
    pg_dump: boolean
    pg_restore: boolean
    psql: boolean
  } | null>(null)
  const [dbInfo, setDbInfo] = useState<DBInfo>(null)
  const [backupHistory, setBackupHistory] = useState<any[]>([])

  const checkTools = async (): Promise<PostgreSQLTools> => {
    const status = await window.electronAPI.database.checkPostgreSQLTools()
    setToolsStatus(status)
    return status
  }

  const loadDatabaseInfo = async (): Promise<void> => {
    try {
      const info = await window.electronAPI.database.getDatabaseInfo()
      setDbInfo(info)
    } catch (error) {
      console.error('Error loading DB info:', error)
    }
  }

  const handleQuickBackup = async () => {
    try {
      setLoading(true)

      // Проверяем доступность утилит
      const status = await checkTools()
      if (!status.pg_dump) {
        throw new Error('pg_dump не найден. Установите PostgreSQL или добавьте в PATH.')
      }

      // Создаем бэкап
      const result = await window.electronAPI.database.backup()

      if (result.success) {
        Modal.success({
          title: 'Резервная копия создана',
          content: (
            <div>
              <Paragraph>Файл сохранен по пути:</Paragraph>
              <Text code copyable>
                {result.filePath}
              </Text>
            </div>
          )
        })

        // Обновляем историю
        setBackupHistory((prev) => [
          {
            id: Date.now(),
            date: new Date().toLocaleString(),
            path: result.filePath,
            type: 'Quick'
          },
          ...prev.slice(0, 4)
        ])

        // Обновляем информацию о БД
        await loadDatabaseInfo()
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      Modal.error({
        title: 'Ошибка создания резервной копии',
        content: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (): Promise<void> => {
    Modal.info({
      title: 'Восстановление из резервной копии',
      content: 'Для восстановления используйте полную версию инструмента.'
    })
  }

  return (
    <>
      <Space>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleQuickBackup}
          loading={loading}
          size="large"
          disabled={(!!toolsStatus && !toolsStatus.pg_dump) || loading}
        >
          Быстрая резервная копия
        </Button>

        <Button
          icon={<UploadOutlined />}
          onClick={handleRestore}
          size="large"
          disabled={(!!toolsStatus && !toolsStatus.pg_restore) || loading}
        >
          Восстановить
        </Button>
      </Space>
      {/* История */}
      {backupHistory.length > 0 && (
        <div>
          <Title level={5}>Последние копии</Title>
          <List
            size="small"
            dataSource={backupHistory}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  title={
                    <Tooltip title={item.path}>
                      <Text ellipsis>{item.path?.split('/').pop()}</Text>
                    </Tooltip>
                  }
                  description={item.date}
                />
                <Tag>{item.type}</Tag>
              </List.Item>
            )}
          />
        </div>
      )}
    </>
  )
}
