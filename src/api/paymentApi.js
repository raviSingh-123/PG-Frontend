import api from './axiosInstance'

const addPayment = (payload) => api.post('/api/payments', payload)
const getPayments = (params) => api.get('/api/payments', { params })
const getPaymentsByUser = (userId) => api.get(`/api/payments/user/${userId}`)
const getMonthlyReport = (month, year) => api.get(`/api/payments/monthly`, { params: { month, year } })
const updatePayment = (id, payload) => api.put(`/api/payments/${id}`, payload)
const deletePayment = (id) => api.delete(`/api/payments/${id}`)

export default { addPayment, getPayments, getPaymentsByUser, getMonthlyReport, updatePayment, deletePayment }
