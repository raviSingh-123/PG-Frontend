import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth()
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-6 fixed left-0 lg:left-64 right-0 top-0 z-30 shadow-sm">
      <div className="flex items-center space-x-3 lg:space-x-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link
          to="/"
          className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-indigo-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-sm font-medium">Home</span>
        </Link>
        <div className="text-xs lg:text-sm text-gray-600">
          Welcome back, <span className="font-semibold text-gray-800">{user?.name ?? 'Admin'}</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="hidden sm:block text-xs lg:text-sm text-gray-600 font-medium">Admin</div>
        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-200">
          <img 
            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=6366f1&color=fff`} 
            alt="avatar" 
            className="w-full h-full rounded-full object-cover" 
          />
        </div>
      </div>
    </header>
  )
}

export default Navbar
