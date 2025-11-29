import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/Input'
import Button from '../../components/Button'
import authApi from '../../api/authApi'
import { error as showError } from '../../utils/toast'

const UserLogin = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ phone: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.phone) e.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(form.phone)) e.phone = 'Phone must be 10 digits'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await authApi.userLogin(form)
      const { token, user } = res.data
      localStorage.setItem('user_token', token)
      localStorage.setItem('user_data', JSON.stringify(user))
      setLoading(false)
      navigate('/user/dashboard')
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
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">User Login</h2>
          <p className="text-sm text-gray-600">Sign in to view payment details</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            label="Phone Number" 
            name="phone" 
            value={form.phone} 
            onChange={(e) => setForm({...form, phone: e.target.value})} 
            error={errors.phone}
            placeholder="10 digit phone number"
            maxLength="10"
          />
          <Input 
            label="Password" 
            name="password" 
            type="password" 
            value={form.password} 
            onChange={(e) => setForm({...form, password: e.target.value})} 
            error={errors.password}
          />
          <div className="pt-2">
            <Button loading={loading} type="submit" className="w-full">Login</Button>
          </div>
          <div className="text-center text-sm text-gray-600">
            <p>Admin? <a href="/login" className="text-indigo-600 hover:underline">Admin Login</a></p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserLogin




