import api from './axiosInstance'

const getUsers = (params) => api.get('/api/users', { params }) // support pagination/filter
const getUser = (id) => api.get(`/api/users/${id}`)
const addUser = (payload) => api.post('/api/users', payload)
const updateUser = (id, payload) => api.put(`/api/users/${id}`, payload)
const deleteUser = (id) => api.delete(`/api/users/${id}`)

export default { getUsers, getUser, addUser, updateUser, deleteUser }
