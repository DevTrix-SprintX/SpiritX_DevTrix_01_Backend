import express from 'express';

const router = express.Router();

router.get('/login', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send({msg:'Login Page', status: 200});
});

export default router;