import express from 'express';
import authController from '../app/controllers/authController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refreshToken', authController.requestRefreshToken);
router.post('/logout', authenticateToken, authController.logOut);

export default router;
