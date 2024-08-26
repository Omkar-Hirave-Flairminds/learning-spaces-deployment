const {saveTpModel, updateTrainingActModel, updateCommentStatusModel, getTrainingActModel} = require('../models/trainingPlanModel');
const {sendSuccessRes, sendFailRes} = require('../utils/responses');

// 7 .Save Training Plan For Admin Page
const saveTpCtrl = async(req, res) => {
    try {
        const results = await saveTpModel(req.body, req.user.user_id)
        if (!results.error) {
            console.info(results);
            if (results.isDuplicate) {
                return sendFailRes(res, {message: results}, 400, 'saveTpCtrl-saveTpModel-isDuplicate');
            }
            return sendSuccessRes(res, {result: {results}});
        }
        return sendFailRes(res, { message: results.error.errorMessage})
        // return res.send({error: true, errorMessage: results.error.errorMessage})
    } catch (error) {
        console.error("Exception in save training plan controller", error);
        return sendFailRes(res, { message: "Internal Server Error" }, 500);
    }
}

// 13 . Update Training Plan - Training Page
const updateTrainingActCtrl = async(req, res) => {
    try {
        const results = await updateTrainingActModel(req.body, req.user.user_id)
        if (!results.error) {
            return sendSuccessRes(res, {result: results});
        }
        return sendFailRes(res, {message: results.error.message});
    } catch (error) {
        console.error("Exception in update training plan controller", error);
        return sendFailRes(res, { message: "Internal Server Error" }, 500);
    }
}

const updateCommentStatusCtrl = async(req, res) => {
    try {
        const results = await updateCommentStatusModel(req.body)
        if (!results.error) {
            return sendSuccessRes(res, {result: results});
        }
        return sendFailRes(res, {message: results.error.message});
    } catch (error) {
        console.error("Exception in update comment status controller", error);
        return sendFailRes(res, { message: "Internal Server Error" }, 500);
    }
}

// 14 . My Activities -Training Page
const getTrainingActCtrl = async (req, res) => {
    try {
        const results = await getTrainingActModel([req.user.user_id, req.body.status_id]);
        if (results.error) {
            return sendFailRes(res, {message: results.error.message});
        }
        const formattedData = {};
        for (const row of results) {
            const { tech, topicName, subTopicName, activityName, startDate, dueDate, endDate, comments, resourceLink, activityDescription, statusName } = row;
            if (!formattedData[tech]) {
                formattedData[tech] = [];
            }
            formattedData[tech].push({
                activityName, topicName, subTopicName, startDate, dueDate, endDate, comments, resourceLink, activityDescription, statusName
            });
        }
        return sendSuccessRes(res, {result: results});
    } catch (error) {
        console.error("Exception in get training activities controller", error);
        return sendFailRes(res, { message: "Internal Server Error" }, 500);
    }
}

module.exports = {saveTpCtrl, updateTrainingActCtrl,
    updateCommentStatusCtrl, getTrainingActCtrl
}