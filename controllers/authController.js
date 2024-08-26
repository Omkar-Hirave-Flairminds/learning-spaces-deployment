const jwt = require('jsonwebtoken');
const CONFIG = require('../utils/config');
const {executeQuery} = require('../utils/exec_db_query');
const {sendFailRes, sendSuccessRes} = require('../utils/responses');


const getToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            const decodedRefreshToken = jwt.verify(refreshToken, CONFIG.RERFRESH_JWT_SECRET_KEY);
            const email = decodedRefreshToken.email;
            const selectQuery = `SELECT * FROM users WHERE email = ? `;
            const user = await executeQuery(selectQuery, email);
            const token = jwt.sign({ email: email, userId: user.user_id }, CONFIG.JWT_SECRET_KEY, {
                expiresIn: "1m"
            });
            return sendSuccessRes(res, {result: token});
        } else {
            return sendFailRes(res, { message: "Unauthenticated User. No refresh token" }, 401);
        }
    } catch (error) {
        console.error(error);
        return sendFailRes(res, { message: error.message }, 500);
    }
}

function generateAccessToken(user) {
    return jwt.sign({ email: user.email, userId: user.user_id }, CONFIG.JWT_SECRET_KEY, {
        expiresIn: "10m"
    });
}

function getTokens(user) {
    const token = generateAccessToken(user);
    const refreshToken = jwt.sign({ email: user.email, userId: user.userId }, CONFIG.RERFRESH_JWT_SECRET_KEY, {
        expiresIn: "1d"
    });
    return {token, refreshToken};
}

module.exports = {
    getToken, getTokens
}