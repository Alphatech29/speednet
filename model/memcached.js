const Memcached = require("memcached");

// Connect to local Memcached on port 8000
const memcached = new Memcached("127.0.0.1:8000", {
  retries: 5,
  retry: 1000,
  remove: true,
  maxKeySize: 250,
  maxExpiration: 2592000, // 30 days
  maxValue: 1073741824    // ~1GB per value
});

/**
 * Get value from cache
 */
function safeGet(key) {
  return new Promise((resolve, reject) => {
    memcached.get(key, (err, data) => {
      if (err) return reject(err);
      resolve(data ?? null);
    });
  });
}

/**
 * Set value with TTL (seconds)
 */
function safeSet(key, value, ttl = 3600) {
  return new Promise((resolve, reject) => {
    memcached.set(key, value, ttl, err => {
      if (err) return reject(err);
      resolve(true);
    });
  });
}

/**
 * Acquire lock (SETNX-style)
 */
function acquireLock(key, ttl = 60) {
  return new Promise(resolve => {
    memcached.add(key, "locked", ttl, err => {
      resolve(!err);
    });
  });
}

/**
 * Release lock
 */
function releaseLock(key) {
  return new Promise(resolve => {
    memcached.del(key, () => resolve());
  });
}

/**
 * Delete cache key
 */
function safeDelete(key) {
  return new Promise((resolve, reject) => {
    memcached.del(key, err => {
      if (err) return reject(err);
      resolve(true);
    });
  });
}

module.exports = {
  safeGet,
  safeSet,
  acquireLock,
  releaseLock,
  safeDelete,
};
