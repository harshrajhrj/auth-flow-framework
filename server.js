require('dotenv').config();
const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const users = [
    {
        "name": "Harsh Raj",
        "id": 1,
    },
    {
        "name": "Satyajit Kumar",
        "id": 2
    }
];

app.get('/users', authenticate, (req, res) => {
    res.json(users.filter(user => user.name === req.user.name))
});

function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        if (!user.allowedMethods.includes(req.method)) return res.status(403).json({ error: 'Access denied for this method.' });
        req.user = user.user;
        next();
    });
}

app.listen(3000, () => console.log('Listening to API server'));