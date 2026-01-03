import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Row, Col } from 'antd'
import { University } from '@common/types/database'

const { TextArea } = Input

interface UniversityFormProps {
  initialValues?: University
  onSubmit: (values: any) => Promise<void>
  onCancel: () => void
}

export const UniversityForm: React.FC<UniversityFormProps> = ({
  initialValues,
  onSubmit,
  onCancel
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        university_id: initialValues.university_id,
        title: initialValues.uni_title,
        address: initialValues.uni_address,
        site: initialValues.uni_site,
        contacts: initialValues.uni_contacts
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
        <Col span={8}>
          <Form.Item
            name="title"
            label="Название"
            rules={[{ required: true, message: 'Заполните поле' }]}
          >
            <Input placeholder="Введите название" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="address"
            label="Адрес"
            rules={[{ required: true, message: 'Заполните поле' }]}
          >
            <Input placeholder="Введите адрес" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="site"
            label="Сайт"
            rules={[{ required: true, message: 'Заполните поле' }]}
          >
            <Input placeholder="Введите сайт" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="contacts" label="Контакты">
        <TextArea rows={4} placeholder="Введите контакты" />
      </Form.Item>

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
