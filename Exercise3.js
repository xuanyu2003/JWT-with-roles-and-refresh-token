// Exercise 3: Role-Based Access Control (RBAC) with JWT

// Enhance the basic JWT authentication by assigning two roles (e.g., admin, user).

// The GET /posts should be available to both user groups.

// Create a new endpoint POST /posts, which is used to add new one line text messages to the service. Only “admin” user should be allowed access.

// Key Features:

// · Users receive a role upon login.

// · Middleware checks JWT and verifies if the user has the required role.

const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key';

app.use(bodyParser.json());


const posts = [
    "Early bird catches the worm"
];

// Route for signing in and getting a JWT token (with role)
app.post('/signin', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    }
    res.status(401).json({ message: 'Invalid credentials' });
});

// Middleware to verify JWT(same with exercise 2)
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
