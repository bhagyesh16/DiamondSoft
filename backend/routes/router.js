const express = require('express');
const { Users } = require('../dbconfig');
const jwt = require('jsonwebtoken');
const skey = '$bhagyesh@1602';
const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        // Send a 401 Unauthorized response if the token is missing
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, skey, (err, user) => {
        if (err) {
            // Send a 403 Forbidden response if the token is invalid
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

//get all data from database and make api
router.get('/users', async (req, res) => {
    try {
        const users = await Users.findAll();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//insert a new user by api
router.post('/users', async (req, res) => {
    try {
        const { user_id, user_name, user_email, password } = req.body;
        const newuser = await Users.create({ user_id, user_name, user_email, password });
        res.json(newuser);
    } catch (error) {
        console.error('Error adding users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login route - generates JWT and sends it back to the client
router.post('/login', async (req, res) => {
    const { user_email, password } = req.body;

    try {
        const user = await Users.findOne({ where: { user_email, password } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ user_id: user.user_id, user_email: user.user_email }, skey);
        req.session.token = token; // Set token in session
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const getTokenFromSession = (req, res, next) => {
    req.token = req.session.token || null;
    next();
};

module.exports =router;
