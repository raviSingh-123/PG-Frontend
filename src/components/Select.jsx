import React from 'react'

const Select = ({ label, name, value, onChange, options = [], placeholder = 'Select', error = '', className = '' }) => {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2.5 text-sm transition-all ${
          error ? 'border-red-300 focus:ring-red-500' : ''
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
    </div>
  )
}

export default Select
