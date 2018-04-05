# FTP Bucket

A simple file storage for NodeJS using a FTP server.


## Installation

```
npm install ftp-bucket
```

### Note
Make sure directory listing is disable on the FTP server.
To prevent directory listings, create a `.htaccess` file following which includes the following text:

```
IndexIgnore *
```
[Reference](http://www.htaccess-guide.com/disable-directory-listings/)

## Example

```
const FTPBucket = require('ftp-bucket');

const bucketURL = 'sftp://username:password@example.com/path';

let bucket = new FTPBucket(bucketURL);

// Save stream
let stream = fs.createReadStream(...);
bucket.saveStream(stream)
    .then((info) => {
        console.log('id: 'info.id); // id: 60f7ac7d-ae83-4c15-8c9d-710e2861bdde
    })
    .catch((err) => {
        console.log(err);
    });

// Get stream
const idGet = 60f7ac7d-ae83-4c15-8c9d-710e2861bdde;
bucket.getStream(idGet)
    .then((file) => {
        console.log('id: 'file.id); // id: 60f7ac7d-ae83-4c15-8c9d-710e2861bdde
    })
    .catch((err) => {
        console.log(err);
    });

// Remove file
const idRemove = 60f7ac7d-ae83-4c15-8c9d-710e2861bdde;
bucket.remove(idRemove)
    .then((info) => {
        console.log('id: 'info.id); // id: 60f7ac7d-ae83-4c15-8c9d-710e2861bdde
    })
    .catch((err) => {
        console.log(err);
    });

```

## Documentation

TODO

## Run Tests

TODO
