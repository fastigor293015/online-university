import { Button, Space } from 'antd'
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'

interface RecordActionsProps {
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export const RecordActions: React.FC<RecordActionsProps> = ({ onView, onEdit, onDelete }) => {
  return (
    <Space>
      <Button icon={<EyeOutlined />} onClick={onView} size="small" />
      <Button icon={<EditOutlined />} onClick={onEdit} size="small" />
      <Button icon={<DeleteOutlined />} onClick={onDelete} danger size="small" />
    </Space>
  )
}
