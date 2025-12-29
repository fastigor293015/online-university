import React from 'react'
import { Card, Typography } from 'antd'
import { TeacherTable } from '@renderer/components'

const { Title } = Typography

export const TeachersPage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Управление преподавателями</Title>
      <Card>
        <TeacherTable />
      </Card>
    </div>
  )
}
