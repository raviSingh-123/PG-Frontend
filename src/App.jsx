import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import UserLogin from './pages/auth/UserLogin'
import UserDashboard from './pages/user/Dashboard'
import UserProtectedRoute from './components/UserProtectedRoute'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'

import Dashboard from './pages/admin/Dashboard'
import Profile from './pages/admin/Profile'
import UpdateUPI from './pages/admin/UpdateUPI'
import UploadQR from './pages/admin/UploadQR'

import UserList from './pages/users/UserList'
import AddUser from './pages/users/AddUser'
import EditUser from './pages/users/EditUser'
import UserDetails from './pages/users/UserDetails'

import AddPayment from './pages/payments/AddPayment'
import PaymentList from './pages/payments/PaymentList'
import PaymentHistory from './pages/payments/PaymentHistory'
import MonthlyReport from './pages/payments/MonthlyReport'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route 
        path="/user/dashboard" 
        element={
          <UserProtectedRoute>
            <UserDashboard />
          </UserProtectedRoute>
        } 
      />

      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="profile" element={<Profile />} />
        <Route path="profile/update-upi" element={<UpdateUPI />} />
        <Route path="profile/upload-qr" element={<UploadQR />} />

        <Route path="users" >
          <Route index element={<UserList />} />
          <Route path="add" element={<AddUser />} />
          <Route path="edit/:id" element={<EditUser />} />
          <Route path=":id" element={<UserDetails />} />
        </Route>

        <Route path="payments">
          <Route index element={<PaymentList />} />
          <Route path="add" element={<AddPayment />} />
          <Route path="history/:userId" element={<PaymentHistory />} />
          <Route path="monthly-report" element={<MonthlyReport />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
