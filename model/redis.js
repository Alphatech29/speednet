// model/redis.js
const { createClient } = require('redis');

const client = createClient({
  username: 'default',
  password: 'dEU9iT4dRjRQLQHENM6wcVXfhWJspaqh',
  socket: {
    host: 'redis-18457.c14.us-east-1-2.ec2.cloud.redislabs.com',
    port: 18457
  }
});

client.on('error', (err) => console.log('Redis Client Error', err));

async function connectRedis() {
  try {
    await client.connect();
    console.log('Redis connected');
  } catch (err) {
    console.error('Redis connection failed:', err.message);
  }
}

// Call it immediately
connectRedis();

async function safeGet(key) {
  try {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.warn('Redis get failed:', err.message);
    return null;
  }
}

async function safeSet(key, value, ttlSeconds = 3600) {
  try {
    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (err) {
    console.warn('Redis set failed:', err.message);
  }
}

module.exports = { client, safeGet, safeSet };
