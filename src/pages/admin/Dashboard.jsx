import React, { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import adminApi from '../../api/adminApi'
import paymentApi from '../../api/paymentApi'
import userApi from '../../api/userApi'
import Loader from '../../components/Loader'
import formatDate from '../../utils/formatDate'

const Dashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, paidThisMonth: 0, unpaidThisMonth: 0 })
  const [latestPayments, setLatestPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        // For demo: fetch counts from endpoints or compute locally
        const usersRes = await userApi.getUsers()
        const paymentsRes = await paymentApi.getPayments({ limit: 10 })
        // Backend returns { total, page, limit, users } and { total, page, limit, payments }
        const users = usersRes.data?.users || []
        const payments = paymentsRes.data?.payments || []
        // compute paid/unpaid this month
        const now = new Date()
        const month = now.getMonth() + 1
        const year = now.getFullYear()
        const paid = payments.filter(p => p.month === month && p.year === year).length
        const unpaid = Math.max(0, (users.length || 0) - paid)

        setStats({
          totalUsers: users.length,
          paidThisMonth: paid,
          unpaidThisMonth: unpaid
        })
        setLatestPayments(payments.slice(0, 10))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) return <Loader />

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of PG operations" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:p-6">
          <div className="text-sm text-gray-600 mb-2">Total Users</div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:p-6">
          <div className="text-sm text-gray-600 mb-2">Paid This Month</div>
          <div className="text-3xl font-bold text-green-600">{stats.paidThisMonth}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:p-6 sm:col-span-2 lg:col-span-1">
          <div className="text-sm text-gray-600 mb-2">Unpaid This Month</div>
          <div className="text-3xl font-bold text-red-600">{stats.unpaidThisMonth}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">Latest Payments</h3>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3">
          {latestPayments.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No payments yet</div>
          ) : (
            latestPayments.map((p) => (
              <div key={p._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{p.userId?.name || p.user?.name || p.userName || '—'}</h4>
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
        <div className="hidden md:block overflow-x-auto">
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
              {latestPayments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 lg:px-6 py-8 text-center text-gray-500">
                    No payments yet
                  </td>
                </tr>
              ) : (
                latestPayments.map((p) => (
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

export default Dashboard
