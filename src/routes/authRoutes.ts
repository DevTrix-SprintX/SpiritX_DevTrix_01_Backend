import express from 'express';
import { loginUser, registerUser, getUserProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Login route
router.post('/login', (req, res) => {
    console.log(`Login attempt with username: ${req.body?.username}`);
    loginUser(req, res);
});

// Register route
router.post('/register', (req, res) => {
    console.log(`Register attempt with username: ${req.body?.username}`);
    registerUser(req, res);
});

// Protected route
router.get('/profile', authenticateToken as express.RequestHandler, (req, res) => {       
    getUserProfile(req, res);
});

export default router;