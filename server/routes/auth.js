const express = require('express');
const base64Img = require('base64-img');
const https = require('https');
const fs = require('fs');
const User = require('../model/user');
const Image = require('../helpers/imagen');

let router = express.Router();

router.post('/register', (req, res) => {
    let avatar = Image.saveImage(req.body.avatar);
    req.body.avatar = avatar;
    let userJSON = req.body;
    
    let user = new User(userJSON);
    user.register().then((response) => {
        res.send(response);
    }).catch((error) => {
        res.send(error);
    });
});

router.post('/login', (req, res) => {
    let user = req.body;
    User.validateUser(user).then((response) => {
        res.send(response);
    }).catch((error) => {
        res.send(error);
    });
});

router.get('/token', (req, res) => {
    let token = req.headers['authorization'];
    let response = User.validateToken(token);
    if (response === 'Invalid token') {
        response = {
            ok: false
        };
    }
    else {
        response = {
            ok: true
        };
    }
    res.send(response);
});

module.exports = router;