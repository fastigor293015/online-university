import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, Alert } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useUserStore } from '@renderer/stores/useUserStore'
import { AuthData } from '@common/types/database'

const { Title } = Typography

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [form] = Form.useForm()
  const { login, loading } = useUserStore()

  const handleSubmit = async (values: AuthData): Promise<void> => {
    await login(values, onSuccess)
  }

  return (
    <Card style={{ maxWidth: 400, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={3}>Вход в систему</Title>
        <p>Введите ваши учетные данные</p>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
        <Form.Item
          name="username"
          rules={[
            { required: true, message: 'Введите имя пользователя' },
            { min: 3, message: 'Имя пользователя должно быть не менее 3 символов' }
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Имя пользователя" disabled={loading} />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Введите пароль' },
            { min: 6, message: 'Пароль должен быть не менее 6 символов' }
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Пароль" disabled={loading} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Войти
          </Button>
        </Form.Item>

        {onSwitchToRegister && (
          <div style={{ textAlign: 'center' }}>
            <p>
              Нет аккаунта?{' '}
              <Button type="link" onClick={onSwitchToRegister} style={{ padding: 0 }}>
                Зарегистрироваться
              </Button>
            </p>
          </div>
        )}
      </Form>
    </Card>
  )
}
