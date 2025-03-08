import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import authService from '../services/authService';


const registerUser = async (req: Request , res: Response) => {

    const { username, password ,firstName, lastName } = req.body;
    // Validate input fields
    if (!username || !password || !firstName || !lastName) {
        return res.status(400).json({ message: 'All fields are required', status: 400 });
    }

    // Ensure username is at least 8 characters long
    if (username.length < 8) {
        return res.status(400).json({ message: 'username must be at least 8 characters long', status: 400 });
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

        const newUser = authService.create({ username, password: hashedPassword, firstName, lastName });
        console.log("new user created:",newUser);

        return res.status(201).json({ message: 'User registered successfully', status: 201 });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', status: 500 });
    }
};

const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    authService.checkPassword(username, password)
        .then((result) => {
            if (result) {
                return res.status(200).json({ message: 'Login successful', status: 200 });
            } else {
                return res.status(401).json({ message: 'Invalid credentials', status: 401 });
            }
        })
        .catch((error) => {
                console.error('Error while checking password:', error);
                return res.status(500).json({ message: 'Server error', status: 500 });
        });
}

export { registerUser, loginUser };