import React from 'react'
import { Card, Typography } from 'antd'
import { CourseTable } from '../../components'

const { Title } = Typography

export const CoursesPage: React.FC = () => {
  return (
    <div>
      <Title level={2} style={{ marginTop: 0 }}>
        Курсы
      </Title>
      <Card>
        <CourseTable />
      </Card>
    </div>
  )
}
