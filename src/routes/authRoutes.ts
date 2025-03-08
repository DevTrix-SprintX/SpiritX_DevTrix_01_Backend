import express from 'express';
import { loginUser, registerUser } from '../controllers/authController';

const router = express.Router();

router.post('/login', (req, res) => {
    console.log(`Login attempt with username: ${req.body?.email}`);
    loginUser(req, res);
});

router.post('/register', (req, res) => {
    console.log(`Register attempt with email: ${req.body?.email}`);
    registerUser(req, res);
});

export default router;