// components/common/SettingsSkeletons.jsx
import { Skeleton } from './Skeletons';

// Profile card skeleton (avatar, name/email, account details)
export const ProfileInfoSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
    <div className="flex items-center gap-4">
      <Skeleton className="w-14 h-14 rounded-full shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-5 w-40 mb-2" />
        <Skeleton className="h-4 w-56 max-w-full" />
      </div>
      <Skeleton className="hidden sm:block h-9 w-28 rounded-lg" />
    </div>
    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  </div>
);
