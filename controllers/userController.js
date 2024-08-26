const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { addUserQuery, userExists } = require("../models/userModel");
const CONFIG = require('../utils/config');
const {executeQuery} = require('../utils/exec_db_query');
const {sendSuccessRes, sendFailRes} = require('../utils/responses');
const {getTokens} = require('./authController');

// 1 . add user API - Admin Page
const addUser = async (req, res) => {
    let { user_name: userName, email, password, is_admin: isAdmin } = req.body;

    if (!(userName && email && password)) {
        return sendFailRes(res, { message: "All fields are necessary..." } );
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const userExist = await userExists(email);
        if (userExist.length > 0) {
            return sendFailRes(res, { message: "Email already exists. Choose a different email address or login with the same address." }, 400);
            // return res.status(400).json({ error: "Email already exists. Choose a different email address or login with the same address." });
            }
        const now = new Date();
        if (!isAdmin) isAdmin = 0;
        const results = await addUserQuery(userName, email, hashPassword, isAdmin, now);
        if (results.length == 0) {
            return sendFailRes(res, { message: "Something wrong in your code" }, 400);
            // return res.status(400).json({ error: "Something wrong in your code" });
        }
        const token = jwt.sign({ email: email }, CONFIG.JWT_SECRET_KEY, {
            expiresIn: "5d"
        });
        return sendSuccessRes(res, {result: `User created successfully with email - ${email} and has ${token}`});
        // res.send({success : true, message :`User created successfully with email - ${email} and has ${token}`});
    } catch (error) {
        console.error(error);
        return sendFailRes(res, { message: "Unable to register" }, 500);
        // res.send("Unable to register");
    }
};
// 2 . user login API - Admin Page
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email && password) {
            const selectQuery = `SELECT * FROM users WHERE email = ?`;
            const result = await executeQuery(selectQuery, [email]);
            if (result.length == 0) {
                // return res.status(400).json({error: `You're not registered yet. Please first sign up and you'll be able to log in.`, });
                return sendFailRes(res, { message: "You're not registered yet. Please sign up." } );
            }
            const isMatch = await bcrypt.compare(password, result[0].password);
            if (result[0].email === email && isMatch) {
                const user = result[0];
                const {token, refreshToken} = getTokens(user);
                res.cookie('access_token', token);
                return sendSuccessRes(res, {result: {"token": token, "refreshToken": refreshToken, "success": true, "user_id": user.user_id, "is_admin": result[0].is_admin}});
                } else {
                    return sendFailRes(res, { message: "Invalid email or password..." } );
                }
        } else {
            return sendFailRes(res, { message: "All fields are necessary..." }, 400);
            // return res.send({success : false, message :"All fields are necessary..."});
        }
    } catch (error) {
        console.error(error);
        return sendFailRes(res, { message: error.message }, 500);
    }
};

module.exports = { addUser, userLogin };
