'use strict';

// Required libraries
const ftp = require('promise-ftp');
const Connection = require('../Connection');
const path = require('path');

class FTPConnection extends Connection {
    constructor(bucketURL) {
        super(bucketURL);
        // The ftp library uses 'user' instead of 'username'
        this.settings.user = this.settings.username;
        this.settings.autoReconnect = true;
    }

    connect() {
        this.client = new ftp();
        return this.client.connect(this.settings);
    }

    disconnect() {
        return this.client.end();
    }

    saveStream(stream, id) {
        let idPath = this.getPath(id);
        return this._makeDirectory(idPath)
            .then(() => {
                return this.client.put(stream, idPath);
            })
            .then(() => {
                return Promise.resolve({'id': id});
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }

    getStream(id) {
        return this.client.get(this.getPath(id))
            .then((stream) => {
                let file = {};
                file.id = id;
                file.stream = stream;
                return Promise.resolve(file);
            })
            .catch((err) => {
                if (err.code === 550) {
                    return this.fileNotFound();
                } else {
                    return Promise.reject(err);
                }
            });
    }

    remove(id) {
        return this.client.delete(this.getPath(id))
            .then(() => {
                return Promise.resolve({'id': id});
            })
            .catch((err) => {
                if (err.code === 550) {
                    return this.fileNotFound();
                } else {
                    return Promise.reject(err);
                }
            });
    }

    _makeDirectory(idPath) {
        let dir = path.dirname(idPath);
        if (path.dirname(dir) != dir) {
            return this.client.mkdir(dir, true);
        } else {
            return Promise.resolve();
        }
    }

}

module.exports = FTPConnection;