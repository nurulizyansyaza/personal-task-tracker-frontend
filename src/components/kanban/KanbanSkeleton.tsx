'use client';

interface KanbanSkeletonProps {
  count?: number;
}

export default function KanbanSkeleton({ count = 3 }: KanbanSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg border-l-4 border-l-gray-200 shadow-sm p-3 animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-full mb-1" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
          <div className="flex justify-between mt-3">
            <div className="h-3 bg-gray-100 rounded w-12" />
            <div className="flex gap-1">
              <div className="h-5 w-5 bg-gray-100 rounded" />
              <div className="h-5 w-5 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
