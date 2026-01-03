import React from 'react'
import { Card, Typography } from 'antd'
import { UniversityTable } from '../../components'

const { Title } = Typography

export const UniversitiesPage: React.FC = () => {
  return (
    <div>
      <Title level={2} style={{ marginTop: 0 }}>
        Университеты
      </Title>
      <Card>
        <UniversityTable />
      </Card>
    </div>
  )
}
