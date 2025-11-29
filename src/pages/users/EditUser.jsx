import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import Input from '../../components/Input'
import Button from '../../components/Button'
import userApi from '../../api/userApi'
import { success, error } from '../../utils/toast'
import Loader from '../../components/Loader'

const EditUser = () => {
  const { id } = useParams()
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', roomNo: '', aadhar: '', address: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await userApi.getUser(id)
        setForm(res.data)
      } catch (err) {
        error('Load failed')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await userApi.updateUser(id, form)
      success('User updated')
      nav('/users')
    } catch (err) {
      error('Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      <PageHeader title="Edit User" />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 max-w-2xl">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Room No" value={form.roomNo} onChange={(e) => setForm({ ...form, roomNo: e.target.value })} />
            <Input label="Aadhar" value={form.aadhar} onChange={(e) => setForm({ ...form, aadhar: e.target.value })} />
            <div className="md:col-span-2">
              <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>
          <div className="pt-4">
            <Button loading={saving} type="submit" className="w-full md:w-auto">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUser
