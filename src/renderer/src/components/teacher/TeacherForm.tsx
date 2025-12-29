import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, Upload, message, Row, Col } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { Teacher } from '@common/types/database'

const { TextArea } = Input
const { Option } = Select

interface TeacherFormProps {
  initialValues?: Teacher
  universities: any[]
  onSubmit: (values: any) => Promise<void>
  onCancel: () => void
}

export const TeacherForm: React.FC<TeacherFormProps> = ({
  initialValues,
  universities,
  onSubmit,
  onCancel
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        universityId: initialValues.university_id,
        info: initialValues.info
      })
    } else {
      form.resetFields()
    }
  }, [initialValues, form])

  const handleSubmit = async (): Promise<void> => {
    try {
      const values = await form.validateFields()

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
            name="name"
            label="ФИО преподавателя"
            rules={[{ required: true, message: 'Введите ФИО преподавателя' }]}
          >
            <Input placeholder="Введите ФИО" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="universityId"
            label="Университет"
            rules={[{ required: true, message: 'Выберите университет' }]}
          >
            <Select placeholder="Выберите университет">
              {universities.map((uni) => (
                <Option key={uni.universityId} value={uni.universityId}>
                  {uni.uniTitle}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="photo" label="Фотография">
        <Upload
          beforeUpload={beforeUpload}
          accept="image/*"
          maxCount={1}
          onRemove={() => setPhotoFile(null)}
        >
          <Button icon={<UploadOutlined />}>{photoFile ? photoFile.name : 'Загрузить фото'}</Button>
        </Upload>
        {initialValues?.photo && !photoFile && (
          <div style={{ marginTop: 8 }}>
            <small>Текущее фото сохранено</small>
          </div>
        )}
      </Form.Item>

      <Form.Item name="info" label="Информация о преподавателе">
        <TextArea rows={4} placeholder="Введите информацию о преподавателе" />
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
