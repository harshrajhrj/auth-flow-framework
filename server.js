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
        "name": "Shaswika",
        "id": 2
    }
];

app.get('/users', authenticate, (req, res) => {
    res.json(users.filter(user => user.name === req.user.name))
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = { name: username };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken });
});

function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) res.status(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) res.status(403);
        req.user = user;
        next();
    });
}

app.listen(3000, () => console.log('Listening to Auth flow framework'));