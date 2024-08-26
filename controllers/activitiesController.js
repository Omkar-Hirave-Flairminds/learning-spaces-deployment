const { getActivitiesByTechnologyQuery, setStatusEditActivityQuery} = require("../models/activitiesModel");
const {sendSuccessRes, sendFailRes} = require('../utils/responses');
// 6 . Get Activities API - Admin Page
const getActivitiesByTechnologyCtrl = async(req, res) => {
    try {
        const results = await getActivitiesByTechnologyQuery(req.body);
        if (!results.error) {
            return sendSuccessRes(res, {result: results});
        }
        return sendFailRes(res, { message: results.errorMessage });
    } catch (error) {
        console.error("Error completion percentage Ctrl file:", error);
        return sendFailRes(res, { message: "Internal Server Error" });
    }
}
const setStatusForEditActivityCtrl = async(req, res) => {
    try {
        const results = await setStatusEditActivityQuery();
        if (!results.error) {
            return sendSuccessRes(res, {result: results});
        }
        return sendFailRes(res, { message: results.errorMessage });
    } catch (error) {
        console.error("Error in setStatusForEditActivityCtrl  file:", error);
        return sendFailRes(res, { message: "Internal Server Error" });
    }
}

module.exports = {getActivitiesByTechnologyCtrl, setStatusForEditActivityCtrl };

