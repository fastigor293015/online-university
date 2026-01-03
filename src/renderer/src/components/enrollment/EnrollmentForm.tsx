import React, { useState, useEffect } from 'react'
import { Form, Button, Select, Row, Col, DatePicker, Switch } from 'antd'
import { Course, Enrollment, EnrollmentStatus, Student } from '@common/types/database'
import { DefaultOptionType } from 'antd/es/select'
import dayjs, { Dayjs } from 'dayjs'

interface EnrollmentFormProps {
  initialValues?: Enrollment
  students: Student[]
  courses: Course[]
  enrollmentStatuses: EnrollmentStatus[]
  onSubmit: (values: any) => Promise<void>
  onCancel: () => void
}

type EnrollmentFormValues = Omit<Enrollment, 'enrollment_date' | 'completion_date'> & {
  enrollment_date: Dayjs | null
  completion_date: Dayjs | null
}

export const EnrollmentForm: React.FC<EnrollmentFormProps> = ({
  initialValues,
  students,
  courses,
  enrollmentStatuses,
  onSubmit,
  onCancel
}) => {
  const [form] = Form.useForm<EnrollmentFormValues>()
  const [loading, setLoading] = useState(false)

  const studentOptions: DefaultOptionType[] = students.map<DefaultOptionType>((item) => ({
    label: item.student_name,
    value: item.student_id
  }))

  const courseOptions: DefaultOptionType[] = courses.map<DefaultOptionType>((item) => ({
    label: item.title,
    value: item.course_id
  }))

  const enrollmentStatusOptions: DefaultOptionType[] = enrollmentStatuses.map<DefaultOptionType>(
    (item) => ({
      label: item.status_name,
      value: item.status_id
    })
  )

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        student_id: initialValues.student_id,
        course_id: initialValues.course_id,
        enrollment_date: initialValues.enrollment_date
          ? dayjs(initialValues.enrollment_date)
          : null,
        completion_date: initialValues.completion_date
          ? dayjs(initialValues.completion_date)
          : null,
        certificate_issued: initialValues.certificate_issued,
        resume_published: initialValues.resume_published,
        status_id: initialValues.status_id
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
      await onSubmit({
        ...values,
        enrollment_date: values.enrollment_date?.toDate(),
        completion_date: values.completion_date?.toDate()
      })
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
            name="student_id"
            label="Студент"
            rules={[{ required: true, message: 'Выберите студента' }]}
          >
            <Select placeholder="Выберите студента" options={studentOptions} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="course_id"
            label="Курс"
            rules={[{ required: true, message: 'Выберите курс' }]}
          >
            <Select placeholder="Выберите курс" options={courseOptions} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="status_id"
            label="Статус"
            rules={[{ required: true, message: 'Выберите статус' }]}
          >
            <Select placeholder="Выберите статус" options={enrollmentStatusOptions} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="enrollment_date" label="Дата зачисления">
            <DatePicker
              format={{
                format: 'DD.MM.YYYY',
                type: 'mask'
              }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="completion_date" label="Дата завершения">
            <DatePicker
              format={{
                format: 'DD.MM.YYYY',
                type: 'mask'
              }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="certificate_issued" label="Сертификат выдан">
            <Switch />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="resume_published" label="Резюме опубликовано">
            <Switch />
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
