"use client";

import { useEffect, useState } from "react";

const CustomPagination = ({ totalPages, initialPage = 1, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    onPageChange(currentPage);
  }, [currentPage, onPageChange]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 rounded-md mx-1 text-sm ${
            i === currentPage
              ? "bg-primary-600 text-white"
              : "bg-gray-600 text-gray-300 hover:bg-gray-500"
          }`}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center mt-4 flex-wrap gap-1 w-full">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md text-sm bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:opacity-50"
      >
        Prev
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md text-sm bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default CustomPagination;
