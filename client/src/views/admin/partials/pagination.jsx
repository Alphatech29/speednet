import { useEffect, useState } from "react";

const Pagination = ({ totalPages, initialPage = 1, onPageChange }) => {
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
          aria-label={`Go to page ${i}`}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 
            ${i === currentPage
              ? "bg-teal-600 text-white"
              : "bg-gray-600 text-gray-300 hover:bg-gray-500"}
            mobile:px-2 mobile:py-[6px] mobile:text-xs tab:px-2 tab:text-sm`}
        >
          {i}
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

export default Pagination;