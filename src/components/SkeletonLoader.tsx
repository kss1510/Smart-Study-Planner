import { Card } from './ui/card'
import { Skeleton } from './ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Welcome Section Skeleton */}
      <div className="bg-gradient-to-r from-purple-300 to-pink-300 rounded-3xl p-8">
        <Skeleton className="h-8 w-48 bg-purple-200 mb-2" />
        <Skeleton className="h-4 w-96 bg-purple-400" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
            <Skeleton className="h-12 w-12 rounded-xl mb-4" />
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-16" />
          </Card>
        ))}
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className="h-16 w-full" />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function TasksSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>

      <div>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <div className="flex gap-4">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-4 w-20" />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      <Card className="p-6 bg-gradient-to-r from-purple-300 to-pink-300">
        <Skeleton className="h-6 w-32 bg-purple-200 mb-2" />
        <Skeleton className="h-4 w-full bg-purple-400" />
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
            <Skeleton className="h-12 w-12 rounded-xl mb-4" />
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-16 mb-1" />
            <Skeleton className="h-3 w-20" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-[300px] w-full" />
          </Card>
        ))}
      </div>
    </div>
  )
}
