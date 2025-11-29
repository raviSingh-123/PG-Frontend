import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import Button from '../../components/Button'
import adminApi from '../../api/adminApi'
import { success, error } from '../../utils/toast'

const UploadQR = () => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!file) return error('Please select a file')
    const fd = new FormData()
    fd.append('qr', file)
    setLoading(true)
    try {
      await adminApi.uploadQR(fd)
      success('QR uploaded successfully')
      setFile(null)
      setPreview(null)
      setTimeout(() => nav('/profile'), 1000)
    } catch (err) {
      error(err?.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Upload UPI QR" />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 max-w-2xl">
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select QR Code Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors">
              <div className="space-y-1 text-center w-full">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Upload a file</span>
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      accept="image/*" 
                      className="sr-only" 
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          {preview && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
              <div className="flex justify-center">
                <img 
                  src={preview} 
                  alt="QR Preview" 
                  className="max-w-xs rounded-lg shadow-sm border-2 border-gray-200"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button loading={loading} type="submit" className="flex-1">
              Upload QR Code
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

export default UploadQR
