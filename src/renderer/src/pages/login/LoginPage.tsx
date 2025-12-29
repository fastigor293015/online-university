import React, { useState } from 'react'
import { Layout, Tabs, Card, TabsProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { LoginForm, RegisterForm } from '@renderer/components'

const { Content } = Layout

export const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login')
  const navigate = useNavigate()

  const handleLoginSuccess = (): void => {
    navigate('/')
  }

  const items: TabsProps['items'] = [
    {
      key: 'login',
      label: 'Вход',
      children: (
        <LoginForm
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setActiveTab('register')}
        />
      )
    },
    {
      key: 'register',
      label: 'Регистрация',
      children: (
        <RegisterForm
          onSuccess={handleLoginSuccess}
          onSwitchToLogin={() => setActiveTab('login')}
        />
      )
    }
  ]

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24
        }}
      >
        <Card style={{ width: '100%', maxWidth: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontSize: 32, marginBottom: 8, color: '#1890ff' }}>Online University</h1>
            <p style={{ color: '#666' }}>Система управления онлайн-университетом</p>
          </div>

          <Tabs activeKey={activeTab} items={items} onChange={setActiveTab} centered size="large" />
        </Card>
      </Content>
    </Layout>
  )
}
