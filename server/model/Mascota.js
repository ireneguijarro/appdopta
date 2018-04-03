const conexion = require('./bdconfig');
const express = require('express');

module.exports = class Mascota {

    constructor(mascotaJSON) {
        this.nombre = mascotaJSON.nombre;
        this.tipo = mascotaJSON.tipo; // Perro o gato
        this.fechaNacimiento = mascotaJSON.fechaNacimiento.toLocaleString('es-ES');
        this.genero = mascotaJSON.genero;
        this.raza = mascotaJSON.raza;
        this.size = mascotaJSON.size;
        this.protectora = mascotaJSON.protectora;
        this.tasaAdopcion = mascotaJSON.tasaAdopcion; // trámites, puede ser 0
        this.foto = mascotaJSON.foto;
        this.estado = mascotaJSON.estado; // EN ADOPCIÓN, RESERVADO, ADOPTADO
        this.lat = mascotaJSON.lat;
        this.lng = mascotaJSON.lng;
        this.direccion = mascotaJSON.direccion;
    }

    static listarMascotas() {
        return new Promise ((resolve, reject) => {
            conexion.query("SELECT * FROM mascota;", error, resultado, campos => {
                if (error)
                    return reject(error);
                else
                    resolve(resultado);
            });
        });
    }

    crear() {
        return new Promise((resolve, reject) => {
            let datos = {
                nombre: this.nombre,
                tipo: this.tipo,
                fechaNacimiento: this.fechaNacimiento,
                genero: this.genero,
                raza: this.raza,
                size: this.size,
                protectora: this.protectora,
                tasaAdopcion: this.tasaAdopcion,
                foto: this.foto,
                estado: this.estado,
                lat: this.lat,
                lng = this.lng,
                direccion: this.direccion
            };

            conexion.query("INSERT INTO mascota SET ?", datos,
                (error, resultado, campos) => {
                    if (error)
                        return reject(error);
                    else
                        resolve(resultado);
                });
        });
    }

    update() {
        return new Promise((resolve, reject) => {
            let datos = {
                nombre: this.nombre,
                tipo: this.tipo,
                fechaNacimiento: this.fechaNacimiento,
                genero: this.genero,
                raza: this.raza,
                size: this.size,
                protectora: this.protectora,
                tasaAdopcion: this.tasaAdopcion,
                foto: this.foto,
                estado: this.estado,
                lat: this.lat,
                lng = this.lng,
                direccion: this.direccion
            };

            conexion.query("UPDATE mascota SET ? WHERE id=" + this.id + ";", datos,
                (error, resultado, campos) => {
                    if (error)
                        return reject(error);
                    else
                        resolve(resultado);
                });
        });
    }

    static delete(mascotaId, protectoraId) {
        return new Promise((resolve, reject) => {
            conexion.query("DELETE FROM mascota WHERE id=" + mascotaId + " AND protectora=" + protectoraId + ";",
                (error, resultado, campos) => {
                    if (error)
                        return reject(error)
                    else {
                        if (resultado.affectedRows === 0) {
                            resolve({ok: false, errorMessage: 'La protectora no es el creador, operación denegada'});
                        }
                        else {
                            resolve({ok: true, affectedRows: resultado.affectedRows});
                        }
                    }
                });
        });
    }

    getDistance(user) {
        return new Promise ((resolve, reject) => {
            conexion.query(" SELECT `haversine`(" + user.lat + ", " + user.lng + ", " + this.lat + ", " + this.lng + ")AS `haversine`;"
            , (error, resultado, campos) => {
                if (error)
                    return reject(error);
                else {
                    resolve(resultado[0]);
                }
            });
        });
    }


}