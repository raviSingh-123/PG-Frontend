import api from './userAxiosInstance'

const getUpiInfo = () => api.get('/api/user/upi-info')
const getPaymentHistory = () => api.get('/api/user/payment-history')

export default { getUpiInfo, getPaymentHistory }

