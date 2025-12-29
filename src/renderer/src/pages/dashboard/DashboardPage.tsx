import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Typography, Spin, Alert } from 'antd'
import { BankOutlined, TeamOutlined, UserOutlined, BookOutlined } from '@ant-design/icons'
import { DatabaseActions } from '@renderer/components/shared/DatabaseActions'

const { Title } = Typography

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    universities: 0,
    teachers: 0,
    students: 0,
    courses: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStats = async (): Promise<void> => {
    try {
      setLoading(true)
      const [universities, teachers, students, courses] = await Promise.all([
        window.electronAPI.university.findAll(),
        window.electronAPI.teacher.findAll(),
        window.electronAPI.student.findAll(),
        window.electronAPI.course.findAll()
      ])

      setStats({
        universities: universities.length,
        teachers: teachers.length,
        students: students.length,
        courses: courses.length
      })
    } catch (err) {
      setError('Ошибка загрузки статистики')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  if (loading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}
      >
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    return <Alert message={error} type="error" />
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Панель управления</Title>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Добро пожаловать в систему управления онлайн-университетом
      </p>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Университеты"
              value={stats.universities}
              prefix={<BankOutlined />}
              style={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Преподаватели"
              value={stats.teachers}
              prefix={<TeamOutlined />}
              style={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Студенты"
              value={stats.students}
              prefix={<UserOutlined />}
              style={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Курсы"
              value={stats.courses}
              prefix={<BookOutlined />}
              style={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Быстрые действия">
            <DatabaseActions />
            {/* <Row gutter={[8, 8]}>
              <Col>
                <a href="/universities">Перейти к университетам</a>
              </Col>
              <Col>
                <a href="/teachers">Перейти к преподавателям</a>
              </Col>
              <Col>
                <a href="/students">Перейти к студентам</a>
              </Col>
              <Col>
                <a href="/courses">Перейти к курсам</a>
              </Col>
            </Row> */}
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Информация о системе">
            <p>Система управления онлайн-университетом позволяет:</p>
            <ul>
              <li>Управлять университетами и их данными</li>
              <li>Регистрировать преподавателей и загружать их информацию</li>
              <li>Вести учет студентов и их резюме</li>
              <li>Создавать курсы и управлять их расписанием</li>
              <li>Обрабатывать записи студентов на курсы</li>
              <li>Отслеживать прогресс обучения и выдавать сертификаты</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
