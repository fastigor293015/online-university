import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Upload, message, Row, Col, Switch } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { Student } from '@common/types/database'

const { TextArea } = Input

interface StudentFormProps {
  initialValues?: Student
  onSubmit: (values: any) => Promise<void>
  onCancel: () => void
}

export const StudentForm: React.FC<StudentFormProps> = ({ initialValues, onSubmit, onCancel }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        university_id: initialValues.student_id,
        student_name: initialValues.student_name,
        student_photo: initialValues.student_photo,
        student_info: initialValues.student_info,
        education: initialValues.education,
        work: initialValues.work,
        resume: initialValues.resume,
        resume_allowed: initialValues.resume_allowed
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

  const beforeUpload = (file: File): void => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('Можно загружать только изображения!')
    }

    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Изображение должно быть меньше 2MB!')
    }

    if (isImage && isLt2M) {
      setPhotoFile(file)
    }
  }

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="student_name"
            label="ФИО студента"
            rules={[{ required: true, message: 'Введите ФИО студента' }]}
          >
            <Input placeholder="ФИО" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="education"
            label="Образование"
            rules={[{ required: true, message: 'Заполните поле' }]}
          >
            <Input placeholder="Образование" />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={6}>
          <Form.Item name="student_photo" label="Фотография">
            <Upload
              beforeUpload={beforeUpload}
              accept="image/*"
              maxCount={1}
              onRemove={() => setPhotoFile(null)}
            >
              <Button icon={<UploadOutlined />}>
                {photoFile ? photoFile.name : 'Загрузить фото'}
              </Button>
            </Upload>
            {initialValues?.student_photo && !photoFile && (
              <div style={{ marginTop: 8 }}>
                <small>Текущее фото сохранено</small>
              </div>
            )}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="resume_allowed" label="Разрешено ли публиковать резюме">
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="student_info" label="Информация о студенте">
        <TextArea rows={4} placeholder="Введите информацию о студенте" />
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
