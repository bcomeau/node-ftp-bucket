'use strict';

// Required libraries
const Client = require('ssh2-sftp-client');
const Connection = require('../Connection');
const path = require('path');

class SFTPConnection extends Connection {
    constructor(bucketURL) {
        super(bucketURL);
        this.settings.readyTimeout = 40000;
    }

    connect() {
        this.client = new Client();
        this.client.on('close', this._setDisconnected);
        this.client.on('end', this._setDisconnected);
        this.client.on('error', this._setDisconnected);
        this.client.on('ready', this._setConnected);
        return this.client.connect(this.settings)
            .then(()=>{
                this.connected = true;
                return Promise.resolve();
            });
    }

    _setConnected() {
        this.connected = true;
    }

    _setDisconnected() {
        this.connected = false;
    }

    disconnect() {
        this.connected = false;
        return this.client.end();
    }

    isConnected() {
        // TODO Check status instead of always creating a new connection
        return Promise.resolve(this.connected);
    }

    saveStream(stream, id) {
        let idPath = this.getPath(id);
        return this.client.put(stream, idPath)
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
                if (err.message = 'No such file') {
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
                if (err.message = 'No such file') {
                    return this.fileNotFound();
                } else {
                    return Promise.reject(err);
                }
            });
    }
}

module.exports = SFTPConnection;