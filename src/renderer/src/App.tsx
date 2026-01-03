import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { ConfigProvider, Layout, Menu } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import {
  DashboardOutlined,
  BankOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  FormOutlined,
  UserAddOutlined,
  MonitorOutlined
} from '@ant-design/icons'
import {
  TeachersPage,
  DashboardPage,
  LoginPage,
  StudentsPage,
  PgMonitorPage,
  CoursesPage,
  UniversitiesPage,
  EnrollmentsPage,
  UsersPage
} from './pages'
import { useUserStore } from '@renderer/stores/useUserStore'
import { UserMenu } from '@renderer/components/auth/UserMenu'

const { Header, Sider, Content } = Layout

const App: React.FC = () => {
  const { user, isAdmin } = useUserStore()

  const menuItems = [
    { key: '1', icon: <DashboardOutlined />, label: <Link to="/">Дашборд</Link> },
    { key: '2', icon: <BankOutlined />, label: <Link to="/universities">Университеты</Link> },
    { key: '3', icon: <TeamOutlined />, label: <Link to="/teachers">Преподаватели</Link> },
    { key: '4', icon: <UserOutlined />, label: <Link to="/students">Студенты</Link> },
    { key: '5', icon: <BookOutlined />, label: <Link to="/courses">Курсы</Link> },
    { key: '6', icon: <FormOutlined />, label: <Link to="/enrollments">Записи на курсы</Link> },
    ...(isAdmin
      ? [
          {
            key: '7',
            icon: <UserAddOutlined />,
            label: <Link to="/users">Пользователи</Link>
          },
          {
            key: '8',
            icon: <MonitorOutlined />,
            label: <Link to="monitoring">Мониторинг</Link>
          }
        ]
      : [])
  ]

  // Если пользователь не авторизован, показываем страницу логина
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    )
  }

  return (
    <Router>
      <ConfigProvider locale={ruRU}>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible>
            <div
              style={{
                height: 32,
                margin: 16,
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              UNI
            </div>
            <Menu theme="dark" mode="inline" items={menuItems} defaultSelectedKeys={['1']} />
          </Sider>
          <Layout>
            <Header
              style={{
                padding: 0,
                background: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 1px 4px rgba(0,21,41,.08)'
              }}
            >
              <div style={{ padding: '0 24px', fontSize: 18, fontWeight: 'bold' }}>
                Online University Manager
              </div>
              <UserMenu />
            </Header>
            <Content
              style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}
            >
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/universities" element={<UniversitiesPage />} />
                <Route path="/teachers" element={<TeachersPage />} />
                <Route path="/students" element={<StudentsPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/enrollments" element={<EnrollmentsPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/monitoring" element={<PgMonitorPage />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </Router>
  )
}

export default App
