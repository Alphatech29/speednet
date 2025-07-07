const fs = require('fs');
const path = require('path');

class Job {
  constructor(data, opts = {}) {
    this.id = opts.id || Date.now() + Math.random().toString(36).slice(2);
    this.data = data;
    this.priority = opts.priority || 0;
    this.delayUntil = Date.now() + (opts.delay || 0);
    this.tries = 0;
    this.maxTries = opts.retries || 1;
    this.status = 'queued'; // queued, delayed, processing, completed, failed
  }
}

class JobQueue {
  constructor(options = {}) {
    this.queue = [];
    this.processing = 0;
    this.concurrency = options.concurrency || 1;
    this.listeners = {
      succeeded: [],
      failed: [],
    };
    this.workerFn = null;

    this.persistencePath = options.persistencePath || path.join(__dirname, 'queue-data.json');
    this.tempPath = this.persistencePath + '.tmp';
    this.cleanupInterval = options.cleanupInterval || 60000;
    this.jobTTL = options.jobTTL || 5 * 60 * 1000;
    this.maxJobs = options.maxJobs || 1000;

    this.loadFromFile();
    setInterval(() => this._processNext(), 500);
    setInterval(() => this.cleanup(), this.cleanupInterval);
  }

  add(data, opts = {}) {
    return new Promise((resolve, reject) => {
      const job = new Job(data, opts);
      job._resolve = resolve;
      job._reject = reject;
      this.queue.push(job);
      this._sortQueue();
      this._processNext();
      this.saveToFile();
    });
  }

  _sortQueue() {
    this.queue.sort((a, b) => {
      if (a.delayUntil !== b.delayUntil) return a.delayUntil - b.delayUntil;
      return b.priority - a.priority;
    });
  }

  _processNext() {
    if (!this.workerFn || this.processing >= this.concurrency) return;

    const now = Date.now();
    const nextJobIndex = this.queue.findIndex(
      job => job.status === 'queued' && job.delayUntil <= now
    );
    if (nextJobIndex === -1) return;

    const job = this.queue[nextJobIndex];
    job.status = 'processing';
    this.queue.splice(nextJobIndex, 1);
    this.processing++;

    const execute = async () => {
      try {
        const result = await this.workerFn(job.data);
        job.status = 'completed';
        this.emit('succeeded', job.id, result);
        job._resolve?.(result);
      } catch (err) {
        job.tries++;
        if (job.tries < job.maxTries) {
          job.status = 'queued';
          job.delayUntil = Date.now() + 1000;
          this.queue.push(job);
          this._sortQueue();
        } else {
          job.status = 'failed';
          this.emit('failed', job.id, err);
          job._reject?.(err);
        }
      } finally {
        this.processing--;
        this.saveToFile();
        this._processNext();
      }
    };

    execute();
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
      this.listeners[event].forEach(fn => fn(...args));
    }
  }

  saveToFile() {
    try {
      const data = this.queue.map(({ _resolve, _reject, ...rest }) => rest);
      fs.writeFileSync(this.tempPath, JSON.stringify(data, null, 2));
      fs.renameSync(this.tempPath, this.persistencePath); // atomic write
    } catch (err) {
      console.error('Error saving queue:', err.message);
    }
  }

  loadFromFile() {
    try {
      if (fs.existsSync(this.persistencePath)) {
        const data = JSON.parse(fs.readFileSync(this.persistencePath));
        this.queue = data.map(obj => new Job(obj.data, obj));
        this._sortQueue();
      }
    } catch (err) {
      console.error('Error loading queue:', err.message);
      this.queue = [];
    }
  }

  cleanup() {
    const now = Date.now();
    const before = this.queue.length;
    this.queue = this.queue.filter(job => {
      if (['completed', 'failed'].includes(job.status)) {
        return now - job.delayUntil < this.jobTTL;
      }
      return true;
    }).slice(-this.maxJobs);

    if (before !== this.queue.length) this.saveToFile();
  }
}

module.exports = JobQueue;
