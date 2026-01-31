// components/common/SettingsSkeletons.jsx
import React from 'react';
import { Skeleton } from './Skeletons';

// Profile Information Skeleton
export const ProfileInfoSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
    <Skeleton className="h-6 w-48 mb-4" />
    <div className="space-y-4">
      {/* Name */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-40" />
      </div>
      {/* Email */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-56" />
      </div>
      {/* Buttons */}
      <div className="mt-6 flex gap-3">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
    </div>
  </div>
);

// Account Stats Skeleton
export const AccountStatsSkeleton = () => (
  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 p-6">
    <Skeleton className="h-5 w-40 mb-3" />
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Skeleton className="h-3 w-16 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div>
        <Skeleton className="h-3 w-24 mb-2" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  </div>
);

// Profile Section Skeleton
export const ProfileSectionSkeleton = () => (
  <div className="space-y-6">
    <ProfileInfoSkeleton />
    <AccountStatsSkeleton />
  </div>
);

// Category Management Skeleton
export const CategoryManagementSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
    <Skeleton className="h-6 w-48 mb-4" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-3/4 mb-4" />
    <Skeleton className="h-10 w-40 rounded-lg" />
  </div>
);

// Preferences Card Skeleton
export const PreferencesCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
    <Skeleton className="h-6 w-32 mb-4" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-2/3 mb-4" />
    <Skeleton className="h-10 w-36 rounded-lg" />
  </div>
);

// Settings Navigation Skeleton
export const SettingsNavSkeleton = () => (
  <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
    {[...Array(3)].map((_, i) => (
      <Skeleton key={i} className="flex-1 h-10 rounded-md" />
    ))}
  </div>
);

// Full Settings Page Skeleton
export const SettingsPageSkeleton = () => (
  <div className="p-6 max-w-4xl mx-auto">
    <Skeleton className="h-8 w-48 mb-6" />
    <SettingsNavSkeleton />
    <ProfileSectionSkeleton />
  </div>
);

// Modal Skeleton (for loading states inside modals)
export const ModalContentSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-48 mb-4" />
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i}>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
    </div>
    <div className="flex gap-3 pt-4">
      <Skeleton className="h-10 flex-1 rounded-lg" />
      <Skeleton className="h-10 flex-1 rounded-lg" />
    </div>
  </div>
);

// Category List Skeleton
export const CategoryListSkeleton = ({ count = 5 }) => (
  <div className="space-y-2">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center gap-3 flex-1">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16 rounded" />
          <Skeleton className="h-8 w-16 rounded" />
        </div>
      </div>
    ))}
  </div>
);

// Preference Item Skeleton
export const PreferenceItemSkeleton = () => (
  <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
    <div className="flex-1">
      <Skeleton className="h-5 w-40 mb-2" />
      <Skeleton className="h-3 w-64" />
    </div>
    <Skeleton className="h-10 w-32 rounded-lg" />
  </div>
);