import { useUserStore } from '@renderer/stores/useUserStore'
import { Avatar, Dropdown, Space, Typography } from 'antd'
import { UserOutlined, SettingOutlined, LogoutOutlined, UserAddOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { Text } = Typography

export const UserMenu: React.FC = () => {
  const { user, isAdmin, logout } = useUserStore()

  if (!user) {
    return (
      <Space>
        <Link to="/login">
          <Text strong style={{ color: '#1890ff', cursor: 'pointer' }}>
            Войти
          </Text>
        </Link>
      </Space>
    )
  }

  const items = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">Профиль</Link>
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">Настройки</Link>
    },
    ...(isAdmin
      ? [
          {
            key: 'users',
            icon: <UserAddOutlined />,
            label: <Link to="/admin/users">Пользователи</Link>
          }
        ]
      : []),
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Выйти',
      onClick: logout
    }
  ]

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <Space style={{ cursor: 'pointer', padding: '0 16px' }}>
        <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
        <Text strong style={{ fontSize: 14 }}>
          {user.full_name || user.username}
        </Text>
      </Space>
    </Dropdown>
  )
}
