const fs = require('fs');
const {PutObjectCommand, ListObjectsCommand, GetObjectCommand} = require('@aws-sdk/client-s3');
const {s3Client} = require('../config/aws_config');
const CONFIG = require('./config');

async function addLogFiles() {
    const FOLDER_PATH = './logs';
    try {
        const FILES = fs.readdirSync(FOLDER_PATH).filter(( elm ) => elm.match(/.*\.(log)/i));
        for (const file of FILES) {
            console.info(file);
            const s3Key = `${CONFIG.S3_PATH}/${file}`;
            const s3Command = new PutObjectCommand({
                Bucket: CONFIG.BUCKET,
                Key: s3Key,
                Body: fs.readFileSync(FOLDER_PATH + "/" + file, { encoding: 'utf8', flag: 'r' }),
                ContentType: 'text/plain'
            });
            await s3Client.send(s3Command);
            fs.unlinkSync(FOLDER_PATH + "/" + file);
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}


async function getLogFiles() {
    try {
        const getObjectsListcommand = new ListObjectsCommand({
            Bucket: CONFIG.BUCKET,
            Prefix: "logs/"
        });
        const objectListResponse = await s3Client.send(getObjectsListcommand);
        const objectList = objectListResponse.Contents;
        for (const object of objectList) {
            const getObjectCommand = new GetObjectCommand({
                Bucket: CONFIG.BUCKET,
                Key: `${object.Key}`
            });
            const response = await s3Client.send(getObjectCommand);
            response.Body.transformToString().then(d => console.info(d)).catch(err => console.error(err))
        }
        return {success: true};
    } catch (error) {
        console.error(error);
        return { success: false, error: JSON.stringify(error) };
    }
}

module.exports = { addLogFiles, getLogFiles }