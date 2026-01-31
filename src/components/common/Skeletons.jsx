import React from 'react';

// Base Skeleton Component
export const Skeleton = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-200 dark:bg-gray-700',
    light: 'bg-gray-100 dark:bg-gray-800',
    card: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
  };

  return (
    <div
      className={`animate-pulse ${variants[variant]} rounded ${className}`}
      aria-live="polite"
      aria-busy="true"
    />
  );
};

// Stats Card Skeleton
export const StatsCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <Skeleton className="h-4 w-32 mb-3" />
        <Skeleton className="h-8 w-24 mb-2" />
        <Skeleton className="h-3 w-40" />
      </div>
      <Skeleton className="h-12 w-12 rounded-lg" />
    </div>
  </div>
);

// Budget Overview Skeleton
export const BudgetOverviewSkeleton = () => (
  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
    <div className="flex items-center justify-between mb-4">
      <Skeleton variant="light" className="h-6 w-32 bg-white/20" />
      <Skeleton variant="light" className="h-8 w-8 rounded-full bg-white/20" />
    </div>
    
    <div className="space-y-3 mb-4">
      <Skeleton variant="light" className="h-10 w-48 bg-white/30" />
      <Skeleton variant="light" className="h-4 w-64 bg-white/20" />
    </div>

    <div className="w-full bg-white/20 rounded-full h-3 mb-4">
      <Skeleton variant="light" className="h-3 w-2/3 bg-white/40 rounded-full" />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Skeleton variant="light" className="h-3 w-20 mb-2 bg-white/20" />
        <Skeleton variant="light" className="h-5 w-24 bg-white/30" />
      </div>
      <div>
        <Skeleton variant="light" className="h-3 w-20 mb-2 bg-white/20" />
        <Skeleton variant="light" className="h-5 w-24 bg-white/30" />
      </div>
    </div>
  </div>
);

// Transaction Row Skeleton
export const TransactionRowSkeleton = () => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
    <div className="flex items-center space-x-3 flex-1">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <Skeleton className="h-5 w-20" />
  </div>
);

// Recent Activity Skeleton
export const RecentActivitySkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-8 w-20" />
    </div>
    <div className="space-y-1">
      {[...Array(5)].map((_, i) => (
        <TransactionRowSkeleton key={i} />
      ))}
    </div>
  </div>
);

// Category Chart Skeleton
export const CategoryChartSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
    <Skeleton className="h-6 w-48 mb-6" />
    <div className="flex items-center justify-center">
      <Skeleton className="h-64 w-64 rounded-full" />
    </div>
    <div className="mt-6 space-y-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  </div>
);

// Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 5 }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    {/* Table Header */}
    <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 px-6 py-3">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {[...Array(columns)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-20" />
        ))}
      </div>
    </div>
    
    {/* Table Body */}
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {[...Array(columns)].map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Dashboard Grid Skeleton
export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Welcome Section */}
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-96" />
    </div>

    {/* Budget Overview */}
    <BudgetOverviewSkeleton />

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>

    {/* Quick Insights */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RecentActivitySkeleton />
      <CategoryChartSkeleton />
    </div>
  </div>
);

// Form Skeleton
export const FormSkeleton = () => (
  <div className="space-y-4">
    {[...Array(4)].map((_, i) => (
      <div key={i}>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    ))}
    <div className="flex gap-3 pt-4">
      <Skeleton className="h-10 flex-1 rounded-lg" />
      <Skeleton className="h-10 flex-1 rounded-lg" />
    </div>
  </div>
);

export default {
  Skeleton,
  StatsCardSkeleton,
  BudgetOverviewSkeleton,
  TransactionRowSkeleton,
  RecentActivitySkeleton,
  CategoryChartSkeleton,
  TableSkeleton,
  DashboardSkeleton,
  FormSkeleton
};

export * from './AnalyticsSkeletons';
export * from './SettingsSkeletons';