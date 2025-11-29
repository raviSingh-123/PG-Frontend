import React, { useState } from 'react'
import PageHeader from '../../components/PageHeader'
import Select from '../../components/Select'
import { months } from '../../utils/months'
import paymentApi from '../../api/paymentApi'
import Loader from '../../components/Loader'

const MonthlyReport = () => {
  const [month, setMonth] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchReport = async () => {
    if (!month || !year) return alert('Select month & year')
    setLoading(true)
    try {
      const res = await paymentApi.getMonthlyReport(month, year)
      setReport(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Monthly Report" />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select label="Month" value={month} onChange={(e) => setMonth(e.target.value)} options={months} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Year</label>
            <input 
              type="number" 
              value={year} 
              onChange={(e) => setYear(e.target.value)} 
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" 
            />
          </div>
          <div className="flex items-end">
            <button 
              onClick={fetchReport} 
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
            >
              Get Report
            </button>
          </div>
        </div>
      </div>

      {loading && <Loader />}

      {report && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Paid ({report.paid?.length || 0})
            </h3>
            {report.paid?.length === 0 ? (
              <p className="text-gray-500 text-sm">No paid records</p>
            ) : (
              <ul className="space-y-2">
                {report.paid?.map(r => (
                  <li key={r._id} className="py-3 px-3 bg-green-50 rounded-lg border border-green-100 flex justify-between items-center">
                    <div className="font-medium text-gray-900">{r.userId?.name || r.user?.name || r.userName || '—'}</div>
                    <div className="font-semibold text-green-700">₹{r.amount}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Unpaid ({report.unpaid?.length || 0})
            </h3>
            {report.unpaid?.length === 0 ? (
              <p className="text-gray-500 text-sm">No unpaid records</p>
            ) : (
              <ul className="space-y-2">
                {report.unpaid?.map(r => (
                  <li key={r._id} className="py-3 px-3 bg-red-50 rounded-lg border border-red-100 flex justify-between items-center">
                    <div className="font-medium text-gray-900">{r.name} <span className="text-gray-600">({r.roomNo})</span></div>
                    <div className="font-semibold text-red-600">Unpaid</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MonthlyReport
