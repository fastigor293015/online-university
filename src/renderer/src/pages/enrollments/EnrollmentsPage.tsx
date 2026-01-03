import React from 'react'
import { Card, Typography } from 'antd'
import { EnrollmentTable } from '../../components'

const { Title } = Typography

export const EnrollmentsPage: React.FC = () => {
  return (
    <div>
      <Title level={2} style={{ marginTop: 0 }}>
        Записи на курсы
      </Title>
      <Card>
        <EnrollmentTable />
      </Card>
    </div>
  )
}
