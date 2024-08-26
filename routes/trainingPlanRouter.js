const express = require("express");
const { saveTpCtrl, updateTrainingActCtrl, updateCommentStatusCtrl, getTrainingActCtrl} = require('../controllers/trainingPlanCtlr');
const { adminAuthMiddleware } = require("../middlewares/adminMiddleware");
const {userAuthMiddleware} = require("../middlewares/userMiddleware");

const trainingPlanRouter = express.Router();

// 7 .Save Training Plan - Admin Page
trainingPlanRouter.post('/saveActivities', adminAuthMiddleware, saveTpCtrl);
// 13 . Update Training Plan - Training Page
trainingPlanRouter.post('/updateTrainingPlan', userAuthMiddleware, updateTrainingActCtrl)

// 14 . My Activities -Training Page
trainingPlanRouter.post('/getTrainingActivities', userAuthMiddleware, getTrainingActCtrl);

trainingPlanRouter.post('/updateCommentStatus', userAuthMiddleware, updateCommentStatusCtrl)
module.exports = {trainingPlanRouter};