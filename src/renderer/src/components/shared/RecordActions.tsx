import { Button, Space } from 'antd'
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { useUserStore } from '@renderer/stores/useUserStore'

interface RecordActionsProps {
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export const RecordActions: React.FC<RecordActionsProps> = ({ onView, onEdit, onDelete }) => {
  const { isAdmin } = useUserStore()

  return (
    <Space>
      <Button icon={<EyeOutlined />} onClick={onView} size="small" />
      {isAdmin && <Button icon={<EditOutlined />} onClick={onEdit} size="small" />}
      {isAdmin && <Button icon={<DeleteOutlined />} onClick={onDelete} danger size="small" />}
    </Space>
  )
}
