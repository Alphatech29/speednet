let lastOrder = "newest";
let autoStartTime = null;

export const sortProducts = (products, isRefresh = false, intervalMs = 3600000) => {
  const now = Date.now();
  if (isRefresh) {
    lastOrder = "newest";
    autoStartTime = now;
  } else {
    if (autoStartTime && now - autoStartTime >= intervalMs) {
      lastOrder = lastOrder === "newest" ? "oldest" : "newest";
      autoStartTime = now;
    }
  }

  return [...products].sort((a, b) => {
    const dateA = new Date(a.create_at);
    const dateB = new Date(b.create_at);

    if (lastOrder === "newest") {
      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;
    } else {
      if (dateA > dateB) return 1;
      if (dateA < dateB) return -1;
    }

    return a.title.localeCompare(b.title);
  });
};
