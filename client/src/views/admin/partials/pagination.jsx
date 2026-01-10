import { useEffect, useState } from "react";

const Pagination = ({ totalPages, initialPage = 1, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const maxVisiblePages = 10;

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
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      startPage = 1;
      endPage = totalPages;
    } else {
      // Calculate start and end pages based on current position
      const halfVisible = Math.floor(maxVisiblePages / 2);
      
      if (currentPage <= halfVisible + 1) {
        // Near the beginning
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - halfVisible) {
        // Near the end
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        // In the middle
        startPage = currentPage - halfVisible;
        endPage = currentPage + halfVisible;
      }
    }

    // Add ellipsis and page numbers
    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => goToPage(1)}
          aria-label="Go to page 1"
          className="px-3 py-1 rounded-md text-sm font-medium bg-gray-600 text-gray-300 hover:bg-gray-500 transition-colors duration-200 mobile:px-2 mobile:py-[6px] mobile:text-xs"
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

    // Add main page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          aria-label={`Go to page ${i}`}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 
            ${i === currentPage
              ? "bg-teal-600 text-white"
              : "bg-gray-600 text-gray-300 hover:bg-gray-500"}
            mobile:px-2 mobile:py-[6px] mobile:text-xs`}
        >
          {i}
        </button>
      );
    }

    // Add ellipsis and last page if needed
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
          aria-label={`Go to page ${totalPages}`}
          className="px-3 py-1 rounded-md text-sm font-medium bg-gray-600 text-gray-300 hover:bg-gray-500 transition-colors duration-200 mobile:px-2 mobile:py-[6px] mobile:text-xs"
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center mt-4 flex-wrap gap-2 w-full">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        className="px-3 py-1 rounded-md text-sm bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition mobile:px-2 mobile:text-xs"
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
        className="px-3 py-1 rounded-md text-sm bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition mobile:px-2 mobile:text-xs"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;