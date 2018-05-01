const base64Img = require('base64-img');
const https = require('https');
const fs = require('fs')
const express = require('express');

module.exports = class Imagen {
    static saveImage(url) {
        let d = new Date();
        let fileName = d.getTime();
        return new Promise ((resolve, reject) => {
            base64Img.img(url,'public/events' , fileName, function(err, filepath) {
                resolve(filepath.split('/')[2]);
            });
        }).catch(error => {
            console.log('Error guardar imagen: ', error);
        });
    }

    static saveUserImage(url) {
        let d = new Date();
        let fileName = d.getTime();
        return new Promise ((resolve, reject) => {
            base64Img.img(url,'public/profile' , fileName, function(err, filepath) {
                resolve(filepath.split('/')[2]);
            });
        }).catch(error => {
            console.log('Error guardar imagen: ', error);
        });
    }

    static saveGoogleUserImage(url, name) {
        https.request(url)
        .on('response', function(resp) {
            let body = '';
            resp.setEncoding('binary');
            resp.on('data', function (chunk) {
                body += chunk
            }).on('end', function() {
                let nombreArchivo = "public/profile/" + name + "_facebook.png";
                fs.writeFileSync(nombreArchivo, body, 'binary');
                return nombreArchivo;
            });
        })
        .end();
    }
}