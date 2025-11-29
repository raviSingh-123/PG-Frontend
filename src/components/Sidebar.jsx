import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/payments', label: 'Payments' },
  { to: '/admin/payments/monthly-report', label: 'Monthly Reports' },
  { to: '/admin/profile', label: 'Admin Profile' },
]

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        w-64 bg-white border-r h-screen fixed left-0 top-0 pt-6 pb-6 z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        shadow-xl lg:shadow-none
      `}>
        <div className="px-6">
          <div className="flex items-center justify-between mb-6">
            <Link 
              to="/" 
              onClick={onClose}
              className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
            >
              RAM BOYS HOSTEL
            </Link>
            <button 
              onClick={onClose}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-6 pb-4 border-b">
            <div className="text-xs text-gray-500 mb-1">Signed in as</div>
            <div className="text-sm font-semibold text-gray-800">{user?.name ?? 'Admin'}</div>
          </div>

          <nav className="space-y-1">
            <Link
              to="/"
              onClick={onClose}
              className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-all flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </Link>
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 pt-4 border-t">
            <button 
              onClick={() => {
                logout()
                onClose()
              }} 
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
