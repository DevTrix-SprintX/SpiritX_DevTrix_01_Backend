import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import authService from '../services/authService';

const validateUserRegistration = [
    body('username').isString().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('firstName').isString().isLength({ min: 3 }).withMessage('First Name must be at least 3 characters long'),
    body('lastName').isString().isLength({ min: 3 }).withMessage('Last Name must be at least 3 characters long')
];

const registerUser = async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password ,firstName, lastName } = req.body;

    try {
        const existingUser = await authService.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists', status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = authService.create({ email, password: hashedPassword, firstName, lastName });
        console.log("new user created:",newUser);

        res.status(201).json({ message: 'User registered successfully', status: 201 });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 500 });
    }
};

const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    authService.checkPassword(email, password)
        .then((result) => {
            if (result) {
                res.status(200).json({ message: 'Login successful', status: 200 });
            } else {
                res.status(401).json({ message: 'Invalid credentials', status: 401 });
            }
        })
        .catch((error) => {
                console.error('Error while checking password:', error);
                res.status(500).json({ message: 'Server error', status: 500 });
        });
}

export { validateUserRegistration, registerUser, loginUser };