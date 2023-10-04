import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('connect', () => {
      this.isClientConnected = true;
    }).on('error', (err) => {
      console.log(`Redis client not connected to the server: ${err}`);
      this.isClientConnected = true;
    });
  }

  isAlive() {
    return this.isClientConnected;
  }

  async get(string) {
    return new Promise((resolve, reject) => {
      this.client.get(string, (error, result) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        resolve(result);
        console.log(result);
      });
    });
  }

  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve('OK');
        }
      });
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve('OK');
        }
      });
    });
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
