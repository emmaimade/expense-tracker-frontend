import React from 'react'

/**
 * Reusable Card wrapper with consistent light/dark surface styles
 */
export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
