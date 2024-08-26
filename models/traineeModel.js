const {executeQuery} = require('../utils/exec_db_query');

// 5 . Get Trainee & Trainer Dropdown - Admin Page
const getTrainee = () => {
    const query = `SELECT user_id , user_name FROM users WHERE is_admin = 0`;
    return executeQuery(query);
}
// 11 . Trainee Details which are active or old - Trainees Page
const getTraineeDetailsQuery = ([activityType, userId]) => {
    const whereCondition = activityType === 'active'
        ? 'Completed_Activities_Percentage != 100'
        : activityType === 'old'
        ? 'Completed_Activities_Percentage = 100'
        : '';
    const getOldAndActiveActivitiesQuery = `
        SELECT u1.user_name AS trainee_name, u2.user_name AS trainer_name, 
            SUM(CASE WHEN c.is_resolved = false THEN 1 ELSE 0 END) AS unresolved_comments,
            SUM(CASE WHEN tp.status_id = 1 THEN 1 ELSE 0 END) AS activities_not_started,
            SUM(CASE WHEN tp.status_id = 3 THEN 1 ELSE 0 END) AS unreviewed_status,
            SUM(CASE WHEN tp.status_id = 5 THEN 1 ELSE 0 END) AS delayed_activities,
            ROUND(SUM(CASE WHEN tp.status_id = 4 THEN 1 ELSE 0 END) / COUNT(*) * 100,0) AS Completed_Activities_Percentage,   
            tech.technology AS technology,
            DATE_FORMAT(tp.start_date, '%Y-%m-%d') AS start_date ,
            DATE_FORMAT(tp.due_date, '%Y-%m-%d') AS due_Date 
        FROM trainee_trainer_tech ttt JOIN users u1 ON ttt.trainee_id = u1.user_id
        JOIN users u2 ON ttt.trainer_id = u2.user_id    JOIN technologies_master tech ON ttt.tech_id = tech.tech_id
        LEFT JOIN training_plan tp ON ttt.ttt_id = tp.ttt_id
        LEFT JOIN comments c ON tp.training_plan_id = c.training_plan_id
        GROUP BY u1.user_name, u2.user_name, tech.technology
        HAVING ${whereCondition};
    `;
    return !userId ? executeQuery(getOldAndActiveActivitiesQuery) : executeQuery(getOldAndActiveActivitiesQuery, [userId]);
};

// 9 .Mark As Reviewed tab - Trainees Page
const markAsReviewedQuery = (params) => {
    const query = `UPDATE training_plan SET status_id = (select status_id from status_master where status='completed') WHERE training_plan_id = ? `;
    return executeQuery(query, params);
}

// 14 . View Status for trainee - Training Page
const getTraineesDetailsForStatusQuery = (params) => {
    const queryParams = [params.status_id, params.trainee_id];
    let whereCondition = '';
    if (params) {
        whereCondition = `WHERE sm.status_id = ? AND ttt.trainee_id = ?`;
    }
    const query = `
        SELECT tm.technology AS technology ,am.activity AS activity_name,
            tp.training_plan_id AS training_plan_id, ttm.topic AS topic,
            tst.sub_topic AS sub_topic,DATE_FORMAT(tp.due_date, '%Y-%m-%d') AS plan_due_date,
            am.description AS activity_description,DATE_FORMAT(tp.start_date, '%Y-%m-%d') AS plan_start_date,DATE_FORMAT(tp.end_date, '%Y-%m-%d') AS plan_end_date,
            c.comment AS comments,am.resource_link AS activity_link
        FROM 
            training_plan tp 
            JOIN status_master sm ON tp.status_id = sm.status_id
            JOIN activities_master am ON tp.activity_id = am.activity_id
            JOIN tech_sub_topics_master tst ON am.sub_topic_id = tst.tech_sub_topic_id
            JOIN tech_topics_master ttm ON tst.tech_topic_id = ttm.tech_topic_id 
            LEFT JOIN comments c ON tp.training_plan_id = c.training_plan_id
            LEFT JOIN trainee_trainer_tech ttt ON tp.ttt_id = ttt.ttt_id 
            LEFT JOIN technologies_master tm ON ttt.tech_id = tm.tech_id 
        ${whereCondition}  
        GROUP BY 
            am.activity_id, tp.due_date, c.comment_id
        ORDER BY 
            tp.due_date;
    `;
    return executeQuery(query, queryParams);
}

// 12 . Status Dropdown for Edit Activity - Training Page - Only 3 options
const getStatusDropdownQuery = (params) => {
    const query = `SELECT status_id , status_display  FROM status_master sm WHERE status IN ('not_started','in_progress','done');`;
    return executeQuery(query, params);
}
const getStatusQuery = () => {
    const query = `SELECT status_id, status_display FROM status_master`
    return executeQuery(query);
}

module.exports = {getTrainee, getTraineeDetailsQuery, markAsReviewedQuery, getTraineesDetailsForStatusQuery, getStatusDropdownQuery, getStatusQuery};
