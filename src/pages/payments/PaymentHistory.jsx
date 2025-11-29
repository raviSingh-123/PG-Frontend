import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import paymentApi from '../../api/paymentApi'
import Loader from '../../components/Loader'
import formatDate from '../../utils/formatDate'

const PaymentHistory = () => {
  const { userId } = useParams()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await paymentApi.getPaymentsByUser(userId)
        // Backend returns { payments }
        setPayments(res.data?.payments || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [userId])

  if (loading) return <Loader />

  return (
    <div>
      <PageHeader title="Payment History" />
      
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {payments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500 border border-gray-100">
            No payments found
          </div>
        ) : (
          payments.map(p => (
            <div key={p._id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
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
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Mode</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Month</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Transaction</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 lg:px-6 py-8 text-center text-gray-500">
                    No payments found
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

export default PaymentHistory
