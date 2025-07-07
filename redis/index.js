const JobQueue = require('./JobQueue');

const queue = new JobQueue({ concurrency: 2 });

// Define job processor
queue.process(async (data) => {
  console.log('Processing:', data);
  await new Promise(res => setTimeout(res, 1000));
  if (data.fail) throw new Error('Intentional fail');
  return `✅ ${data.task} complete`;
});

// Event listeners
queue.on('succeeded', (id, result) => {
  console.log(`SUCCESS [${id}]: ${result}`);
});
queue.on('failed', (id, err) => {
  console.log(`FAILED [${id}]: ${err.message}`);
});

// Add some jobs
queue.add({ task: 'send-email' }, { priority: 3 });
queue.add({ task: 'update-stats', fail: true }, { retries: 2, priority: 5 });
queue.add({ task: 'cleanup-temp-files' }, { delay: 5000, priority: 1 });
