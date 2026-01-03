import React from 'react'
import { Card, Typography } from 'antd'
import { UserTable } from '../../components'

const { Title } = Typography

export const UsersPage: React.FC = () => {
  return (
    <div>
      <Title level={2} style={{ marginTop: 0 }}>
        Пользователи
      </Title>
      <Card>
        <UserTable />
      </Card>
    </div>
  )
}
