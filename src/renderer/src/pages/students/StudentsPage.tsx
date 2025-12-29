import React from 'react'
import { Card, Typography } from 'antd'
import { StudentTable } from '../../components'

const { Title } = Typography

export const StudentsPage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Студенты</Title>
      <Card>
        <StudentTable />
      </Card>
    </div>
  )
}
