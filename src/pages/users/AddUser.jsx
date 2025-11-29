import React, { useState } from 'react'
import PageHeader from '../../components/PageHeader'
import Input from '../../components/Input'
import Button from '../../components/Button'
import userApi from '../../api/userApi'
import { success, error } from '../../utils/toast'
import { useNavigate } from 'react-router-dom'

const AddUser = () => {
  const [form, setForm] = useState({ name: '', phone: '', roomNo: '', aadhar: '', address: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const nav = useNavigate()

  const generatePassword = () => {
    // Generate a random 8 character password
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
    let password = ''
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setForm({ ...form, password })
  }

  const validate = () => {
    const e = {}
    if (!form.name) e.name = 'Name required'
    if (!form.phone) e.phone = 'Phone required'
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await userApi.addUser(form)
      success('User added successfully')
      nav('/users')
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to add user'
      error(errorMsg)
      console.error('Add user error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Add User" />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 max-w-2xl">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={errors.phone} />
            <Input label="Room No" value={form.roomNo} onChange={(e) => setForm({ ...form, roomNo: e.target.value })} />
            <Input label="Aadhar" value={form.aadhar} onChange={(e) => setForm({ ...form, aadhar: e.target.value })} />
            <div className="md:col-span-2">
              <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className={`w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2.5 text-sm transition-all pr-10 ${
                        errors.password ? 'border-red-300 focus:ring-red-500' : ''
                      }`}
                      placeholder="Enter password for user login"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium whitespace-nowrap"
                  >
                    Generate
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-600 mt-1.5">{errors.password}</p>}
                <p className="text-xs text-gray-500 mt-1.5">User will use phone number and this password to login</p>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <Button loading={loading} type="submit" className="w-full md:w-auto">Add User</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddUser
