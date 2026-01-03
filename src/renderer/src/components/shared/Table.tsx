import { Table as AntdTable } from 'antd'
import { generateId } from '@renderer/utils/helpers'
import { ColumnsType } from 'antd/es/table'
import { useUserStore } from '@renderer/stores/useUserStore'

interface TableProps<T> {
  loading: boolean
  dataSource: T[]
  columns: ColumnsType<T>
}

// Используем более гибкий подход
export const Table: <T>(props: TableProps<T>) => React.ReactNode | Promise<React.ReactNode> = ({
  loading,
  dataSource,
  columns
}) => {
  const { isAdmin } = useUserStore()

  return (
    <AntdTable
      dataSource={dataSource}
      columns={columns}
      rowKey={() => generateId()}
      loading={loading}
      scroll={{
        x: 'max-content',
        y: isAdmin
          ? 'calc(100vh - 64px - (24px + 24px) - (38px + 15px) - 24px - (32px - 16px) - 54px - 64px - 24px - (24px + 24px) - 40px)'
          : 'calc(100vh - 64px - (24px + 24px) - (38px + 15px) - 24px - 54px - 64px - 24px - (24px + 24px))'
      }}
    />
  )
}
