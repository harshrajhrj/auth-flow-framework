require('dotenv').config();
const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let refreshTokens = [];

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken === null) return res.status(401).json({message : 'Unauthorized'});
    if (!refreshTokens.includes(refreshToken)) return res.status(403).json({message : 'Forbidden'});
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({message : 'Forbidden'});
        const accessToken = generateAccessToken({ name: user.name });
        res.json({ accessToken: accessToken });
    })
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    return res.status(204).json({message : 'Success'});
})

app.post('/login', (req, res) => {
    // Authenticate user

    const username = req.body.username;
    const user = { name: username };

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);

    res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
}

app.listen(4000, () => console.log('Listening to Auth server'));