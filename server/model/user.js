const connection = require('./bdconfig');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const secret = 'appdopta';

module.exports = class User 
{

    constructor(userJSON) {
        this.username = userJSON.username;
        this.password = md5(userJSON.password);
        this.email = userJSON.email;
        this.idGoogle = userJSON.idGoogle;
        this.avatar = userJSON.avatar;
        this.lat = userJSON.lat;
        this.lng = userJSON.lng;
    }

    register() {
        let response;

        let data = {
            username: this.username,
            password: this.password,
            email: this.email,
            avatar: this.avatar,
            lat: this.lat,
            lng: this.lng
        };

        return new Promise( (resolve, reject) => {
            connection.query("INSERT INTO user SET ?", data,
            (error, resultado, campos) => {
                if (error) {
                    response = {
                        ok: false,
                        errorMessage: 'Error registering user, ' + error
                    };
                    reject(response);
                }
                else {
                    response = {
                        ok: true,
                        insertId: resultado.insertId
                    }
                    resolve(response);
                }
            });
        }); 
    }

    registerGoogle() {
        let data = {
            username: this.username,
            idGoogle: this.idGoogle,
            email: this.email,
            avatar: this.avatar,
            lat: this.lat,
            lng: this.lng
        };

        let querySelect = "SELECT * FROM user WHERE id_google = '" + data.idGoogle + "';";
        let googleResponse;

        return new Promise((resolve, reject) => {
            connection.query(querySelect, (error, resultado, campos) => {
                if (error) {
                    googleResponse = {
                        error: true,
                        token: false
                    };
                    reject(googleResponse);
                }
                if (resultado.length === 0) {
                    // User is not on database
                    return new Promise ((resolve, reject) => {
                        connection.query("INSERT INTO user SET ?", data,
                         (erorr, resultado, campos) => {
                            let token = this.generateToken(data.email, data.idGoogle);
                            googleResponse = {
                                error: false,
                                token: token
                            };
                            resolve(googleResponse);
                        })
                    })
                }
            });
        });

    }

    static validateUser(user) {
        let response;
        let encryptedPassword = md5(user.password);
        let query = "SELECT * FROM user WHERE email = '" + user.email + "' AND password = '" + encryptedPassword + "';";

        return new Promise((resolve, reject) => {
            connection.query(query, (error, resultado, campos) => {
                if (error) {
                    response = {
                        ok: false,
                        errorMessage: 'Error validating user, ' + error
                    }
                    reject(response);
                }
                else {
                    if (resultado.length == 1) {
                        let email = resultado[0].email;
                        let id = resultado[0].id;
                        return new Promise((resolve, reject) => {
                            connection.query("UPDATE user SET lat=" + user.lat + " , lng=" + user.lng + " WHERE email='"+ user.email + "';"),
                                (error, resultado, campos) => {
                                if (error) {
                                    response = {
                                        ok: false,
                                        errorMessage: 'Error updating location, ' + error
                                    };
                                    reject(response);
                                }
                                else {
                                    response = {
                                        ok: true,
                                        token: this.generateToken(user.email, id)
                                    };
                                    resolve(response);
                                }
                            }
                        }).catch((error) => {
                            console.log(error);
                        })
                    }
                    else {
                        response = {
                            ok: false,
                            errorMessage: 'User is not registered'
                        };
                        reject(response);
                    }
                }
            })
        }).catch((error) => {
            reject(error);
        })
    }

    static updateLocation(email, newLat, newLng) {
        let response;
        return new Promise((resolve, reject) => {
            connection.query("UPDATE user SET lat=" + newLat + " , lng=" + newLng + " WHERE email='"+ email + "';"),
                (error, resultado, campos) => {
                    if (error) {
                        response = {
                            ok: false,
                            errorMessage: 'Error updating location, ' + error
                        };
                        reject(response);
                    }

                    else {
                        response = {
                            ok: true,
                            newLat: newLat,
                            newLng: newLng
                        };
                        resolve(response);
                    }
                }
        });
    }

    static getUserById(id) {
        let response;
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM user WHERE id=" + id + ";",
                (error, resultado, campos) => {
                    if (error)  {
                        response = {
                            ok: false,
                            errorMessage: 'Error finding user, ' + error
                        };
                        return reject(response);
                    }
                    else {
                        response = {
                            ok: true,
                            user: resultado[0]
                        };
                        resolve(response);
                    }
                });
        });
    }

    static updateMe(name, email, userId) {
        let response;

        return new Promise ((resolve, reject) => {
            let data = {name: name, email: email};
            connection.query("UPDATE user SET ? WHERE id=" + userId + ";", data, 
                (error, resultado, campos) => {
                    if (error) {
                        response = {
                            ok: false,
                            errorMessage: 'Error updating user data, error' + error
                        };
                        return reject(response);
                    }
                    else {
                        response =  {
                            ok: true,
                            userId: userId
                        }
                        resolve(response);
                    }
                });
            });
    }

    static updateAvatar(image, userId) {
        let response;

        return new Promise ((resolve, reject) => {
            let data = {avatar: image};
            connection.query("UPDATE user SET ? WHERE id=" + userId + ";", data, 
                (error, resultado, campos) => {
                    if (error) {
                        response = {
                            ok: false,
                            errorMessage: 'Error updating avatar, ' + error
                        };
                        return reject(response);
                    }
                    else {
                        response = {
                            ok: true,
                            user: userId
                        };
                        resolve(response);
                    }
                });
            });
    }

    static generateToken(login, id) {
        let token = jwt.sign({login: login, id: id}, secret, {expiresIn:"12 hours"});
        return token;
    }

    static validateToken(token) {
        try {
            token = token.replace("Bearer ", "");
            let result = jwt.verify(token, secret);
            return result;
        } catch (e) {
            return "Invalid token";
        }
    }
}