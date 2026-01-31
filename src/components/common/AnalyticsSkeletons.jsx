// components/common/AnalyticsSkeletons.jsx
import React from 'react';
import { Skeleton } from './Skeletons';

// Metrics Card Skeleton
export const MetricsCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-8 w-32 mb-2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-12 w-12 rounded-lg" />
    </div>
  </div>
);

// Chart Skeleton
export const ChartSkeleton = ({ title = "Chart" }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-8 w-32 rounded-lg" />
    </div>
    <div className="h-80 flex items-center justify-center">
      <Skeleton className="h-full w-full rounded" />
    </div>
  </div>
);

// Budget Progress Skeleton
export const BudgetProgressSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-6 w-20" />
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
      <Skeleton className="h-2 w-3/5 rounded-full bg-gray-300 dark:bg-gray-600" />
    </div>
    <div className="flex justify-between text-sm">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
);

// Analytics Metrics Grid Skeleton
export const AnalyticsMetricsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <MetricsCardSkeleton key={i} />
    ))}
  </div>
);

// Analytics Dashboard Skeleton
export const AnalyticsDashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton title="Spending by Category" />
      <ChartSkeleton title="Monthly Trends" />
    </div>
  </div>
);

// Category Budgets Skeleton
export const CategoryBudgetsSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
    <Skeleton className="h-6 w-48 mb-6" />
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <BudgetProgressSkeleton key={i} />
      ))}
    </div>
  </div>
);

// Full Analytics Page Skeleton
export const AnalyticsPageSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-40 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>

    {/* Metrics */}
    <AnalyticsMetricsSkeleton />

    {/* Charts */}
    <AnalyticsDashboardSkeleton />

    {/* Category Budgets */}
    <CategoryBudgetsSkeleton />
  </div>
);

// Budget Overview Skeleton
export const BudgetOverviewSkeleton = () => (
  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-xl shadow-lg p-8">
    <div className="flex items-center justify-between mb-6">
      <Skeleton variant="light" className="h-6 w-48 bg-white/20" />
      <Skeleton variant="light" className="h-10 w-32 rounded-lg bg-white/20" />
    </div>
    
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <div>
        <Skeleton variant="light" className="h-4 w-24 mb-2 bg-white/20" />
        <Skeleton variant="light" className="h-12 w-40 bg-white/30" />
      </div>
      <div>
        <Skeleton variant="light" className="h-4 w-24 mb-2 bg-white/20" />
        <Skeleton variant="light" className="h-12 w-40 bg-white/30" />
      </div>
    </div>

    <div className="w-full bg-white/20 rounded-full h-4 mb-4">
      <Skeleton variant="light" className="h-4 w-3/5 bg-white/40 rounded-full" />
    </div>

    <div className="flex justify-between">
      <Skeleton variant="light" className="h-4 w-32 bg-white/20" />
      <Skeleton variant="light" className="h-4 w-32 bg-white/20" />
    </div>
  </div>
);

// Budget Stats Skeleton
export const BudgetStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-24 mb-2" />
        <Skeleton className="h-3 w-full" />
      </div>
    ))}
  </div>
);

// Full Budget Page Skeleton
export const BudgetPageSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-64" />
    </div>

    {/* Overview */}
    <BudgetOverviewSkeleton />

    {/* Stats */}
    <BudgetStatsSkeleton />

    {/* Category Budgets */}
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <Skeleton className="h-6 w-48 mb-6" />
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <BudgetProgressSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);