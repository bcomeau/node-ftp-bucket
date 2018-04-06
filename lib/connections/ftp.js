'use strict';

// Required libraries
const Client = require('promise-ftp');
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
        this.client = new Client();
        return this.client.connect(this.settings);
    }

    disconnect() {
        return this.client.end();
    }

    isConnected() {
        let status = this.client ? this.client.getConnectionStatus() : 'not yet connected';

        switch (status) {
            case Client.STATUSES['NOT_YET_CONNECTED']:
            case Client.STATUSES['CONNECTING']:
            case Client.STATUSES['LOGGING_OUT']:
            case Client.STATUSES['DISCONNECTING']:
            case Client.STATUSES['DISCONNECTED']:
            case Client.STATUSES['RECONNECTING']:
                return Promise.resolve(false);
            default:
                return Promise.resolve(true);
        }
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
}

module.exports = FTPConnection;