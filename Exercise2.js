//Exercise 2

// Create a new express based server, create one endpoint GET /posts into it and use JWT security scheme in your route to protect it.

// The GET /posts should return an array of one line text messages such as “early bird catches the worm”.

// You will need to create another route for sign in which is used to create the JWT.

const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key';

app.use(bodyParser.json());


// Route for signing in and getting a JWT token
app.post('/signin', (req, res) => {
    const { username, password } = req.body;
    if (username === user.username && password === user.password) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    }
    res.status(401).json({ message: 'Invalid credentials' });
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

// Protected route
app.get('/posts', verifyToken, (req, res) => {
    res.json([
        "Early bird catches the worm"
    ]);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
