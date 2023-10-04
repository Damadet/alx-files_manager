import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static getStatus(request, response) {
    response.status(200).json({ redis: redisClient.isAlive(), db: dbClient.isAlive() });
  }

  static async getStats(request, response) {
    const userCount = await dbClient.nbUsers();
    const fileCount = await dbClient.nbFiles();
    response.status(200).json({ users: userCount, files: fileCount });
  }
}

module.exports = AppController;
