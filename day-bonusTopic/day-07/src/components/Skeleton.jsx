import React from 'react'

const Skeleton = () => {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-sm animate-pulse dark:border-gray-800 dark:bg-gray-900">
      {/* Header section with Avatar and User Details */}
      <div className="flex items-center gap-4">
        {/* Profile Avatar Skeleton */}
        <div className="h-14 w-14 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
        
        {/* User Info (Name & Handle/Role) */}
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-1/2 rounded-md bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      {/* Content / Bio Lines */}
      <div className="mt-5 space-y-2.5">
        <div className="h-3 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-4/5 rounded-md bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Meta Stats Grid */}
      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <div className="space-y-1.5 text-center">
          <div className="mx-auto h-4 w-8 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mx-auto h-3 w-12 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="space-y-1.5 text-center">
          <div className="mx-auto h-4 w-8 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mx-auto h-3 w-12 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="space-y-1.5 text-center">
          <div className="mx-auto h-4 w-8 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mx-auto h-3 w-12 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex gap-3">
        <div className="h-9 flex-1 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="h-9 w-20 rounded-xl bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  )
}

export default Skeleton