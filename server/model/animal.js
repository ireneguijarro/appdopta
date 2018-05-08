const connection = require('./bdconfig');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const secret = 'appdopta';

module.exports = class Animal {

    constructor(animalJSON) {
        this.name = animalJSON.name;
        this.type = animalJSON.type;
        this.breed = animalJSON.breed;
        this.creator_id = animalJSON.creator_id;
        this.photo = animalJSON.photo;
        this.state = animalJSON.state;
        this.sterilized = animalJSON.sterilized;
    }

    create() {
        let response;

        let data = {
            name: this.name,
            type: this.type,
            breed: this.breed,
            creator_id: this.creator_id,
            photo: this.photo,
            state: this.state,
            sterilized: this.sterilized
        }

        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO animal SET ?", data, 
                (error, resultado, campos) => {
                    if (error) {
                        response = {
                            ok: false,
                            errorMessage: 'Error registering animal'
                        };
                        reject(response);
                    }
                    else {
                        response = {
                            ok: true,
                            insertId: resultado.insertId
                        };
                        resolve(response);
                    }
                });
        });
    }

    static getAll() {
        let response;

        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM animal", (error, resultado, campos) => {
                if (error) {
                    response = {
                        ok: false,
                        errorMessage: 'Error getting all animals'
                    };
                    reject(response);
                }
                else {
                    response = {
                        ok: true,
                        animals: resultado[0]
                    };
                    resolve(response);
                }
            });
        });
    }

    static getById(id) {
        let response;

        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM animal WHERE id=" + id,
                (error, resultado, campos) => {
                    if (error) {
                        response = {
                            ok: false,
                            errorMessage: 'Error getting animal ' + id
                        };
                        reject(response);
                    }
                    else {
                        response = {
                            ok: true,
                            animal: resultado[0]
                        };
                        resolve(response);
                    }
            });
        });
    }
}

