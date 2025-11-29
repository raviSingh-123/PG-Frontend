import React, { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import adminApi from '../../api/adminApi'
import { Link } from 'react-router-dom'
import Loader from '../../components/Loader'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showQRModal, setShowQRModal] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await adminApi.getProfile()
        setProfile(res.data)
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
      <PageHeader title="Admin Profile" />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-4">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Name</div>
              <div className="text-lg font-semibold text-gray-900">{profile?.name}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</div>
              <div className="text-base text-gray-700">{profile?.email}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">UPI ID</div>
              <div className="text-base font-medium text-indigo-600">{profile?.upiId || 'Not set'}</div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <Link 
                to="/admin/profile/update-upi" 
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
              >
                Update UPI
              </Link>
              <Link 
                to="/admin/profile/upload-qr" 
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Upload QR
              </Link>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">UPI QR Code</div>
            {profile?.upiQrUrl ? (
              <div className="space-y-3">
                <div 
                  className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-200 cursor-pointer hover:border-indigo-300 transition-colors"
                  onClick={() => setShowQRModal(true)}
                >
                  <img 
                    src={profile.upiQrUrl} 
                    alt="UPI QR Code" 
                    className="w-full max-w-xs mx-auto rounded-lg shadow-sm"
                  />
                </div>
                <button
                  onClick={() => setShowQRModal(true)}
                  className="w-full px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                >
                  View Full Size
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500 mb-3">No QR code uploaded</p>
                <Link 
                  to="/admin/profile/upload-qr" 
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  Upload QR Code
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && profile?.upiQrUrl && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setShowQRModal(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">UPI QR Code</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-white p-3 rounded-xl border-2 border-gray-200 mb-4 max-w-xs mx-auto">
              <img 
                src={profile.upiQrUrl} 
                alt="UPI QR Code" 
                className="w-full h-auto rounded-lg max-h-[300px] object-contain"
              />
            </div>
            {profile?.upiId && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">UPI ID</p>
                <p className="text-base font-semibold text-indigo-600">{profile.upiId}</p>
              </div>
            )}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = profile.upiQrUrl
                  link.download = 'upi-qr-code.png'
                  link.click()
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                Download
              </button>
              <button
                onClick={() => setShowQRModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
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

export default Profile
