import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const CustomPagination = ({ totalPages = 1, initialPage = 1, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const maxVisiblePages = 7;

  useEffect(() => {
    if (typeof onPageChange === "function") onPageChange(currentPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, onPageChange]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    let start, end;

    if (totalPages <= maxVisiblePages) {
      start = 1; end = totalPages;
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      if (currentPage <= half + 1) { start = 1; end = maxVisiblePages; }
      else if (currentPage >= totalPages - half) { start = totalPages - maxVisiblePages + 1; end = totalPages; }
      else { start = currentPage - half; end = currentPage + half; }
    }

    if (start > 1) {
      pages.push(
        <button key={1} onClick={() => goToPage(1)}
          className="w-8 h-8 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-primary-600/30 hover:text-primary-600 transition-all">
          1
        </button>
      );
      if (start > 2) pages.push(<span key="e1" className="text-gray-400 dark:text-slate-500 text-sm px-1">···</span>);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button key={i} onClick={() => goToPage(i)}
          className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all ${
            i === currentPage
              ? "bg-primary-600 text-white shadow-md shadow-primary-600/25"
              : "bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-primary-600/30 hover:text-primary-600"
          }`}>
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<span key="e2" className="text-gray-400 dark:text-slate-500 text-sm px-1">···</span>);
      pages.push(
        <button key={totalPages} onClick={() => goToPage(totalPages)}
          className="w-8 h-8 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-primary-600/30 hover:text-primary-600 transition-all">
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-primary-600/30 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <HiChevronLeft size={15} />
      </button>

      <div className="flex items-center gap-1">{renderPageNumbers()}</div>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-primary-600/30 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <HiChevronRight size={15} />
      </button>
    </div>
  );
};

export default CustomPagination;
