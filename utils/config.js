const dotenv = require("dotenv");
dotenv.config();

const CONFIG = {
    SERVER_PORT: process.env.PORT || 9090,
    DB_HOST: process.env.HOST,
    DB_USER: process.env.USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DATABASE,
    DB_PORT: process.env.DATABASE_PORT,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    RERFRESH_JWT_SECRET_KEY: process.env.RERFRESH_JWT_SECRET_KEY,
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
    AWS_REGION: process.env.REGION,
    BUCKET: process.env.BUCKET,
    S3_BUCKET_LINK: process.env.S3_BUCKET_LINK,
    S3_PATH: process.env.S3_PATH,
    NODE_ENV: process.env.NODE_ENV
}

module.exports = CONFIG