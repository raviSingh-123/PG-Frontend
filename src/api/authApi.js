import api from './axiosInstance'

// Admin login with email
const adminLogin = (credentials) => api.post('/api/auth/login', { email: credentials.email, password: credentials.password })

// User login with phone
const userLogin = (credentials) => api.post('/api/auth/login', { phone: credentials.phone, password: credentials.password })

export default { adminLogin, userLogin }
