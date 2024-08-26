const jwt = require('jsonwebtoken');
const CONFIG = require('../utils/config');
const { executeQuery } = require("../utils/exec_db_query");
const { sendFailRes } = require('../utils/responses');

const adminAuthMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;

    if (authorization == null) {
        return sendFailRes(res, { message: "Unauthorized User, No Token" }, 401);
    }
    const token = authorization.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, CONFIG.JWT_SECRET_KEY);
        const email = decodedToken.email;

        const selectQuery = `SELECT * FROM users WHERE is_admin = 1 AND email = ? `;
        const user = await executeQuery(selectQuery, email);
        req.user = user[0]
        if (user && req.user.is_admin !== 0) {
            next();
        } else {
            return sendFailRes(res, { message: "You cannot change password since you don't have admin rights " }, 401);
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        return sendFailRes(res, { message: "Unauthorized User" }, 401);
    }
};

module.exports = {adminAuthMiddleware};