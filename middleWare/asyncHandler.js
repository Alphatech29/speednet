/**
 * Async error handling middleware wrapper
 * @param {Function} fn  // The async route/controller function
 * @returns {Function}   // A new function that handles the error automatically
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next); 
  };
};

module.exports = asyncHandler;
