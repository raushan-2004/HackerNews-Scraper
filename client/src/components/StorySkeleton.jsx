import React from 'react';

const StorySkeleton = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg animate-pulse">
      <div className="flex justify-between items-start mb-4">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        {/* Bookmark icon skeleton */}
        <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
      </div>
      <div className="flex items-center space-x-4 mt-8">
        {/* Meta data skeleton (points, author, time) */}
        <div className="h-4 bg-gray-700 rounded w-16"></div>
        <div className="h-4 bg-gray-700 rounded w-20"></div>
        <div className="h-4 bg-gray-700 rounded w-24"></div>
      </div>
    </div>
  );
};

export default StorySkeleton;
