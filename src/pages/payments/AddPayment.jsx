import React, { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import Input from '../../components/Input'
import Select from '../../components/Select'
import Button from '../../components/Button'
import userApi from '../../api/userApi'
import paymentApi from '../../api/paymentApi'
import { months } from '../../utils/months'
import { success, error } from '../../utils/toast'
import { useNavigate, useSearchParams } from 'react-router-dom'

const AddPayment = () => {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({
    userId: '',
    amount: '',
    mode: 'online',
    paymentDate: '',
    month: '',
    year: '',
    rentType: 'monthly-rent',
    transactionId: '',
    note: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const nav = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await userApi.getUsers()
        // Backend returns { total, page, limit, users }
        setUsers(res.data?.users || [])
        const userId = searchParams.get('userId')
        setForm(f => ({ ...f, userId: userId || f.userId, paymentDate: new Date().toISOString().slice(0,10), year: new Date().getFullYear() }))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    // build payload as your API expects
    if (!form.userId) return error('Select user')
    setSaving(true)
    try {
      const payload = {
        userId: form.userId,
        amount: Number(form.amount),
        mode: form.mode,
        paymentDate: form.paymentDate,
        month: Number(form.month),
        year: Number(form.year),
        rentType: form.rentType,
        transactionId: form.transactionId,
        note: form.note
      }
      await paymentApi.addPayment(payload)
      success('Payment added')
      nav(`/users/${form.userId}`)
    } catch (err) {
      error('Add payment failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6 bg-white rounded shadow"><div>Loading...</div></div>

  return (
    <div>
      <PageHeader title="Add Payment" />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 max-w-2xl">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Select label="User" name="userId" value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} options={users.map(u => ({ value: u._id, label: `${u.name} (${u.roomNo})` }))} />
            </div>
            <Input label="Amount" name="amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <Select label="Mode" name="mode" value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} options={['cash', 'online']} />
            <Input label="Payment Date" name="paymentDate" type="date" value={form.paymentDate} onChange={(e) => setForm({ ...form, paymentDate: e.target.value })} />
            <Select label="Month" name="month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} options={months} />
            <Input label="Year" name="year" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
            <div className="md:col-span-2">
              <Select label="Rent Type" name="rentType" value={form.rentType} onChange={(e) => setForm({ ...form, rentType: e.target.value })} options={['monthly-rent', 'advance', 'security', 'other']} />
            </div>
            <Input label="Transaction ID" name="transactionId" value={form.transactionId} onChange={(e) => setForm({ ...form, transactionId: e.target.value })} />
            <div className="md:col-span-2">
              <Input label="Note" name="note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            </div>
          </div>
          <div className="pt-4">
            <Button loading={saving} type="submit" className="w-full md:w-auto">Add Payment</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddPayment
