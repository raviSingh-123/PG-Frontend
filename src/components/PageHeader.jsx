import React from 'react'

const PageHeader = ({ title, subtitle, actions }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-sm text-gray-600 mt-1.5">{subtitle}</p>}
    </div>
    {actions && <div className="flex-shrink-0">{actions}</div>}
  </div>
)

export default PageHeader
