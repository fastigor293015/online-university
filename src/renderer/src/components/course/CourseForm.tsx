import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, Row, Col, Switch } from 'antd'
import { Course, CourseCategory, CourseFormat, Teacher, University } from '@common/types/database'
import { DefaultOptionType } from 'antd/es/select'

const { TextArea } = Input

interface CourseFormProps {
  initialValues?: Course
  universities: University[]
  teachers: Teacher[]
  categories: CourseCategory[]
  formats: CourseFormat[]
  onSubmit: (values: any) => Promise<void>
  onCancel: () => void
}

export const CourseForm: React.FC<CourseFormProps> = ({
  initialValues,
  universities,
  teachers,
  categories,
  formats,
  onSubmit,
  onCancel
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  const universityOptions: DefaultOptionType[] = universities.map<DefaultOptionType>((item) => ({
    label: item.uni_title,
    value: item.university_id
  }))

  const teacherOptions: DefaultOptionType[] = teachers.map<DefaultOptionType>((item) => ({
    label: item.name,
    value: item.teacher_id
  }))

  const categoryOptions: DefaultOptionType[] = categories.map<DefaultOptionType>((item) => ({
    label: item.category_name,
    value: item.category_id
  }))

  const formatOptions: DefaultOptionType[] = formats.map<DefaultOptionType>((item) => ({
    label: item.format_name,
    value: item.format_id
  }))

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        university_id: initialValues.university_id,
        teacher_id: initialValues.teacher_id,
        category_id: initialValues.category_id,
        format_id: initialValues.format_id,
        title: initialValues.title,
        description: initialValues.description,
        exam: initialValues.exam,
        certificate: initialValues.certificate
      })
    } else {
      form.resetFields()
    }
  }, [initialValues, form])

  const handleSubmit = async (): Promise<void> => {
    try {
      const values = await form.validateFields()
      console.log(values)

      // Convert photo to Buffer if file is selected
      if (photoFile) {
        const arrayBuffer = await photoFile.arrayBuffer()
        values.photo = Buffer.from(arrayBuffer)
      }

      setLoading(true)
      await onSubmit(values)
      setLoading(false)
      setPhotoFile(null)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="title"
            label="Название курса"
            rules={[{ required: true, message: 'Заполните поле' }]}
          >
            <Input placeholder="Название курса" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="exam" label="Экзамен">
            <Switch />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="certificate" label="Сертификат">
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="university_id"
            label="Университет"
            rules={[{ required: true, message: 'Выберите университет' }]}
          >
            <Select placeholder="Выберите университет" options={universityOptions} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="teacher_id"
            label="Преподаватель"
            rules={[{ required: true, message: 'Выберите преподавателя' }]}
          >
            <Select placeholder="Выберите преподавателя" options={teacherOptions} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="category_id"
            label="Категория"
            rules={[{ required: true, message: 'Выберите категорию' }]}
          >
            <Select placeholder="Выберите категорию" options={categoryOptions} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="format_id"
            label="Формат"
            rules={[{ required: true, message: 'Выберите формат' }]}
          >
            <Select placeholder="Выберите формат" options={formatOptions} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="description" label="Описание курса">
        <TextArea rows={4} placeholder="Введите описание курса" />
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
