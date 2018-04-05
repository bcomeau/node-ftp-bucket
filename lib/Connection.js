'use strict';

// Required libraries
const url = require('url');
const Promise = require('bluebird');
const path = require('path');

class Connection {

    /**
     * Connection
     * @param {String} bucketURL
     * @constructor
     */
    constructor(bucketURL) {
        // Parse settings
        this.settings = bucketURL;
        if (typeof this.settings === 'string') {
            this.settings = url.parse(this.settings);
        }
        if (this.settings.auth) {
            let auth = this.settings.auth.split(':');
            this.settings.username = auth[0];
            this.settings.password = auth[1];
        }
    }

    connect() {
        return Promise.reject('Not implemented');
    }

    disconnect() {
        return Promise.reject('Not implemented');
    }

    saveStream(stream, id) {
        return Promise.reject('Not implemented');
    }

    saveData() {
        return Promise.reject('Not implemented');
    }

    getStream(id) {
        return Promise.reject('Not implemented');
    }

    getData(id) {
        // TODO Convert stream (.getStream) to data
        return Promise.reject('Not implemented');
    }

    remove(id) {
        return Promise.reject('Not implemented');
    }

    getPath(id) {
        if (id == null) {
            id = '';
        }
        return path.normalize(path.join(this.settings.pathname || '/', String(id)));
    }

    fileNotFound() {
        let error = {};
        error.code = 404;
        error.message = 'File not found';
        return Promise.reject(error);
    }
}

module.exports = Connection;
