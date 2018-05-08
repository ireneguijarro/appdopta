const express = require('express');
const Animal = require('../model/animal');
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

// Get all animals
router.get('/', (req, res) => {
    Animal.getAll().then(response => {
        res.send(response);
    }).catch((error) => {
        res.send(error);
    })
});

// Get animal
router.get('/:id', (req, res) => {
    Animal.getById(req.params.id).then(response => {
        res.send(response);
    }).catch(error => {
        res.send(error);
    });
});

// Create animal
router.post('/', (req, res) => {
    let token = req.headers['authorization'];
    let userId = User.validateToken(token).id;

    let animalJSON = req.body;
    req.body.creator_id = userId;

    let animal = new Animal(animalJSON);

    animal.create().then(response => {
        res.send(response);
    }).catch((error) => {
        res.send(error);
    });
});

module.exports = router;