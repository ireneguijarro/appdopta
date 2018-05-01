const express = require('express');
const User = require('../model/user');
const Image = require('../helpers/imagen');
const base64Img = require('base64-img');

let router = express.Router();

router.use((req, res, next) => {
    let token = req.headers['authorization'];
    let response = User.validateToken(token);
    if (response === "Invalid token") {
        response = {
            ok: false,
            errorMessage: 'Access denied'
        };
        res.status(403);
        res.send(response);
    }
    else {
        next();
    }
});

// Actual user
router.get('/me', (req, res) => {
    let token = req.headers['authorization'];
    let userId = User.validateToken(token).id;
    
    User.getUserById(id).then((response) => {
        res.send(response);
    }).catch(error => {
        let response = {
            ok: false,
            errorMessage: error
        };
        res.send(response);
    });
});

module.exports = router;