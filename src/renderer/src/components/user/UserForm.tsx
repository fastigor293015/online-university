import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Row, Col, Select } from 'antd'
import { User } from '@common/types/database'
import { DefaultOptionType } from 'antd/es/select'

interface UserFormProps {
  initialValues?: User
  onSubmit: (values: any) => Promise<void>
  onCancel: () => void
}

export const UserForm: React.FC<UserFormProps> = ({ initialValues, onSubmit, onCancel }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const roleOptions: DefaultOptionType[] = [
    {
      label: 'admin',
      value: 'admin'
    },
    {
      label: 'viewer',
      value: 'viewer'
    }
  ]

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        user_id: initialValues.user_id,
        username: initialValues.username,
        role: initialValues.role
      })
    } else {
      form.resetFields()
    }
  }, [initialValues, form])

  const handleSubmit = async (): Promise<void> => {
    try {
      const values = await form.validateFields()
      console.log(values)

      setLoading(true)
      await onSubmit(values)
      setLoading(false)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="username"
            label="Логин"
            rules={[{ required: true, message: 'Введите логин' }]}
          >
            <Input placeholder="Логин" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="role"
            label="Роль"
            rules={[{ required: true, message: 'Выберите роль' }]}
          >
            <Select options={roleOptions} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={onCancel}>Отмена</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? 'Обновить' : 'Создать'}
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}
