"use client";

import { useEffect, useState } from "react";

const CustomPagination = ({ totalPages = 1, initialPage = 1, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    if (typeof onPageChange === "function") {
      onPageChange(currentPage);
    }
  }, [currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    if (totalPages <= 1) return null;

    return Array.from({ length: totalPages }, (_, idx) => {
      const page = idx + 1;

      return (
        <button
          key={page}
          onClick={() => goToPage(page)}
          aria-label={`Go to page ${page}`}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200
            ${page === currentPage
              ? "bg-primary-600 text-white"
              : "bg-gray-600 text-gray-300 hover:bg-gray-500"}
            mobile:px-2 mobile:py-[6px] mobile:text-xs tab:px-2 tab:text-sm
          `}
        >
          {page}
        </button>
      );
    });
  };

  if (totalPages <= 1) return null; 

  return (
    <div className="flex justify-center items-center mt-4 flex-wrap gap-2 w-full">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        className="px-3 py-1 rounded-md text-sm bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:opacity-50 transition 
          mobile:px-2 mobile:text-xs tab:text-sm"
      >
        Prev
      </button>

      <div className="flex flex-wrap justify-center gap-1">
        {renderPageNumbers()}
      </div>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        className="px-3 py-1 rounded-md text-sm bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:opacity-50 transition 
          mobile:px-2 mobile:text-xs tab:text-sm"
      >
        Next
      </button>
    </div>
  );
};

export default CustomPagination;
