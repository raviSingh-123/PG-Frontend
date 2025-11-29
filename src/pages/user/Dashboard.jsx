import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import userAuthApi from '../../api/userAuthApi'
import Loader from '../../components/Loader'
import formatDate from '../../utils/formatDate'

const UserDashboard = () => {
  const [upiInfo, setUpiInfo] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showQRModal, setShowQRModal] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [upiRes, paymentRes] = await Promise.all([
          userAuthApi.getUpiInfo(),
          userAuthApi.getPaymentHistory()
        ])
        setUpiInfo(upiRes.data)
        setPayments(paymentRes.data?.payments || [])
      } catch (err) {
        console.error('Error fetching data:', err)
        console.error('Error details:', err.response?.data)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user_token')
    localStorage.removeItem('user_data')
    nav('/user/login')
  }

  const handleDownloadQR = async () => {
    if (!upiInfo?.upiQrUrl) return
    
    try {
      // Method 1: Try to fetch and download as blob (works for same-origin or CORS-enabled images)
      const response = await fetch(upiInfo.upiQrUrl, {
        mode: 'cors',
        credentials: 'omit'
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const blobUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = `UPI-QR-Code-${userData.name || 'QR'}-${Date.now()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)
        return
      }
    } catch (fetchError) {
      console.log('Fetch method failed, trying alternative method:', fetchError)
    }
    
    // Method 2: Convert image to canvas and download (works even with CORS)
    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const blobUrl = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = blobUrl
            link.download = `UPI-QR-Code-${userData.name || 'QR'}-${Date.now()}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(blobUrl)
          }
        }, 'image/png')
      }
      
      img.onerror = () => {
        // Method 3: Fallback - direct download link
        const link = document.createElement('a')
        link.href = upiInfo.upiQrUrl
        link.download = `UPI-QR-Code-${userData.name || 'QR'}.png`
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      
      img.src = upiInfo.upiQrUrl
    } catch (error) {
      console.error('Error downloading QR code:', error)
      // Final fallback
      const link = document.createElement('a')
      link.href = upiInfo.upiQrUrl
      link.download = `UPI-QR-Code-${userData.name || 'QR'}.png`
      link.target = '_blank'
      link.click()
    }
  }

  const userData = JSON.parse(localStorage.getItem('user_data') || '{}')

  if (loading) return <Loader />

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => nav('/')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium cursor-pointer"
                title="Go to Home Page"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium cursor-pointer"
              title="Logout"
            >
              Logout
            </button>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Welcome, {userData.name}</h1>
            <p className="text-sm text-gray-600 mt-1">Room: {userData.roomNo}</p>
          </div>
        </div>

        {/* UPI Information Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Payment Information</h2>
          
          {upiInfo && upiInfo.upiQrUrl ? (
            <div className="space-y-4">
              {upiInfo.upiId && (
                <div>
                  <div className="text-sm text-gray-600 mb-2">UPI ID</div>
                  <div className="text-2xl font-bold text-indigo-600 break-all">{upiInfo.upiId}</div>
                </div>
              )}

              <div>
                <div className="text-sm text-gray-600 mb-4">Scan QR Code to Pay</div>
                <div 
                  className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-200 cursor-pointer hover:border-indigo-300 transition-colors max-w-xs mx-auto"
                  onClick={() => setShowQRModal(true)}
                  title="Click to view full size"
                >
                  <img 
                    src={upiInfo.upiQrUrl} 
                    alt="UPI QR Code" 
                    className="w-full rounded-lg shadow-sm pointer-events-none"
                  />
                </div>
                <div className="mt-4 flex gap-3 max-w-xs mx-auto">
                  <button
                    onClick={handleDownloadQR}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2 cursor-pointer"
                    title="Download QR Code"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => setShowQRModal(true)}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium cursor-pointer"
                    title="View QR Code in full size"
                  >
                    View Full Size
                  </button>
                </div>
              </div>

              {upiInfo.adminName && (
                <div className="text-center text-sm text-gray-500 mt-4">
                  Payment to: {upiInfo.adminName}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600">UPI information not available yet</p>
            </div>
          )}
        </div>

        {/* Payment History Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 mt-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Payment History</h2>
          
          {payments.length > 0 ? (
            <>
              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {payments.map(payment => (
                  <div key={payment._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="text-lg font-bold text-gray-900">₹{payment.amount}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {payment.month}/{payment.year} - {payment.rentType}
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        payment.mode === 'online' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {payment.mode}
                      </span>
                    </div>
                    <div className="pt-3 border-t space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="text-gray-900">{formatDate(payment.paymentDate)}</span>
                      </div>
                      {payment.transactionId && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transaction ID:</span>
                          <span className="text-gray-900 font-medium">{payment.transactionId}</span>
                        </div>
                      )}
                      {payment.note && (
                        <div className="text-gray-600">
                          <span className="font-medium">Note:</span> {payment.note}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Mode</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Month/Year</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map(payment => (
                      <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">₹{payment.amount}</div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            payment.mode === 'online' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {payment.mode}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">{payment.month}/{payment.year}</div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">{payment.rentType}</div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">{formatDate(payment.paymentDate)}</div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">{payment.transactionId || '—'}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Stats */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
                <div className="bg-indigo-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Payments</div>
                  <div className="text-2xl font-bold text-indigo-600">{payments.length}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Online Payments</div>
                  <div className="text-2xl font-bold text-green-600">
                    {payments.filter(p => p.mode === 'online').length}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Cash Payments</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {payments.filter(p => p.mode === 'cash').length}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-600">No payment history found</p>
              <p className="text-sm text-gray-500 mt-1">Your payment records will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && upiInfo?.upiQrUrl && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setShowQRModal(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">UPI QR Code</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                title="Close"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div 
              className="bg-white p-3 rounded-xl border-2 border-gray-200 mb-4 cursor-pointer hover:border-indigo-300 transition-colors max-w-xs mx-auto"
              onClick={() => setShowQRModal(false)}
              title="Click to close"
            >
              <img 
                src={upiInfo.upiQrUrl} 
                alt="UPI QR Code" 
                className="w-full h-auto rounded-lg pointer-events-none max-h-[300px] object-contain"
              />
            </div>
            {upiInfo.upiId && (
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 mb-1">UPI ID</p>
                <p className="text-base font-semibold text-indigo-600 break-all">{upiInfo.upiId}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleDownloadQR}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2 cursor-pointer"
                title="Download QR Code"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download QR</span>
              </button>
              <button
                onClick={() => setShowQRModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium cursor-pointer"
                title="Close modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDashboard

