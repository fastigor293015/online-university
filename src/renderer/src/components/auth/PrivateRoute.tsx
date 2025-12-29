import React from 'react'
import { Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import { useUserStore } from '../../stores/useUserStore'

interface PrivateRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useUserStore()

  if (loading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <Spin size="large" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
