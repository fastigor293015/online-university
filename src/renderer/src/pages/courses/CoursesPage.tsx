import React from 'react'
import { Card, Typography } from 'antd'
import { CourseTable } from '../../components'

const { Title } = Typography

export const CoursesPage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Курсы</Title>
      <Card>
        <CourseTable />
      </Card>
    </div>
  )
}
