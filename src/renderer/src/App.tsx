import React from 'react'
import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  BankOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  FormOutlined
} from '@ant-design/icons'
import { TeachersPage } from './pages'
import Link from 'antd/es/typography/Link'

const { Header, Sider, Content } = Layout

const App: React.FC = () => {
  const menuItems = [
    { key: '1', icon: <DashboardOutlined />, label: <Link href="/">Дашборд</Link> },
    { key: '2', icon: <BankOutlined />, label: <Link href="/universities">Университеты</Link> },
    { key: '3', icon: <TeamOutlined />, label: <Link href="/teachers">Преподаватели</Link> },
    { key: '4', icon: <UserOutlined />, label: <Link href="/students">Студенты</Link> },
    { key: '5', icon: <BookOutlined />, label: <Link href="/courses">Курсы</Link> },
    { key: '6', icon: <FormOutlined />, label: <Link href="/enrollments">Записи на курсы</Link> }
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu theme="dark" mode="inline" items={menuItems} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          <h1 style={{ margin: '0 24px' }}>Online University Manager</h1>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <TeachersPage />
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
