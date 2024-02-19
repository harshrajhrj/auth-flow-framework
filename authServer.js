require('./db')();
require('dotenv').config();
const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const Refresh = require('./jwt-models/Refresh');

// const IP = require('ip');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// let refreshTokens = [];

app.post('/token', async (req, res) => {
    const refreshToken = req.body.token;

    // check if the refreshToken provided or not
    if (refreshToken === null) return res.status(401).json({ message: 'Unauthorized' });

    // check the refreshToken provided is genuine or not
    const tokenCheck = await Refresh.findOne({ token: refreshToken });
    if (!tokenCheck) return res.status(403).json({ message: 'Forbidden' });
    // if (!refreshTokens.includes(refreshToken)) return res.status(403).json({ message: 'Forbidden' });

    // assign a new access token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        const accessToken = generateAccessToken({ name: user.name });
        res.json({ accessToken: accessToken });
    })
})

app.delete('/logout', async (req, res) => {
    const refreshToken = req.body.token;
    await Refresh.findOneAndDelete({ token: refreshToken });
    // refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    return res.status(204).json({ message: 'Success' });
})

app.post('/login', async (req, res) => {

    // check IP and authenticate right client and backend server
    // const ipAddress = req.header('x-forwarded-for') || req.socket.remoteAddress;
    // console.log(IP.address());

    // Authenticate user
    const username = req.body.username;
    const user = { name: username };

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

async function generateAccessToken(user) {
    const accessToken = jwt.sign({ user, allowedMethods: ['GET'] }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
    return accessToken;
}

async function generateRefreshToken(user) {
    const refreshToken = jwt.sign({ user, allowedMethods: ['GET'] }, process.env.REFRESH_TOKEN_SECRET);

    // save refresh token to database
    // refreshTokens.push(refreshToken);
    const RefreshToken = new Refresh({
        token: refreshToken
    })
    await RefreshToken.save();
    return refreshToken;
}

app.listen(4000, () => console.log('Listening to Auth server'));