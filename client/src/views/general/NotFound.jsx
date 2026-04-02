import { motion } from "framer-motion";
import PageSeo from "../../components/utils/PageSeo";
import { NavLink, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { HiHome } from "react-icons/hi";
import { MdOutlineSupportAgent } from "react-icons/md";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-pay flex items-center justify-center px-5 relative overflow-hidden">
      <PageSeo
        title="404 — Page Not Found"
        description="The page you're looking for doesn't exist. Head back to the Speednet homepage."
        keywords="404, page not found, speednet"
        path="/404"
      />
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-600/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-[7rem] tab:text-[10rem] font-extrabold leading-none text-primary-600/15 select-none">
            404
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="-mt-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary-600/10 border border-primary-600/20 flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl">🔍</span>
          </div>

          <h1 className="text-2xl tab:text-3xl font-extrabold text-gray-900 mb-3">
            Page not found
          </h1>
          <p className="text-gray-500 text-sm tab:text-base leading-relaxed mb-8">
            The page you're looking for doesn't exist or may have been moved.
            Double-check the URL or head back home.
          </p>

          {/* Actions */}
          <div className="flex flex-col tab:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-primary-600 text-gray-700 hover:text-primary-600 font-semibold px-6 py-3 rounded-xl transition-all duration-200 text-sm"
            >
              <FaArrowLeft size={12} />
              Go Back
            </button>

            <NavLink to="/">
              <button className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-orange-200/50 text-sm w-full tab:w-auto">
                <HiHome size={16} />
                Back to Home
              </button>
            </NavLink>

            <NavLink to="/contact">
              <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-primary-600/30 text-gray-700 hover:text-primary-600 font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-sm text-sm w-full tab:w-auto">
                <MdOutlineSupportAgent size={17} />
                Get Support
                <FaArrowRight size={11} />
              </button>
            </NavLink>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
