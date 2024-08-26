const { S3Client } = require('@aws-sdk/client-s3');

const CONFIG = require('../utils/config');

const s3Client = new S3Client({
region: CONFIG.AWS_REGION,
credentials: {
    accessKeyId: CONFIG.ACCESS_KEY_ID,
    secretAccessKey: CONFIG.SECRET_ACCESS_KEY
}
});

module.exports = {s3Client}