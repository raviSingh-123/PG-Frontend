import React from 'react'
import { Navigate } from 'react-router-dom'

const UserProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('user_token')
  const userData = localStorage.getItem('user_data')

  if (!token || !userData) {
    return <Navigate to="/user/login" replace />
  }

  return children
}

export default UserProtectedRoute




