import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import Input from '../../components/Input'
import Button from '../../components/Button'
import adminApi from '../../api/adminApi'
import { success, error } from '../../utils/toast'

const UpdateUPI = () => {
  const [upi, setUpi] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const nav = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await adminApi.getProfile()
        if (res.data?.upiId) {
          setUpi(res.data.upiId)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setFetching(false)
      }
    }
    fetchProfile()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!upi.trim()) return error('UPI ID is required')
    setLoading(true)
    try {
      await adminApi.updateUPI({ upiId: upi.trim() })
      success('UPI ID updated successfully')
      setTimeout(() => nav('/profile'), 1000)
    } catch (err) {
      error(err?.response?.data?.message || 'Failed to update')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div>
        <PageHeader title="Update UPI ID" />
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-lg">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Update UPI ID" />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 max-w-lg">
        <form onSubmit={submit} className="space-y-4">
          <Input 
            label="UPI ID" 
            value={upi} 
            onChange={(e) => setUpi(e.target.value)} 
            placeholder="example@paytm or example@ybl" 
            required
          />
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              <strong>Note:</strong> Enter your UPI ID (e.g., yourname@paytm, yourname@ybl, yourname@phonepe)
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button loading={loading} type="submit" className="flex-1">
              Update UPI ID
            </Button>
            <button
              type="button"
              onClick={() => nav('/profile')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateUPI
