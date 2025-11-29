import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useAuth } from '../../context/AuthContext'
import { error as showError } from '../../utils/toast'
import authApi from '../../api/authApi'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await login(form)
      setLoading(false)
      navigate('/admin')
    } catch (err) {
      setLoading(false)
      const msg = err?.response?.data?.message || 'Login failed'
      showError(msg)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Admin Login</h2>
          <p className="text-sm text-gray-600">Sign in to manage your PG</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Email" name="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} error={errors.email} />
          <Input label="Password" name="password" type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} error={errors.password} />
          <div className="pt-2">
            <Button loading={loading} type="submit" className="w-full">Login</Button>
          </div>
          <div className="text-center text-sm text-gray-600">
            <p>User? <Link to="/user/login" className="text-indigo-600 hover:underline">User Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
