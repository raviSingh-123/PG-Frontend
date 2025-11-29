import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import userApi from '../../api/userApi'
import Loader from '../../components/Loader'
import { error } from '../../utils/toast'

const UserList = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await userApi.getUsers()
      // Backend returns { total, page, limit, users }
      setUsers(res.data?.users || [])
    } catch (err) {
      error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return
    try {
      await userApi.deleteUser(id)
      setUsers((s) => s.filter(u => u._id !== id))
    } catch (err) {
      error('Delete failed')
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      <PageHeader 
        title="Users" 
        actions={
          <Link 
            to="/admin/users/add" 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
          >
            Add User
          </Link>
        } 
      />
      
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {users.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
            No users found.
          </div>
        ) : (
          users.map(u => (
            <div key={u._id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{u.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Room: {u.roomNo}</p>
                  <p className="text-sm text-gray-600">Phone: {u.phone}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t">
                <Link 
                  to={`/admin/users/${u._id}`} 
                  className="flex-1 text-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  View
                </Link>
                <Link 
                  to={`/admin/users/edit/${u._id}`} 
                  className="flex-1 text-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(u._id)} 
                  className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Room</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 lg:px-6 py-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{u.name}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{u.roomNo}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{u.phone}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Link 
                          to={`/admin/users/${u._id}`} 
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
                        >
                          View
                        </Link>
                        <Link 
                          to={`/admin/users/edit/${u._id}`} 
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(u._id)} 
                          className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
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

export default UserList
