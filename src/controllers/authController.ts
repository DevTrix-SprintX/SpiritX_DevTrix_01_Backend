// controllers/authController.ts
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import authService from '../services/authService';
import { generateToken } from '../middleware/authMiddleware';

const registerUser = async (req: Request, res: Response) => {
    const { username, password, firstName, lastName } = req.body;
    
    // Validate input fields
    if (!username || !password || !firstName || !lastName) {
        return res.status(400).json({ message: 'All fields are required', status: 400 });
    }

    // Ensure username is at least 8 characters long
    if (username.length < 8) {
        return res.status(400).json({ message: 'Username must be at least 8 characters long', status: 400 });
    }

    // Validate password 
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password must contain at least one lowercase letter, one uppercase letter, and one special character', status: 400 });
    }
    
    try {
        const existingUser = await authService.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists', status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await authService.create({ username, password: hashedPassword, firstName, lastName });
        console.log("New user created:", newUser);

        return res.status(201).json({ message: 'User registered successfully', status: 201 });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Server error', status: 500 });
    }
};

const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    try {
        const user = await authService.findByUsername(username);
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials', status: 401 });
        }
        
        const isPasswordValid = await authService.checkPassword(username, password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials', status: 401 });
        }
        
        // Generate JWT token
        const token = generateToken(user.id, user.username);
        
        // Return token and user info (excluding password)
        const { password: _, ...userWithoutPassword } = user;
        
        return res.status(200).json({
            message: 'Login successful',
            status: 200,
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error', status: 500 });
    }
};

// Create a protected endpoint example
const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        const user = await authService.findById(userId);
        
        if (user === null || user === undefined) {
            return res.status(404).json({ message: 'User not found', status: 404 });
        }
        
        // Return user info without password
        const { password, ...userWithoutPassword } = user as Record<string, any>;
        
        return res.status(200).json({
            status: 200,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ message: 'Server error', status: 500 });
    }
};

export { registerUser, loginUser, getUserProfile };