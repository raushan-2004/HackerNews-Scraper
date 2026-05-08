import React from 'react';

const Pagination = ({ pagination, onPageChange, loading }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;

  return (
    <div className="flex justify-center items-center space-x-4 mt-12 mb-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage || loading}
        className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-700"
      >
        Previous
      </button>

      <div className="flex space-x-2">
        {/* Simple page numbers for smaller screens */}
        <span className="px-4 py-2 bg-gray-900 text-gray-300 rounded-lg border border-gray-700">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage || loading}
        className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-700"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
