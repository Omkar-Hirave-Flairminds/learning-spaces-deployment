const { executeQuery } = require("../utils/exec_db_query");

// 4 .Get Technology Dropdown - Admin Page
const getTechnology = () => {
    const query = `SELECT tech_id , technology FROM technologies_master`
    return executeQuery(query);
}
// My training part for dashboard page
const getMyTrainingQuery = ([userId]) => {
    const query = `
    WITH cte AS (SELECT t.technology,
            SUM(CASE WHEN tp.status_id = (SELECT status_id FROM status_master WHERE status = 'completed') THEN 1 ELSE 0 END) AS completed,
            SUM(CASE WHEN tp.status_id = (SELECT status_id FROM status_master WHERE status = 'in_progress') THEN 1 ELSE 0 END) AS in_progress,
            SUM(CASE WHEN tp.status_id = (SELECT status_id FROM status_master WHERE status = 'not_started') THEN 1 ELSE 0 END) AS not_started,
            SUM(CASE WHEN tp.status_id = (SELECT status_id FROM status_master WHERE status = 'done') THEN 1 ELSE 0 END) AS not_reviewed,
            SUM(CASE WHEN tp.status_id = (SELECT status_id FROM status_master WHERE status = 'delayed') THEN 1 ELSE 0 END) AS delayed_,
            (SUM(CASE WHEN tp.status_id = (SELECT status_id FROM status_master WHERE status = 'completed') THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS percentage_of_activities
        FROM trainee_trainer_tech ttt
        JOIN technologies_master t ON ttt.tech_id = t.tech_id
        JOIN training_plan tp ON ttt.ttt_id = tp.ttt_id
        WHERE ttt.trainee_id = ? 
        GROUP BY t.technology
      )
      SELECT technology, completed, in_progress, not_started, delayed_,not_reviewed , percentage_of_activities FROM cte;`;
        return executeQuery(query, [userId]);
}


const traineesDashboardQuery = (params) => {
    const query = ` SELECT
    SUM(CASE WHEN tp.status_id = (SELECT status_id FROM status_master WHERE status='completed') THEN 1 ELSE 0 END) AS completed,
    SUM(CASE WHEN tp.status_id = (SELECT status_id FROM status_master WHERE status='in_progress') THEN 1 ELSE 0 END) AS in_progress,
    SUM(CASE WHEN tp.status_id = (SELECT status_id FROM status_master WHERE status='not_started') THEN 1 ELSE 0 END) AS not_started,
    SUM(CASE WHEN tp.status_id = (SELECT status_id FROM status_master WHERE status='delayed') THEN 1 ELSE 0 END) AS delayed_,
    SUM(CASE WHEN tp.status_id = (SELECT status_id FROM status_master WHERE status='done') THEN 1 ELSE 0 END) AS not_reviewed
FROM technologies_master t
    LEFT JOIN trainee_trainer_tech ttt ON t.tech_id = ttt.tech_id
    LEFT JOIN training_plan tp ON ttt.ttt_id = tp.ttt_id
WHERE ttt.trainer_id = ?;`;
    return executeQuery(query, params);
}
// Not Sure about this API
const completionPercentageQuery = ([userId, techId]) => {
    const query = `SELECT
    (SUM(CASE WHEN tp.status_id =(SELECT status_id FROM status_master WHERE status='completed') THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS percentage_of_completed_activities
    FROM trainee_trainer_tech ttt  JOIN technologies_master t ON ttt.tech_id = t.tech_id
    JOIN training_plan tp ON ttt.ttt_id = tp.ttt_id 
    WHERE  ttt.trainee_id = ? AND ttt.tech_id = ?;`;
    return executeQuery(query, [userId, techId]);
}
// 6 . Get Activities API - Admin Page
const getActivitiesByTechnologyQuery = async(params) => {
    try {
        const {tech_id: techId} = params;
        const selectQuery = `SELECT tm.tech_id , tm.technology AS technology,ttm.tech_topic_id , ttm.topic AS topic, tst.tech_sub_topic_id , tst.sub_topic AS sub_topic,
        am.activity_id , am.activity AS activity
        FROM technologies_master tm LEFT JOIN tech_topics_master 
        ttm ON tm.tech_id = ttm.tech_id
        LEFT JOIN tech_sub_topics_master tst ON ttm.tech_topic_id = tst.tech_topic_id LEFT JOIN activities_master am ON tst.tech_sub_topic_id = am.sub_topic_id WHERE tm.tech_id = ? AND am.activity_id is NOT NULL `;
        return executeQuery(selectQuery, techId);
    } catch (error) {
        console.error("Error in the activities model query");
        throw error;
    }
}

const setStatusEditActivityQuery = async() => {
    const selectQuery = `SELECT status_id FROM status_master sm  WHERE status IN ('not_started','in_progress','done');`
    return executeQuery(selectQuery)
}

module.exports = { getTechnology, getMyTrainingQuery, traineesDashboardQuery, completionPercentageQuery, getActivitiesByTechnologyQuery, setStatusEditActivityQuery };
