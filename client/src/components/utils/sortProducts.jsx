
export const sortProducts = (() => {
  let lastOrder = "newest";
  let lastOrderChange = null;
  let intervalId = null;

  const sort = (products, isRefresh = false, intervalMs = 3000, callback) => {
    const now = Date.now();

    // If this is a refresh, reset the order to newest
    if (isRefresh) {
      lastOrder = "newest";
      lastOrderChange = now;
    } else {
      if (!lastOrderChange) lastOrderChange = now;

      // Toggle order if interval has passed
      if (now - lastOrderChange >= intervalMs) {
        lastOrder = lastOrder === "newest" ? "oldest" : "newest";
        lastOrderChange = now;
      }
    }

    // Sort products
    const sorted = [...products].sort((a, b) => {
      const dateA = new Date(a.create_at);
      const dateB = new Date(b.create_at);

      // Handle invalid dates gracefully
      if (isNaN(dateA) || isNaN(dateB)) {
        return a.title.localeCompare(b.title);
      }

      if (lastOrder === "newest") {
        return dateB - dateA || a.title.localeCompare(b.title);
      } else {
        return dateA - dateB || a.title.localeCompare(b.title);
      }
    });

    // Auto-sort interval
    if (!intervalId && callback) {
      intervalId = setInterval(() => {
        sort(products, false, intervalMs, callback);
      }, intervalMs);
    }

    if (callback) callback(sorted);

    return sorted;
  };

  // Return only the sort function
  return sort;
})();
