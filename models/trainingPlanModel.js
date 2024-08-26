const { executeQuery } = require("../utils/exec_db_query");

const {beginTransaction, commitTransaction, rollbackTransaction} = require('../utils/transactionsQueries');


const saveTpModel = async(params, userId) => {
    try {
        await beginTransaction();
        const {tech_id: techId, trainee_id: traineeId, trainer_id: trainerId, activities} = params;
        const paramsForTP = activities
        const paramsForTTT = [techId, traineeId, trainerId, userId];
        const selectQuery = `SELECT * FROM trainee_trainer_tech WHERE tech_id = ? AND trainee_id = ? AND trainer_id = ?`
        const results = await executeQuery(selectQuery, [techId, traineeId, trainerId]);
        if (results.length > 0) {
            return {isDuplicate: true, success: false, message: "Data CANNOT be inserted successfully into both tables."};
        }
        const insertQueryTTT = `INSERT INTO trainee_trainer_tech (tech_id, trainee_id, trainer_id, created_by) VALUES (?, ?, ?, ?)`;
        const traineeTrainerTechResults = await executeQuery(insertQueryTTT, paramsForTTT);
        if (traineeTrainerTechResults.error) {
            await rollbackTransaction(traineeTrainerTechResults.error);
            throw traineeTrainerTechResults.error;
        }
        const tttId = traineeTrainerTechResults.insertId
        const values = paramsForTP.map(param => [tttId, param.activity_id, param.due_date, param.required ? param.required : true, 1, userId]);
        const insertQuery = `INSERT INTO training_plan(ttt_id , activity_id, due_date, required, status_id, created_by) VALUES ?`;
        const trainingPlanResult = await executeQuery(insertQuery, [values]);
        if (trainingPlanResult.error) {
            await rollbackTransaction(trainingPlanResult .error);
            throw trainingPlanResult .error;
        }
        await commitTransaction();
        return {isDuplicate: false, success: true, message: "Data inserted successfully into both tables."};
    } catch (error) {
        console.error("Error in saveTpModel:", error);
        await rollbackTransaction(error);
        return {success: false, error: true, errorMessage: error.message}
    }
};
//13 . Update Training Plan - Training Page
const updateTrainingActModel = async(params, userId) => {
    try {

        await beginTransaction();
        const tpId = params.tpId
        // eslint-disable-next-line prefer-const
        let setValues = []
        if (params.status_id) {
            setValues.push(`status_id = ${params.status_id}`)
        }
        if (params.start_date) {
            const startDate = new Date(params.start_date).toISOString().slice(0, 19).replace('T', ' ');
            setValues.push(`start_date = '${startDate}'`)
        }
        if (params.end_date) {
            const endDate = new Date(params.end_date).toISOString().slice(0, 19).replace('T', ' ');
            setValues.push(`end_date = '${endDate}'`)
        }
        if (setValues.length > 0) {
            const paramsForUpdate = [userId, tpId]
            const updateTrainingQuery = `update training_plan set ${setValues.join(',')}, modified_by = ?, modified_at = now() where training_plan_id = ?`;
            const updateResults = await executeQuery(updateTrainingQuery, paramsForUpdate)
            if (updateResults.error) {
                await rollbackTransaction(updateResults.error);
                throw updateResults.error;
            }
        }
        if ("comment" in params) {
            const comment = params.comment
            const paramsForComment = [userId, 0, comment, tpId]
            const insertCommentQuery = `insert into comments(added_by,is_resolved,comment,training_plan_id) values(?,?,?,?)`;
            const insertCommentResults = await executeQuery(insertCommentQuery, paramsForComment)
            if (insertCommentResults.error) {
                await rollbackTransaction(insertCommentResults.error);
                throw insertCommentResults.error;
            }
        }
        await commitTransaction();
        return {success: true, message: "Update Operation Completed"};

    } catch (error) {
        await rollbackTransaction(error);
        return { success: false, error: true, errorMessage: error.message}
    }
}
const updateCommentStatusModel = async(params) => {
    try {
        const {commentId} = params
        const updateCommentQuery = `update comments set is_resolved = 1,resolved_on=now() where comment_id = ?`
        const updateCommentStatus = executeQuery(updateCommentQuery, commentId)
        if (updateCommentStatus.error) {
            return {error: true, errorMessage: updateCommentStatus.error}
        }
        return {success: true, message: "Updated Comment Status"};
    } catch (error) {
        return {error: true, errorMessage: error.message}
    }
}
// 14 . My Activities -Training Page
const getTrainingActModel = async(params) => {
    try {
        let selectQuery = `SELECT tp.training_plan_id, 
        tm.technology AS tech , am.activity AS activity_name, 
        ttm.topic AS topic_name, tst.sub_topic AS sub_topic_name , 
        DATE_FORMAT(tp.start_date, '%Y-%m-%d') AS start_date,DATE_FORMAT(tp.due_date, '%Y-%m-%d') AS due_date,
        DATE_FORMAT(tp.end_date, '%Y-%m-%d') AS end_date,  c.comment AS comments,
        am.resource_link AS resource_link, am.description AS activity_description, sm.status_display AS status_name 
        FROM training_plan AS tp 
        INNER JOIN activities_master AS am ON tp.activity_id = am.activity_id 
        INNER JOIN tech_sub_topics_master AS tst ON am.sub_topic_id = tst.tech_sub_topic_id 
        INNER JOIN tech_topics_master AS ttm ON tst.tech_topic_id = ttm.tech_topic_id
        INNER JOIN technologies_master AS tm ON ttm.tech_id = tm.tech_id
        LEFT JOIN comments AS c ON tp.training_plan_id = c.training_plan_id
        INNER JOIN status_master AS sm ON tp.status_id = sm.status_id
        INNER JOIN trainee_trainer_tech AS ttt ON tp.ttt_id = ttt.ttt_id
        INNER JOIN users AS u ON ttt.trainee_id = u.user_id
        WHERE 
        ttt.trainee_id = ?`;
        if (params.length > 1 && params[1] !== -1) {
            selectQuery += ` AND tp.status_id = ?`;
        }
        const trainingActResults = await executeQuery(selectQuery, params);
        if (trainingActResults.error) {
            return {error: true, errorMessage: trainingActResults.error}
        }
        return trainingActResults;
    } catch (error) {
        return {success: false, error: true, errorMessage: error.message}
    }
}

module.exports = {saveTpModel, updateTrainingActModel, updateCommentStatusModel, getTrainingActModel}