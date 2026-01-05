import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, Table, Alert, Tag, Typography, Space } from 'antd'
import {
  DatabaseOutlined,
  UsergroupAddOutlined,
  HddOutlined,
  SyncOutlined
} from '@ant-design/icons'
import { PGMetrics } from '@common/types/database'

const { Title, Text } = Typography

export const PgMonitorPage: React.FC = () => {
  const [metrics, setMetrics] = useState<PGMetrics | null>(null)

  const startMonitoring = (): void => {
    window.electronAPI.database.startPgMonitoring(5) // Интервал 5 сек
  }

  const stopMonitoring = (): void => {
    window.electronAPI.database.stopPgMonitoring()
  }

  // Подписка на обновления от главного процесса
  useEffect(() => {
    startMonitoring()
    window.electronAPI.database.onPgMetricsUpdate((newMetrics: PGMetrics) => {
      setMetrics(newMetrics)
    })

    return () => stopMonitoring()
  }, [])

  useEffect(() => {
    console.log(metrics)
  }, [metrics])

  const columns = [
    { title: 'Метрика', dataIndex: 'name', key: 'name' },
    { title: 'Значение', dataIndex: 'value', key: 'value' },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) =>
        status === 'normal' ? <Tag color="green">Норма</Tag> : <Tag color="orange">Внимание</Tag>
    }
  ]

  const tableData = metrics
    ? [
        {
          key: '1',
          name: 'Активные подключения',
          value: metrics.active_connections || 0,
          status: (metrics.active_connections || 0) > 50 ? 'warning' : 'normal'
        },
        {
          key: '2',
          name: 'Ожидающие подключения',
          value: metrics.waiting_connections || 0,
          status: (metrics.waiting_connections || 0) > 0 ? 'warning' : 'normal'
        },
        {
          key: '3',
          name: 'Заблокированные транзакции',
          value: metrics.blocked_transactions || 0,
          status: (metrics.blocked_transactions || 0) > 0 ? 'warning' : 'normal'
        },
        {
          key: '4',
          name: 'Эффективность кэша',
          value: metrics.cache_hit_ratio
            ? `${Number(metrics.cache_hit_ratio)?.toFixed(1)}%`
            : 'N/A',
          status: (Number(metrics.cache_hit_ratio) || 0) < 90 ? 'warning' : 'normal'
        }
      ]
    : []

  return (
    <div>
      <Space align="center" style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          <DatabaseOutlined /> Мониторинг PostgreSQL
        </Title>
      </Space>

      {metrics?.status === 'error' && (
        <Alert
          title={`Ошибка получения метрик: ${metrics.error}`}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Статус сервера"
              value={metrics?.status === 'healthy' ? 'Работает' : 'Ошибка'}
              prefix={<DatabaseOutlined />}
              style={{ color: metrics?.status === 'healthy' ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Активные сессии"
              value={metrics?.active_connections || 0}
              prefix={<UsergroupAddOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Зафиксировано транзакций"
              value={metrics?.xact_commit || 0}
              prefix={<SyncOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Размер базы данных"
              value={metrics?.db_size || 'N/A'}
              prefix={<HddOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Детальная статистика"
        extra={
          <Text type="secondary">
            Обновлено: {metrics?.timestamp?.toLocaleTimeString() || 'никогда'}
          </Text>
        }
      >
        <Table
          dataSource={tableData}
          columns={columns}
          pagination={false}
          size="small"
          loading={!metrics}
        />
      </Card>

      <Alert
        title="Подсказка"
        description={
          <ul>
            <li>
              <strong>Эффективность кэша (Hit Ratio)</strong> ниже 90% может говорить о нехватке
              оперативной памяти для рабочего набора данных.
            </li>
            <li>
              Наличие <strong>ожидающих (waiting) подключений</strong> или{' '}
              <strong>заблокированных транзакций</strong> — признак проблем с производительностью
              или взаимоблокировок (deadlock).
            </li>
            <li>
              Резкий рост <strong>числа откатов (xact_rollback)</strong> по сравнению с коммитами
              может указывать на логические ошибки в приложении.
            </li>
          </ul>
        }
        type="info"
        showIcon
        style={{ marginTop: 24 }}
      />
    </div>
  )
}
