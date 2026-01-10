"use client";

import { useEffect, useState } from "react";

const CustomPagination = ({
  totalPages = 1,
  initialPage = 1,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const maxVisiblePages = 10;

  useEffect(() => {
    if (typeof onPageChange === "function") {
      onPageChange(currentPage);
    }
  }, [currentPage, onPageChange]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);

      if (currentPage <= halfVisible + 1) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - halfVisible) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - halfVisible;
        endPage = currentPage + halfVisible;
      }
    }

    // First page + ellipsis
    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => goToPage(1)}
          className="px-3 py-1 rounded-md text-sm font-medium bg-gray-600 text-gray-300 hover:bg-gray-500 transition
            mobile:px-2 mobile:py-[6px] mobile:text-xs tab:px-2 tab:text-sm"
        >
          1
        </button>
      );

      if (startPage > 2) {
        pageNumbers.push(
          <span key="ellipsis-start" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    // Main pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition
            ${
              i === currentPage
                ? "bg-primary-600 text-white"
                : "bg-gray-600 text-gray-300 hover:bg-gray-500"
            }
            mobile:px-2 mobile:py-[6px] mobile:text-xs tab:px-2 tab:text-sm`}
        >
          {i}
        </button>
      );
    }

    // Ellipsis + last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="ellipsis-end" className="px-2 text-gray-500">
            ...
          </span>
        );
      }

      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className="px-3 py-1 rounded-md text-sm font-medium bg-gray-600 text-gray-300 hover:bg-gray-500 transition
            mobile:px-2 mobile:py-[6px] mobile:text-xs tab:px-2 tab:text-sm"
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-4 flex-wrap gap-2 w-full">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
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
        className="px-3 py-1 rounded-md text-sm bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:opacity-50 transition
          mobile:px-2 mobile:text-xs tab:text-sm"
      >
        Next
      </button>
    </div>
  );
};

export default CustomPagination;
