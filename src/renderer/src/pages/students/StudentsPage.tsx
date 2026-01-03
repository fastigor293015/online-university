import React from 'react'
import { Card, Typography } from 'antd'
import { StudentTable } from '../../components'

const { Title } = Typography

export const StudentsPage: React.FC = () => {
  return (
    <div>
      <Title level={2} style={{ marginTop: 0 }}>
        Студенты
      </Title>
      <Card>
        <StudentTable />
      </Card>
    </div>
  )
}
