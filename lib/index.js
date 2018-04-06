'use strict';

// Required libraries
const url = require('url');
const Promise = require('bluebird');
const uuid = require('uuid');

function connectionFactory(settings) {
    // Parse settings
    if (typeof settings === 'string') {
        settings = url.parse(settings);
    }
    if (settings.auth) {
        let auth = settings.auth.split(':');
        settings.username = auth[0];
        settings.password = auth[1];
    }

    let protocol = settings.protocol;
    let type = (protocol != null) ? protocol.replace(':', '') : void 0;

    const Connection = require(__dirname + "/connections/" + type + ".js");
    // TODO check if Connection has been imported

    return new Connection(settings);
}

class FTPBucket {
    /**
     * FTP Bucket
     * @param {String} settings
     * @constructor
     */
    constructor(settings) {
        // TODO Parse query

        this.connection = connectionFactory(settings);
        // TODO check if Connection has been imported
    }

    _getConnection() {
        return this.connection.isConnected()
            .then((isConnected) => {
                if (!isConnected) {
                    return this.connection.connect()
                        .then(() => {
                            return new Promise(resolve => setTimeout(resolve, 1000));
                        }).then(() => {
                            return this._getConnection();
                        });
                } else {
                    return Promise.resolve(this.connection);
                }
            });
    }

    _releaseConnection(connection) {
        //return this.pool.release(connection);
    }

    saveStream(stream, id = null) {
        return this._getConnection()
            .then((connection) => {
                return connection.saveStream(stream, this._generateFilename(id));
            });
    }

    getStream(id) {
        return this._getConnection()
            .then((connection) => {
                return connection.getStream(id);
            });
    }

    remove(id) {
        return this._getConnection()
            .then((connection) => {
                return connection.remove(id);
            });
    }

    _generateFilename(id, stream = null) {
        let generatedId = id;

        if (id == null) {
            generatedId = uuid.v4();
        }

        // TODO Check mime type and append right extension
        return generatedId;
    }
}

module.exports = FTPBucket;
