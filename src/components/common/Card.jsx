import React from 'react'

/**
 * Reusable Card wrapper with consistent light/dark surface styles
 */
export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 text-gray-900 dark:text-gray-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}