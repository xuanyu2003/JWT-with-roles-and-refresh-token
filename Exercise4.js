// Exercise 4: Refresh Tokens & Token Expiry Handling

// Improve security by implementing refresh tokens to extend session validity without requiring frequent logins. Refresh token is given along access token during sign in.

// Key Features:

// · Access tokens have a short expiration time (e.g., 15 minutes).

// · A separate refresh token (longer lifespan) allows users to request a new access token.

// · Logout functionality to invalidate refresh tokens.


const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key';
const REFRESH_SECRET_KEY = 'your_refresh_secret_key';

app.use(bodyParser.json());


// Mock database for posts
const posts = [
    "Early bird catches the worm"
];

// Store refresh tokens
const refreshTokens = new Set();

// Function to generate access(long) and refresh(15mins) tokens
const generateTokens = (user) => {
    const accessToken = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ username: user.username }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
    refreshTokens.add(refreshToken);
    return { accessToken, refreshToken };
};

// Route for signing in and getting tokens
app.post('/signin', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const tokens = generateTokens(user);
        return res.json(tokens);
    }
    res.status(401).json({ message: 'Invalid credentials' });
});

// Route to refresh access token
app.post('/refresh', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken || !refreshTokens.has(refreshToken)) {
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
    
    jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid refresh token' });
        
        const user = users.find(u => u.username === decoded.username);
        if (!user) return res.status(403).json({ message: 'User not found' });
        
        const tokens = generateTokens(user);
        res.json(tokens);
    });
});

// Route to logout (invalidate refresh token)
app.post('/logout', (req, res) => {
    const { refreshToken } = req.body;
    refreshTokens.delete(refreshToken);
    res.json({ message: 'Logged out successfully' });
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(403).json({ message: 'No token provided' });
    
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });
        req.user = decoded;
        next();
    });
};

// Middleware to check admin role
const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

// Protected route available to both users and admins
app.get('/posts', verifyToken, (req, res) => {
    res.json(posts);
});

// Protected route only for admin to add new posts
app.post('/posts', verifyToken, checkAdmin, (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    }
    posts.push(message);
    res.status(201).json({ message: 'Post added successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
