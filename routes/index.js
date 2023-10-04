import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const express = require('express');

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('users', UsersController.postNew);
// router.get('/connect', AuthController.getConnect)
// router.get('/connect', AuthController.getDisconnect)
// router.get('/users/me', UserController.getMe)

module.exports = router;
