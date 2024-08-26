const express = require("express");
const {addUser, userLogin} = require('../controllers/userController');
const { adminAuthMiddleware } = require('../middlewares/adminMiddleware');
const {sendSuccessRes} = require('../utils/responses');
const userRouter = express.Router();

// public routes
// 1 . add user API - Admin Page
userRouter.post('/addUser', adminAuthMiddleware, addUser);
// 2 . user login API - Admin Page
userRouter.post('/login', userLogin);

userRouter.get('/', (req, res) => {
    return sendSuccessRes(res, {result: "Welcome to training tracker backend..." })
})

module.exports = { userRouter };
