import api from './axiosInstance'

const getProfile = () => api.get('/api/admin/me')
const updateUPI = (data) => api.put('/api/admin/update-upi', data)
const uploadQR = (formData) => api.post('/api/admin/upload-qr', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export default { getProfile, updateUPI, uploadQR }
