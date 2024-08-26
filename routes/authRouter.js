const express = require("express");
const refreshTokenRouter = express.Router();
const {getToken} = require('../controllers/authController');

refreshTokenRouter.get('/refresh', getToken);

module.exports = {refreshTokenRouter};