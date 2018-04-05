const should = require('should');
const fs = require('fs');

let connectionUrls = {};
connectionUrls.ftp = process.env.FTP_URL;
connectionUrls.sftp = process.env.SFTP_URL;

describe('Test each connections individually', function() {

    this.timeout(10000);

    Object.keys(connectionUrls).forEach((key) => {
        context('For ' + key + ' connection', () => {
            let connection;

            before((done) => {
                connection = new (require('../lib/connections/' + key))(connectionUrls[key]);
                done();
            });

            it('should connect', (done) => {
                connection.connect()
                    .then(() => {
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });

            it('should store stream', (done) => {
                connection.saveStream(fs.createReadStream(__dirname + '/text.txt'), key + '-text.txt')
                    .then((info) => {
                        info.id.should.be.instanceOf(String);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });

            it('should get stream', (done) => {
                connection.getStream(key + '-text.txt')
                    .then((file) => {
                        file.id.should.be.instanceOf(String);
                        file.stream.should.be.instanceOf(Object);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });

            it('should fail get a non-existing stream', (done) => {
                connection.getStream(key + '-text2.txt')
                    .then((file) => {
                        done(file);
                    })
                    .catch((err) => {
                        if (err.code === 404) {
                            // No such file or directory
                            done();
                        } else {
                            done(err);
                        }
                    });
            });

            it('should remove file', (done) => {
                connection.remove(key + '-text.txt')
                    .then((info) => {
                        info.id.should.be.instanceOf(String);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });

            it('should remove a non-existing file', (done) => {
                connection.remove(key + '-text2.txt')
                    .then((info) => {
                        done(info);
                    })
                    .catch((err) => {
                        if (err.code === 404) {
                            // No such file or directory
                            done();
                        } else {
                            done(err);
                        }
                    });
            });

            it('should disconnect', (done) => {
                connection.disconnect()
                    .then(() => {
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });

        });
    });
});