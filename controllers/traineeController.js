const {
    getTrainee, getTraineeDetailsQuery,
    markAsReviewedQuery, getTraineesDetailsForStatusQuery,
    getStatusDropdownQuery
} = require('../models/traineeModel');
const {executeQuery} = require('../utils/exec_db_query');
const {sendSuccessRes, sendFailRes} = require('../utils/responses');

// INFO: 5. Get Trainee & Trainer Dropdown - Admin Page
const getTraineeCtrl = async(_, res) => {
    try {
        const results = await getTrainee();
        if (!results.error) {
            return sendSuccessRes(res, {result: results});
            // return res.send(results);
        }
        return sendFailRes(res, {message: results.errorMessage});
        // return res.send({error: true, errorMessage: results.errorMessage})
    } catch (error) {
        console.error("Error in get Trainee Ctrl..:", error);
        return sendFailRes(res, { message: "Internal Server Error" }, 500);
        // res.status(500).send("Internal Server Error");
    }
}

// 9 .Mark As Reviewed tab - Trainees Page
const markAsReviewedCtrl = async(req, res) => {
    try {
        const results = markAsReviewedQuery(req.body.training_plan_id);
        if (!results.error) {
            return sendSuccessRes(res, {result: results});
        }
        return sendFailRes(res, {message: results.errorMessage});
    } catch (error) {
        console.error("Error in markAsReviewedCtrlr..:", error);
        return sendFailRes(res, { message: "Internal Server Error" }, 500);
    }
}

// 14 . View Status for trainee - Training Page
const getTraineesDetailsForStatusCtrl = async(req, res) => {
    try {
        const results = await getTraineesDetailsForStatusQuery(req.params);
        if (!results.error) {
            return sendSuccessRes(res, {result: results});
        }
        return sendFailRes(res, {message: results.error.message});
    } catch (error) {
        console.error("Error in view Status Ctrl :", error);
        return sendFailRes(res, { message: "Internal Server Error" }, 500);
    }
}
// 11 . Trainee Details which are active or old - Trainees Page
const getActiveOrNotCtrl = async (req, res) => {
    try {
        const selectQuery = `SELECT * FROM users WHERE is_admin = 1 AND user_id = ? `;
        let userId = req.user.user_id;
        const adminExists = await executeQuery(selectQuery, userId);
        if (adminExists.length > 0) {
            userId = null;
        }
        const results = await getTraineeDetailsQuery([req.query.activityType, userId]);
        if (!results.error) {
            return sendSuccessRes(res, {result: results});
        }
        return sendFailRes(res, {message: results.error.message});
    } catch (error) {
        console.error("Error in get Trainee details Ctrl..:", error);
        return sendFailRes(res, { message: "Internal Server Error" }, 500);
    }
}

// 12 . Status Dropdown for Edit Activity - Training Page - Only 3 options
const getStatusDropdownCtrl = async(req, res) => {
    try {
        const results = await getStatusDropdownQuery();
        if (!results.error) {
            return sendSuccessRes(res, {result: results});
        }
        return sendFailRes(res, {message: results.error.message});
    } catch (error) {
        console.error("Error in get Status Dropdown Ctrl..:", error);
        return sendFailRes(res, { message: "Internal Server Error" }, 500);
    }
}
module.exports = {
    getTraineeCtrl, getActiveOrNotCtrl,
    markAsReviewedCtrl, getTraineesDetailsForStatusCtrl, getStatusDropdownCtrl
};
