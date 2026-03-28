import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getPageBySlug } from "../../../components/backendApis/admin/apis/page";
import {
  HiArrowLeft,
  HiDocumentText,
  HiCalendar,
  HiExclamationCircle,
} from "react-icons/hi";

/* ── Skeleton loader ── */
const Skeleton = ({ className }) => (
  <div
    className={`animate-pulse bg-gray-200 dark:bg-slate-700 rounded-xl ${className}`}
  />
);

const PageSkeleton = () => (
  <div className="space-y-6">
    {/* hero skeleton */}
    <div className="rounded-3xl bg-gray-100 dark:bg-slate-800 p-8 space-y-4">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-3 w-48" />
    </div>
    {/* content skeleton */}
    <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 space-y-3 border border-gray-100 dark:border-white/5">
      {[100, 92, 96, 80, 88, 70, 95, 60].map((w, i) => (
        <Skeleton key={i} className={`h-3`} style={{ width: `${w}%` }} />
      ))}
      <div className="pt-4" />
      {[90, 85, 75, 88].map((w, i) => (
        <Skeleton key={i} className={`h-3`} style={{ width: `${w}%` }} />
      ))}
    </div>
  </div>
);

/* ── Not-found state ── */
const NotFound = ({ navigate }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-24 text-center"
  >
    <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-6">
      <HiExclamationCircle size={36} className="text-red-400 dark:text-red-500" />
    </div>
    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
      Page Not Found
    </h2>
    <p className="text-sm text-gray-500 dark:text-slate-400 mb-8 max-w-xs">
      The page you're looking for doesn't exist or may have been removed.
    </p>
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-2xl shadow-md shadow-primary-600/25 transition-all"
    >
      <HiArrowLeft size={15} /> Go Back
    </button>
  </motion.div>
);

/* ── Converts plain text to safe HTML ── */
const formatContent = (text) => {
  if (!text) return "";
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\n\n+/g, "</p><p>").replace(/\n/g, "<br/>");
};

/* ── Detect if content is already HTML ── */
const isHTML = (str) => /<\/?[a-z][\s\S]*>/i.test(str);

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.08, ease: "easeOut" },
  }),
};

const Page = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setPageData(null);

    const fetchPage = async () => {
      try {
        const res = await getPageBySlug(slug);
        if (res.success && res.data?.title) {
          setPageData(res.data);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  /* formatted date */
  const formattedDate = pageData?.created_at
    ? new Date(pageData.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  /* rendered content */
  const renderedContent = pageData?.content
    ? isHTML(pageData.content)
      ? pageData.content
      : `<p>${formatContent(pageData.content)}</p>`
    : "";

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pc:py-10">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-500 transition-colors group"
      >
        <span className="w-7 h-7 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary-600/10 transition-colors">
          <HiArrowLeft size={13} className="group-hover:text-primary-600 transition-colors" />
        </span>
        Back
      </motion.button>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PageSkeleton />
          </motion.div>
        )}

        {!loading && notFound && (
          <motion.div key="notfound" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <NotFound navigate={navigate} />
          </motion.div>
        )}

        {!loading && pageData && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            {/* Hero header */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-orange-500 p-7 pc:p-10"
            >
              {/* decorative circles */}
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute -bottom-12 -left-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

              {/* breadcrumb */}
              <div className="relative flex items-center gap-2 mb-4">
                <span className="flex items-center gap-1.5 text-xs font-bold text-white/60 uppercase tracking-widest">
                  <HiDocumentText size={12} />
                  Pages
                </span>
                <span className="text-white/40 text-xs">/</span>
                <span className="text-xs font-bold text-white/80 uppercase tracking-widest truncate max-w-[180px]">
                  {slug}
                </span>
              </div>

              {/* title */}
              <h1 className="relative text-2xl pc:text-3xl tab:text-2xl font-extrabold text-white leading-tight mb-4">
                {pageData.title}
              </h1>

              {/* meta row */}
              {formattedDate && (
                <div className="relative flex items-center gap-2 text-xs text-white/70">
                  <HiCalendar size={13} />
                  <span>Published {formattedDate}</span>
                </div>
              )}
            </motion.div>

            {/* Content card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-3xl p-7 pc:p-10 shadow-sm"
            >
              <div
                className="
                  prose prose-sm pc:prose-base max-w-none
                  prose-headings:font-extrabold prose-headings:text-gray-900 dark:prose-headings:text-white
                  prose-p:text-gray-600 dark:prose-p:text-slate-300
                  prose-p:leading-relaxed
                  prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-800 dark:prose-strong:text-white
                  prose-ul:text-gray-600 dark:prose-ul:text-slate-300
                  prose-ol:text-gray-600 dark:prose-ol:text-slate-300
                  prose-li:marker:text-primary-600
                  prose-blockquote:border-primary-600 prose-blockquote:bg-primary-600/5
                  prose-blockquote:rounded-r-xl prose-blockquote:py-1
                  prose-code:text-primary-600 prose-code:bg-primary-600/8
                  prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
                  prose-hr:border-gray-100 dark:prose-hr:border-white/5
                "
                dangerouslySetInnerHTML={{ __html: renderedContent }}
              />
            </motion.div>

            {/* Footer strip */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/5 rounded-2xl"
            >
              <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-slate-500">
                <HiDocumentText size={13} />
                <span>{pageData.title}</span>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
              >
                <HiArrowLeft size={12} /> Back
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;
