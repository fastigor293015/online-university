import React from 'react'
import { Form, Input, Button, Card, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useUserStore } from '@renderer/stores/useUserStore'

const { Title } = Typography

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [form] = Form.useForm()
  const { register, loading } = useUserStore()

  const handleSubmit = async (values: any) => {
    register(values, onSuccess)
  }

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('Введите пароль'))
    }

    if (value.length < 6) {
      return Promise.reject(new Error('Пароль должен быть не менее 6 символов'))
    }

    return Promise.resolve()
  }

  const validateConfirmPassword = ({ getFieldValue }: any) => ({
    validator(_: any, value: string) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve()
      }
      return Promise.reject(new Error('Пароли не совпадают'))
    }
  })

  return (
    <Card style={{ maxWidth: 400, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={3}>Регистрация</Title>
        <p>Создайте новый аккаунт</p>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
        <Form.Item
          name="username"
          rules={[
            { required: true, message: 'Введите имя пользователя' },
            { min: 3, message: 'Имя пользователя должно быть не менее 3 символов' },
            { max: 50, message: 'Имя пользователя должно быть не более 50 символов' }
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Имя пользователя" disabled={loading} />
        </Form.Item>

        <Form.Item name="password" rules={[{ validator: validatePassword }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Пароль" disabled={loading} />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[{ required: true, message: 'Подтвердите пароль' }, validateConfirmPassword]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Подтверждение пароля"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Зарегистрироваться
          </Button>
        </Form.Item>

        {onSwitchToLogin && (
          <div style={{ textAlign: 'center' }}>
            <p>
              Уже есть аккаунт?{' '}
              <Button type="link" onClick={onSwitchToLogin} style={{ padding: 0 }}>
                Войти
              </Button>
            </p>
          </div>
        )}
      </Form>
    </Card>
  )
}
