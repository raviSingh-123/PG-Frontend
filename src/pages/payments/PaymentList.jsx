import React, { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import paymentApi from '../../api/paymentApi'
import { months } from '../../utils/months'
import Select from '../../components/Select'
import Loader from '../../components/Loader'
import formatDate from '../../utils/formatDate'
import { useNavigate } from 'react-router-dom'

const PaymentList = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ month: '', year: '', mode: '' })
  const nav = useNavigate()

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await paymentApi.getPayments(filters)
      // Backend returns { total, page, limit, payments }
      setPayments(res.data?.payments || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  const applyFilters = () => { fetch() }

  if (loading) return <Loader />

  return (
    <div>
      <PageHeader 
        title="Payments" 
        actions={
          <button 
            onClick={() => nav('/admin/payments/add')} 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
          >
            Add Payment
          </button>
        } 
      />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <Select label="Month" value={filters.month} onChange={(e) => setFilters(f => ({ ...f, month: e.target.value }))} options={months} />
          <input 
            type="number" 
            placeholder="Year" 
            value={filters.year} 
            onChange={(e) => setFilters(f => ({ ...f, year: e.target.value }))} 
            className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" 
          />
          <Select label="Mode" value={filters.mode} onChange={(e) => setFilters(f => ({ ...f, mode: e.target.value }))} options={['online', 'cash']} />
          <div className="flex items-end">
            <button 
              onClick={applyFilters} 
              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {payments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500 border border-gray-100">
            No payments found
          </div>
        ) : (
          payments.map(p => (
            <div key={p._id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{p.userId?.name || p.user?.name || p.userName || '—'}</h3>
                  <p className="text-sm text-gray-600 mt-1">₹{p.amount}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  p.mode === 'online' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {p.mode}
                </span>
              </div>
              <div className="flex items-center gap-4 pt-3 border-t text-sm text-gray-600">
                <span>{p.month}/{p.year}</span>
                <span>{formatDate(p.paymentDate)}</span>
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
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Mode</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Month</th>
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
                      <div className="text-sm font-medium text-gray-900">{p.userId?.name || p.user?.name || p.userName || '—'}</div>
                    </td>
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

export default PaymentList
