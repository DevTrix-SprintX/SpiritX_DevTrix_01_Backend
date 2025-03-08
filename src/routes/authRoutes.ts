import express from 'express';

const router = express.Router();

router.post('/login', (req, res) => {
    console.log('req.body:', req);
    const { username, password } = req.body;
    res.send(`Username: ${username}, Password: ${password}`);
});

router.post('/register', (req, res) => {
    const { username, password } = req.body.data;
    res.send(`Username: ${username}, Password: ${password}`);
});

export default router;