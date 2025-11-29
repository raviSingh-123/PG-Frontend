import React from 'react'

const Button = ({ children, loading = false, onClick, type = 'button', className = '' }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={loading}
      className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all font-medium text-sm shadow-sm hover:shadow-md ${className}`}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      )}
      <span>{children}</span>
    </button>
  )
}

export default Button
