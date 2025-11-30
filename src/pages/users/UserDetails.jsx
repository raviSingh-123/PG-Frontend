import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import userApi from '../../api/userApi'
import paymentApi from '../../api/paymentApi'
import Loader from '../../components/Loader'
import formatDate from '../../utils/formatDate'

const UserDetails = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await userApi.getUser(id)
        setUser(res.data)
        const payRes = await paymentApi.getPaymentsByUser(id)
        // Backend returns { payments }
        setPayments(payRes.data?.payments || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <Loader />

  return (
    <div>
      <PageHeader 
        title="User Details" 
        actions={
          <Link 
            to={`/admin/payments/add?userId=${id}`} 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
          >
            Add Payment
          </Link>
        } 
      />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Name</div>
              <div className="text-lg font-semibold text-gray-900">{user.name}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</div>
              <div className="text-base text-gray-700">{user.phone}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Room</div>
              <div className="text-base text-gray-700">{user.roomNo}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Address</div>
              <div className="text-base text-gray-700">{user.address || '—'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Aadhar</div>
              <div className="text-base text-gray-700">{user.aadhar || '—'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">Payment History</h3>
        
        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3">
          {payments.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No payments</div>
          ) : (
            payments.map(p => (
              <div key={p._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-lg font-bold text-gray-900">₹{p.amount}</div>
                    <div className="text-sm text-gray-600 mt-1">{p.month}/{p.year}</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    p.mode === 'online' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {p.mode}
                  </span>
                </div>
                <div className="pt-3 border-t space-y-1.5 text-sm">
                  {p.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="text-gray-900 font-medium">{p.transactionId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="text-gray-900">{formatDate(p.paymentDate)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Mode</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Month</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Transaction ID</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 lg:px-6 py-8 text-center text-gray-500">
                    No payments
                  </td>
                </tr>
              ) : (
                payments.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">₹{p.amount}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        p.mode === 'online' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {p.mode}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{p.month}/{p.year}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{p.transactionId || '—'}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{formatDate(p.paymentDate)}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default UserDetails
