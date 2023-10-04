import sha1 from 'sha1';
// import { ObjectID } from 'mongodb';
import Queue from 'bull';
import dbClient from '../utils/db';
// import redisClient from '../utils/redis';

const userQueue = new Queue('userQueue', 'redis://127.0.0.1:6379');

class UsersController {
  static async postNew(request, response) {
    const email = request.body ? request.body.email : null;
    const password = request.body ? request.body.password : null;

    if (!email) {
      response.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      response.status(400).json({ error: 'Missing password' });
    }

    const user = await (await dbClient.usersCollection()).findOne({ email });

    if (user) {
      response.status(400).json({ error: 'Already exists' });
      return;
    }
    const insertionInfo = await (await dbClient.usersCollection())
      .insertOne({ email, password: sha1(password) });
    const userId = insertionInfo.insertedId.toString();

    userQueue.add({ userId });
    response.status(201).json({ email, id: userId });
  }

  static async getMe(req, res) {
    const { user } = req;
    res.status(200).json({ email: user.email, id: user._id.toString() });
  }

  // static async getMe(request, response) {
  //   const token = request.header('X-Token');
  //   const key = `auth_${token}`;
  //   const userId = await redisClient.get(key);
  //   if (userId) {
  //     const users = dbClient.db.collection('users');
  //     const idObject = new ObjectID(userId);
  //     users.findOne({ _id: idObject }, (err, user) => {
  //       if (user) {
  //         response.status(200).json({ id: userId, email: user.email });
  //       } else {
  //         response.status(401).json({ error: 'Unauthorized' });
  //       }
  //     });
  //   } else {
  //     console.log('Hupatikani');
  //     response.status(401).json({ error: 'Unauthorized' });
  //   }
  // }
}
module.exports = UsersController;
