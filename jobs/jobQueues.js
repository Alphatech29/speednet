// optimized_job_queue.js
const fs = require("fs/promises");
const path = require("path");

class Job {
  constructor(data, opts = {}) {
    this.id = opts.id || Date.now() + Math.random().toString(36).slice(2);
    this.data = data;
    this.priority = opts.priority || 0;
    this.delayUntil = opts.delayUntil
      ? new Date(opts.delayUntil).getTime()
      : Date.now() + (opts.delay || 0);
    this.tries = 0;
    this.maxTries = opts.retries || 1;
    this.status = "queued";
  }
}

class JobQueue {
  constructor(options = {}) {
    this.queue = [];
    this.processing = 0;
    this.concurrency = options.concurrency || 1;
    this.listeners = { succeeded: [], failed: [] };
    this.workerFn = null;
    this.persistencePath = options.persistencePath || path.join(__dirname, "queue-data.json");
    this.cleanupInterval = options.cleanupInterval || 60000;
    this.jobTTL = options.jobTTL || 5 * 60 * 1000;
    this.maxJobs = options.maxJobs || 1000;
    this._resolvers = new Map();
    this.loadFromFile();
    setInterval(() => this._processNext(), 500);
    setInterval(() => this.cleanup(), this.cleanupInterval);
  }

  add(data, opts = {}) {
    return new Promise((resolve, reject) => {
      if (this.queue.length >= this.maxJobs) {
        return reject(new Error("Queue is full"));
      }
      const job = new Job(data, opts);
      this._resolvers.set(job.id, { resolve, reject });
      this.queue.push(job);
      this._sortQueue();
      this._processNext();
      this.saveToFile();
    });
  }

  _sortQueue() {
    this.queue.sort((a, b) => a.delayUntil - b.delayUntil || b.priority - a.priority);
  }

  async _processNext() {
    if (!this.workerFn || this.processing >= this.concurrency) return;

    const now = Date.now();
    const nextJobIndex = this.queue.findIndex(
      (job) => job.status === "queued" && job.delayUntil <= now
    );
    if (nextJobIndex === -1) return;

    const job = this.queue[nextJobIndex];
    job.status = "processing";
    this.queue.splice(nextJobIndex, 1);
    this.processing++;

    try {
      const result = await this.workerFn(job.data);
      job.status = "completed";
      this.emit("succeeded", job.id, result);
      this._resolvers.get(job.id)?.resolve(result);
    } catch (err) {
      job.tries++;
      if (job.tries < job.maxTries) {
        job.status = "queued";
        job.delayUntil = Date.now() + 1000;
        this.queue.push(job);
        this._sortQueue();
      } else {
        job.status = "failed";
        this.emit("failed", job.id, err);
        this._resolvers.get(job.id)?.reject(err);
      }
    } finally {
      this._resolvers.delete(job.id);
      this.processing--;
      await this.saveToFile();
      this._processNext();
    }
  }

  process(fn) {
    this.workerFn = fn;
    for (let i = 0; i < this.concurrency; i++) {
      this._processNext();
    }
  }

  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  emit(event, ...args) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((fn) => fn(...args));
    }
  }

  async saveToFile() {
    try {
      const data = this.queue.map(({ data, id, priority, delayUntil, tries, maxTries, status }) => ({
        data, id, priority, delayUntil, tries, maxTries, status,
      }));
      const tempPath = this.persistencePath + ".tmp";
      await fs.writeFile(tempPath, JSON.stringify(data, null, 2));
      await fs.rename(tempPath, this.persistencePath);
    } catch (err) {
      console.error(`[Queue] Error saving queue:`, err.message);
    }
  }

  async loadFromFile() {
    try {
      const stat = await fs.stat(this.persistencePath).catch(() => null);
      if (stat && stat.size < 2 * 1024 * 1024) {
        const content = await fs.readFile(this.persistencePath, "utf-8");
        const data = JSON.parse(content);
        this.queue = data.map((obj) => new Job(obj.data, obj));
        this._sortQueue();
      } else {
        this.queue = [];
        console.warn("[Queue] Queue file missing or too large, starting fresh.");
      }
    } catch (err) {
      console.error(`[Queue] Error loading queue:`, err.message);
      this.queue = [];
    }
  }

  cleanup() {
    const now = Date.now();
    const before = this.queue.length;
    this.queue = this.queue
      .filter((job) => !["completed", "failed"].includes(job.status) || now - job.delayUntil < this.jobTTL)
      .slice(-this.maxJobs);
    if (before !== this.queue.length) {
      this.saveToFile();
    }
  }
}

module.exports = JobQueue;
