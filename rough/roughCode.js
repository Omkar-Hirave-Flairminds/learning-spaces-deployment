eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJyb2NrMDVAZ21haWwuY29tIiwiaWF0IjoxNjk2OTEzNTM0LCJleHAiOjE2OTczNDU1MzR9.dhEpU785IxRIWKbh0x0ImzT1sFee1k_zeK9nvuWhURg


// Data for user register
// {
//     "user_name" : "Brock lesnar"  ,
    //  "email" : "brock05@gmail.com",
    //  "password" : "brock@123",
//      "password_confirmation" : "brock@123",
//      "is_admin" : "1"
//  }

// Data for user login
// // { 
//     "email" : "swaraj@gmail.com",
//     "password" : "Swaraj@123"
// }

//   {
//     "trainee_id" : "1",
//     "trainer_id" : "2" ,
//     "tech_id" : "2",
//     "tech_topic_id" : "1",
//     "tech_sub_topic_id" : "1",
//     "activity_id" : "1",
//     "due_date" : "2023-10-11 14:30:00",
//     "start_date" : "2021-9-9 12:30:00",
//     "end_date" : "2023-12-12 16:30:00",
//     "status_id": "1",
//     "required" : "1",
// }

// {
//   "due_date": "2023-11-11 11:11:10",
//   "activity_id" : "1"
// }


const { executeQuery } = require("../db_config/db_schema.js");

// This is class based approach when you are importing the resources from other user 
class TechnologyModel {
  static async checkIfUserExists(user_id) {
    const [result] = await executeQuery('SELECT COUNT(*) as count FROM user WHERE user_id = ?', [user_id]);
    return result.count > 0;
  }

  static async checkIfTechTopicExists(tech_topic_id) {
    const [result] = await executeQuery('SELECT COUNT(*) AS count FROM tech_topics_master WHERE tech_topic_id = ? ', [tech_topic_id]);
    return result.count > 0;
  }

  static async checkIfSubTechExists(tech_sub_topic_id) {
    const [result] = await executeQuery('SELECT COUNT(*) AS count FROM tech_sub_topics_master WHERE tech_sub_topic_id = ?', [tech_sub_topic_id]);
    return result.count > 0;
  }

  static async checkIfStatusExists(status_id) {
    const [result] = await executeQuery('SELECT COUNT(*) AS count FROM activities_master WHERE activity_id =?', [status_id]);
    return result.count > 0;
  }

  static async checkIfActivityExists(activity_id) {
    const [result] = await executeQuery('SELECT COUNT(*) AS count FROM activities_master WHERE activity_id =?', [activity_id]);
    return result.count > 0;
  }

  static async checkIfTechExists(tech_id) {
    const [result] = await executeQuery('SELECT COUNT(*) as count FROM technologies_master WHERE tech_id = ?', [tech_id]);
    return result.count > 0;
  }

  static async beginTransaction() {
    return new Promise((resolve, reject) => {
      con.beginTransaction((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  static async commitTransaction() {
    return new Promise((resolve, reject) => {
      con.commit((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  static async rollbackTransaction(error) {
    return new Promise((resolve, reject) => {
      con.rollback(() => {
        reject(error);
      });
    });
  }

  static async assignTechnologyQuery(trainee_trainer_tech_table, training_plan_table) {
    try {
      // Begin the transaction
      await this.beginTransaction();

      // Insert the values into the trainee trainer tech
      const insertQuery = `INSERT INTO trainee_trainer_tech (trainee_id, trainer_id, tech_id, created_at) VALUES (?, ?, ?, NOW())`;
      const trainee_trainer_tech_results = await executeQuery(insertQuery, trainee_trainer_tech_table);
      if (trainee_trainer_tech_results.error) {
        await this.rollbackTransaction(trainee_trainer_tech_results.error);
        return Promise.reject(trainee_trainer_tech_results.error);
      }

      const insertTrainingPlan = `INSERT INTO training_plan  
        (ttt_id, activity_id, due_date, start_date, end_date, status_id, description, comment_id, trainer_comments, created_by, created_at, required, modified_by, modified_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

      const trainingPlanResult = await executeQuery(insertTrainingPlan, training_plan_table);
      if (trainingPlanResult.error) {
        await this.rollbackTransaction(trainingPlanResult.error);
        return Promise.reject(trainingPlanResult.error);
      }

      // Commit the transaction
      await this.commitTransaction();

      // Resolve the promise
      return "Data inserted successfully into both tables.";
    } catch (error) {
      console.error("Error in assignTechnologyQuery:", error);
      return Promise.reject(error);
    }
  }
}

module.exports = TechnologyModel;


// Important --to be used later
const getActivitiesQuery = async()=>{
  const selectQuery = `SELECT 
  ttt.trainee_id, 
  ttt.trainer_id, 
  ttt.tech_id, 
  tts.tech_topic_id, 
  tsts.tech_sub_topic_id, 
  am.activity_id, 
  tp.due_date, 
  tp.start_date, 
  tp.end_date, 
  sm.status_id, 
  tp.required
FROM 
  trainee_trainer_tech ttt
JOIN 
  tech_sub_topics_master tsts ON tsts.tech_topic_id = ttt.tech_id
JOIN 
  tech_topics_master tts ON tts.tech_topic_id = tsts.tech_topic_id
JOIN 
  activities_master am ON am.sub_topic_id = tsts.tech_sub_topic_id
JOIN 
  training_plan tp ON tp.ttt_id = ttt.ttt_id AND tp.activity_id = am.activity_id
JOIN 
  status_master sm ON sm.status_id = tp.status_id
WHERE 
  ttt.trainee_id = 1
  AND ttt.trainer_id = 2
  AND ttt.tech_id = 2
  AND tts.tech_topic_id = 1
  AND tsts.tech_sub_topic_id = 1
  AND am.activity_id = 1
  AND tp.due_date = '2023-10-11 14:30:00'
  AND tp.start_date = '2021-09-09 12:30:00'
  AND tp.end_date = '2023-12-12 16:30:00'
  AND sm.status_id = 1
  AND tp.required = 1;
`;
  const trainee_trainer_tech_results = await executeQuery(insertQuery);
  if (trainee_trainer_tech_results.error) {
      await rollbackTransaction(trainee_trainer_tech_results.error);
      throw trainee_trainer_tech_results.error; 
  }
}

// Punit sir login for JWT verification 
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlB1bml0QDEyM0BnbWFpbC5jb20iLCJpYXQiOjE2OTcxMDgzNTcsImV4cCI6MTY5NzU0MDM1N30.GliX6K6Qm4FOEdIMIyzs54F3HTyiB0GurzqfAFHJTNg

// Punit sir login demo 
// {
//   "current_password": "Omkar@123",
//   "password_confirmation" : "Omkar@123" , 
//   "new_password" : "Punit@Flairminds"
// }

const changePassword = async (email, currentPassword, newPassword) => {
  try {
    const query = 'SELECT password FROM users WHERE email = ?';
    const results = await executeQuery(query, [userId]);

    if (results.length === 0) {
      return { status: 'Error', message: 'User not found' };
    }

    // Check if the provided current password matches the stored hash
    const isMatch = await bcrypt.compare(currentPassword, results[0].password);
    if (!isMatch) {
      return { status: 'Error', message: 'Current password is incorrect' };
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
    await executeQuery(updateQuery, [hashPassword, userId]);

    return { status: 'Success', message: 'Password updated successfully' };
  } catch (error) {
    console.error('Error in changing password:', error);
    return { status: 'Error', message: 'Error in changing password' };
  }
};

const userRegistration = async (req, res) => {
  const { user_name, email, password, is_admin } = req.body;

  if (!(user_name && email && password && is_admin)) {
      return res.send("All fields are necessary...");
  }
  try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const userExist = await userExists(email); 
      if (userExist.length > 0) {
          return res.status(400).json({ error: "Email already exists. Choose a different email address or login with the same address." });
      }
      const now = new Date();
      const results = await addUserQuery(user_name, email, hashPassword, is_admin , now);
      if(results.length == 0){
          return res.status(400).json({ error: "Something wrong in your code" });
          }
          var token = jwt.sign({ email: email }, process.env.JWT_SECRET_KEY, {
              expiresIn: "5d",
          });
          res.send(`User created successfully with email - ${email} and has ${token}`);
          console.log(`User created successfully with email - ${email} and has ${token}`);
      } catch (error) {
          res.send("Unable to register");
          console.error(error); // Use console.error for logging errors
      }
};


// Given by Punit sir 
// SELECT
//     ttm.tech_topic_id AS topic_id,
//     ttm.tech_topic_id,
//     tst.tech_sub_topic_id AS sub_topic_id,
//   FROM technologies_master tm
//   INNER JOIN tech_topics_master ttm ON tm.tech_id = ttm.tech_id
//   INNER JOIN tech_sub_topics_master tst ON ttm.tech_topic_id = tst.tech_topic_id
//   INNER JOIN activities_master
//   ttt.tech_id = ?



const getTTTId = getTTTIdResult[0].ttt_id;

        for (let i = 0; i < paramsfortp.length; i++) {
            const activityId = paramsfortp[i];
            
            if (activityId && activityId.activity_id !== null) {
                const params = [getTTTId, activityId];
                console.log("The params are -->", params);
                const insertQueryTrainingPlan = `
                    INSERT INTO training_plan (ttt_id, activity_id)
                    VALUES (?, ?)`;

                const trainingPlanResult = await executeQuery(insertQueryTrainingPlan, params);
                if (trainingPlanResult.error) {
                    await rollbackTransaction(trainingPlanResult.error);
                    throw trainingPlanResult.error; 
                }
            } else {
                console.error("Invalid or null activity_id");
            }
        }
      
http://localhost:9090/user/reset/Swaraj@gmail.com/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlN3YXJhakBnbWFpbC5jb20iLCJpYXQiOjE2OTgwNjE3NzksImV4cCI6MTY5ODQ5Mzc3OX0.Guso74M7nvedRWHbKHRW8F1WALgN3932CmPGZlrtnRc


  // const selectData = `select start_date, end_date, status_id from training_plan WHERE training_plan_id = ?`;       
        // const tp_results = await executeQuery(selectData,tp_id)

        // let status_id = tp_results[0].status_id
        // let start_date = tp_results[0].start_date
        // let end_date = tp_results[0].end_date
// 
// Shivani's comment on updateTrainingActModel code on trainingPlanModel.js


// Shivani Has API for it so I am changing it 
// update the activity for a particular user and activity 
// const updateActivityForUserQuery = (param) =>{
//   const {user_id , activity_id , start_date , end_date , due_date} = param; 
//   const updateQuery = `UPDATE training_plan tp
//   JOIN trainee_trainer_tech ttt ON tp.ttt_id = ttt.ttt_id
//   SET tp.start_date = ?,
//       tp.end_date = ?
//   WHERE tp.activity_id = ?
//     AND ttt.trainee_id = ?;
//   `;
//   const params = [start_date , end_date ,due_date ,activity_id , user_id ];
//   return executeQuery(updateQuery , params)
// }

// Shivani Has API for it so I am changing it 
// const getTraineeController = async(req , res) =>{
//   try {
//       const results = await getTrainee();
//       return res.send(results);
//   } catch (error) {
//       console.error("Error in get Trainee controller..:", error);
//       res.status(500).send("Internal Server Error");
//   }
// }


// Pending tasks are 
// following proper casing 
// 
// Ask regarding this to Punit Sir 
// WITH cte AS (
//   SELECT
//       (SELECT COUNT(*) FROM training_plan WHERE status_id = 4 AND ttt.trainer_id = ?) AS completed,
//       (SELECT COUNT(*) FROM training_plan WHERE status_id = 2 AND ttt.trainer_id = ?) AS in_progress,
//       (SELECT COUNT(*) FROM training_plan WHERE status_id = 1 AND ttt.trainer_id = ?) AS not_started,
//       (SELECT COUNT(*) FROM training_plan WHERE status_id = 5 AND ttt.trainer_id = ?) AS delayed_
// )

// SELECT completed, in_progress, not_started, delayed_
// FROM cte;


// DONT NEED AT THIS MOMENT 
// Working good - 
// const allActivitiesSummationQuery = ()=>{
//   const query = `WITH cte AS (
//       SELECT
//           (SELECT COUNT(*) FROM training_plan WHERE status_id = 4) AS completed,
//           (SELECT COUNT(*) FROM training_plan WHERE status_id = 2) AS in_progress,
//           (SELECT COUNT(*) FROM training_plan WHERE status_id = 1) AS not_started,
//           (SELECT COUNT(*) FROM training_plan WHERE status_id = 5) AS delayed_,
//           ((SELECT COUNT(*) FROM training_plan WHERE status_id = 4) / COUNT(*) * 100) AS completion_percentage
//       FROM
//           technologies_master t
//           LEFT JOIN trainee_trainer_tech ttt ON t.tech_id = ttt.tech_id
//           LEFT JOIN training_plan tp ON ttt.ttt_id = tp.ttt_id
//   )
//   SELECT completed, in_progress, not_started, delayed_, completion_percentage
//   FROM cte;`;
//   return executeQuery(query);
// }
[
  {
      "technology": "Python",
      "completed": 3,
      "in_progress": 1,
      "not_started": 13,
      "delayed_": 0,
      "not_reviewed": 1,
      "percentage_of_activities": 8.571428571428571
  },
  {
      "technology": "Java",
      "completed": 5,
      "in_progress": 0,
      "not_started": 9,
      "delayed_": 0,
      "not_reviewed": 3,
      "percentage_of_activities": 14.285714285714285
  },
  {
      "technology": "All",
      "completed": 8,
      "in_progress": 1,
      "not_started": 22,
      "delayed_": 0,
      "not_reviewed": 4,
      "percentage_of_completed_activities": 22.857142857142858
  }
]