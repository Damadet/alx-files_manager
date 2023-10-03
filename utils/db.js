const { MongoClient } = require('mongodb');

const HOST = process.env.DB_HOST || 'localhost';
const PORT = process.env.DB_PORT || 27017;
const DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = 'mongodb+srv://admin:Artist582@cluster0.a6ecjrz.mongodb.net/?retryWrites=true&w=majority';
const dbUrl = `mongodb://${HOST}:${PORT}`;
class DBClient {
  constructor() {
    this.client = new MongoClient(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true });
    this.client.connect().then(() => {
      this.db = this.client.db(`${DATABASE}`);
    }).catch((err) => {
      console.log(err);
    });
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const users = this.db.collection('users');
    const userCount = await users.countDocuments();
    return userCount;
  }

  async nbFiles() {
    const files = this.db.collection('files');
    const fileCount = await files.countDocuments();
    return fileCount;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
