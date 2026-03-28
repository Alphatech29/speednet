import { useEffect, useState, useRef } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const Pagination = ({ totalPages = 1, initialPage = 1, onPageChange }) => {
  const [current, setCurrent] = useState(initialPage);
  const firstRender = useRef(true);
  const MAX = 7;

  useEffect(() => { setCurrent(initialPage); }, [initialPage]);

  useEffect(() => {
    if (typeof onPageChange === "function" && totalPages > 0) onPageChange(current);
    if (!firstRender.current) window.scrollTo({ top: 0, behavior: "smooth" });
    else firstRender.current = false;
  }, [current, onPageChange, totalPages]);

  if (totalPages <= 1) return null;

  const go = (p) => { if (p >= 1 && p <= totalPages) setCurrent(p); };

  const pages = () => {
    let start, end;
    if (totalPages <= MAX) { start = 1; end = totalPages; }
    else {
      const half = Math.floor(MAX / 2);
      if (current <= half + 1)          { start = 1; end = MAX; }
      else if (current >= totalPages - half) { start = totalPages - MAX + 1; end = totalPages; }
      else                               { start = current - half; end = current + half; }
    }

    const items = [];
    if (start > 1) {
      items.push(<Btn key={1} page={1} active={current === 1} onClick={() => go(1)} />);
      if (start > 2) items.push(<span key="e1" className="px-1 text-gray-400 text-sm">…</span>);
    }
    for (let i = start; i <= end; i++)
      items.push(<Btn key={i} page={i} active={current === i} onClick={() => go(i)} />);
    if (end < totalPages) {
      if (end < totalPages - 1) items.push(<span key="e2" className="px-1 text-gray-400 text-sm">…</span>);
      items.push(<Btn key={totalPages} page={totalPages} active={current === totalPages} onClick={() => go(totalPages)} />);
    }
    return items;
  };

  return (
    <div className="flex items-center gap-1 flex-wrap justify-center">
      <button onClick={() => go(current - 1)} disabled={current === 1}
        className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
        <HiChevronLeft size={14} />
      </button>

      <div className="flex items-center gap-1">{pages()}</div>

      <button onClick={() => go(current + 1)} disabled={current === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
        <HiChevronRight size={14} />
      </button>
    </div>
  );
};

const Btn = ({ page, active, onClick }) => (
  <button onClick={onClick}
    className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
      active
        ? "bg-primary-600 text-white shadow-sm shadow-primary-600/25"
        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
    }`}>
    {page}
  </button>
);

export default Pagination;
