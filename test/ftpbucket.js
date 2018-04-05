const should = require('should');
const fs = require('fs');
const FTPBucket = require('../lib');

let connectionUrls = {};
connectionUrls.ftp = process.env.FTP_URL;
connectionUrls.sftp = process.env.SFTP_URL;

describe('FTPBucket', function() {

    this.timeout(10000);

    Object.keys(connectionUrls).forEach((key) => {
        context('For ' + key + ' connection', () => {
            let bucket;

            before((done) => {
                bucket = new FTPBucket(connectionUrls[key]);
                done();
            });

            it('should store stream with id', (done) => {
                bucket.saveStream(fs.createReadStream(__dirname + '/text.txt'), key + '/bucket/text.txt')
                    .then((info) => {
                        info.id.should.be.instanceOf(String);
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done(err);
                    });
            });

            it('should store stream without id', (done) => {
                bucket.saveStream(fs.createReadStream(__dirname + '/text.txt'))
                    .then((info) => {
                        info.id.should.be.instanceOf(String);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });

            it('should get stream', (done) => {
                bucket.getStream(key + '/bucket/text.txt')
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
                bucket.getStream(key + '/bucket/text2.txt')
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
                bucket.remove(key + '/bucket/text.txt')
                    .then((info) => {
                        info.id.should.be.instanceOf(String);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            });

            it('should fail to remove a non-existing file', (done) => {
                bucket.remove(key + '/bucket/text2.txt')
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

        });
    });

});