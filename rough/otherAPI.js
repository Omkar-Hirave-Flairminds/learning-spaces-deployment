// API 1 
activitiesRouter.put('/assignDueDate', assignDueDateCtrl); //router 
const assignDueDateCtrl = async(req, res) => { //controller
    try {
        const results = await assignDueDateQuery(req.body);        
        if (!results.error) {
            return res.send(results);
        }
        return res.send({error: true,errorMessage: results.errorMessage})
    } catch (error) {
        console.error("Error in assigning a due date:", error);
        res.status(500).send("Internal Server Error");
    }
};
const assignDueDateQuery = async (params) => { //model
    try {
        const {due_date , activity_id} = params;
        const updateQuery = `UPDATE training_plan tp
                             JOIN activities_master am ON tp.activity_id = am.activity_id
                             SET tp.due_date = ?
                             WHERE tp.activity_id = ?`;
        return executeQuery(updateQuery, due_date ,activity_id );      
    } catch (error) {
        console.error("Error in assignDueDateQuery:", error);
        throw error;
    }
}

// API 2 
activitiesRouter.put('/markRequired', markActivitiesCtrl); //router 
const markActivitiesCtrl = async(req, res) => { //controller
    try {
        const results = await markActivitiesQuery(req.body);
        if (!results.error) {
            return res.send(results);
        }
        return res.send({error: true,errorMessage: results.errorMessage})
    } catch (error) {
        console.error("Error markActivitiesCtrl file:", error);
        res.status(500).send("Internal Server Error");
    }
};
const markActivitiesQuery = async (params) => { //models
    try {
        const { activity_id } = params;
        const updateQuery = `
            UPDATE training_plan tp
            JOIN activities_master am ON tp.activity_id = am.activity_id
            SET tp.required = false
            WHERE tp.activity_id = ?`;
        return executeQuery(updateQuery, activity_id);
    } catch (error) {
        console.log("Error in the activities model query");
        throw error;
    }
}

// API 3 
activitiesRouter.get('/completionPercent/:trainee_id', completionPercentageCtrl);//router
const completionPercentageCtrl = async(req , res)=>{//controller
    try {
        const results = await completionPercentage(req.params);
        console.log(results);
        if (!results.error) {
            return res.send(results);
        }
        return res.send({error: true, errorMessage: results.errorMessage})
    } catch (error) {
        console.error("Error completion percentage Ctrl file:", error);
        res.status(500).send("Internal Server Error");
    }
};
const completionPercentage = async(params)=>{ //models
    try {
        const {trainee_id} = params ;
        const percentageQuery = `SELECT
        u.user_id,
        u.user_name,
        COUNT(tp.training_plan_id) AS total_activities,
        SUM(tp.required) AS completed_activities,
        (SUM(tp.required) / COUNT(tp.training_plan_id)) * 100 AS completion_percentage
      FROM  users u 
      INNER JOIN trainee_trainer_tech ttt ON u.user_id = ttt.trainee_id
      INNER JOIN training_plan tp ON ttt.ttt_id = tp.ttt_id
      WHERE u.user_id = ?
      GROUP BY
      u.user_id, u.user_name
      `
      return executeQuery(percentageQuery, trainee_id);
    } catch (error) {
        console.log("Error in the completion percentage query");
        throw error;
    }
}

// API 4 
activitiesRouter.put('/setNotRequired', setActivitiesRequiredCtrl);//router 
const setActivitiesRequiredCtrl = async(req, res)=>{ //controller
    try {
        const results = await setActivitiesRequiredQuery(req.body);
        if (!results.error) {
            return res.send(results);
        }
        return res.send({error: true, errorMessage: results.errorMessage});
    } catch (error) {
        console.error("Error completion percentage Ctrl file:", error);
        res.status(500).send("Internal Server Error");
    }
};
const setActivitiesRequiredQuery = async (params) => { //models
    try {
        const {activity_id} = req.body
        const selectQuery = `
            UPDATE training_plan tp
            JOIN activities_master am ON tp.activity_id = am.activity_id
            SET tp.required = false
            WHERE tp.activity_id = ?`;
        return executeQuery(selectQuery, activity_id);
    } catch (error) {
        console.log("Error in the activities model query");
        throw error;
    }
}

// API 5 
technologyRouter.post('/createTrainingPlan', assignTechnology);//router
const assignTechnology = async (req, res) => {//controller 
    try {
    const { trainee_id, trainer_id, tech_id, tech_topic_id, tech_sub_topic_id, activity_id, due_date , start_date , end_date, status_id, required,  created_by, modified_by , ttt_id , comment_id} = req.body;
    const now = new Date();
    const trainee_trainer_tech_table =[trainee_id ,trainer_id ,tech_id];
    const training_plan_table = [ttt_id , activity_id ,due_date ,start_date, end_date , status_id ,comment_id , created_by , now ,  required , modified_by , now];
    const results = await assignTechnologyQuery(trainee_trainer_tech_table, training_plan_table);
    if (results.success) {
        return res.send(results); 
    }
    return res.send({error: true,errorMessage: results.errorMessage})
} catch (error) {
    console.error(error);
    res.status(500).send("Unable to register");
}
}

// API 6 
userRouter.post('/changePassword',changePassword);
const changePassword = async (req , res) => {
    const {currentPassword , newPassword} = req.body;
    if(!(currentPassword && newPassword)){
        return res.send({"status" : "Error" , "message" : "All fields are required"});
    }
    try {
        const email = req.user[0].email
        const query = 'SELECT password FROM users WHERE email = ?';
        const results = await executeQuery(query, [email]);
        if (results.length === 0) {
        return res.send({ status: 'Error', message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(currentPassword, results[0].password);
        
        if (!isMatch) {
            return res.send({ status: 'Error', message: 'Current password is incorrect' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);
        const isWorking = await updatePassword(hashPassword,email);
        console.log({ status: 'Success', message: 'Password updated successfully' });
        return res.send({ status: 'Success', message: 'Password updated successfully' , "info" : info});
    } catch (error) {
        console.error('Error in changing password:', error);
        return res.send({ status: 'Error', message: 'Error in changing password' });
    }
};

// API 7 
userRouter.post('/resetPasswordEmail', sendPasswordResetEmail); //router
const sendPasswordResetEmail = async (req, res) => { //controller
    const { email } = req.body;
    const results = await userExists(email);

    try {
        if (results.length === 0) {
            return res.send({ "status": "Error", "Message": "User with this email doesn't exist." });
        }
        console.log("");
        const SECRET = results.email + process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ email: email }, SECRET, { expiresIn: "5d" });

        const link = `http://localhost:9090/user/reset/${email}/${token}`;
        // email stuff
        const info = transporter.sendMail({
            from: '"Omkar Hirave " <omkarhirve05@gmail.com>',
            to: results[0].email,
            subject: "This is the password reset link....",
            html: `<a href="${link}">Click Here</a> to Reset Your Password`,
          });
        return res.send({ "status": "Success", "Message": "Password reset mail sent....Please check your mail" });

    } catch (error) {
        console.log(error);
        res.send(error);
    }
};

// API 8 
userRouter.post('/resetPassword', userPasswordReset);
const userPasswordReset = async(req , res) =>{
    const {password , password_confirmation} = req.body;
    const {email , token } = req.params;
    const results = await userExists(email);
    const NEW_SECRET = results.email + process.env.JWT_SECRET_KEY;
    console.log(NEW_SECRET);
    try {
        jwt.verify(token , NEW_SECRET);
        if(!(password && password_confirmation)){
            return res.send({"status" : "Error" , "Message" : "All fields are required..."});
        }if(password !== password_confirmation){
            return res.send({"status" : "Error" , "Message" : "Password and confirm password should be same..."});
        }
        const salt = await bcrypt.genSalt(10);
        const newHashPassword  = await bcrypt.hash(password , salt);
        const isWorking = await updatePassword(newHashPassword,email);
        return res.send({ status: 'Success', message: 'Password updated successfully' });
    } catch (error) {
        console.log(error);
    } 
} 

// API 9 
userRouter.get('/loggedUser',userAuthMiddleware, loggedUser);
const loggedUser  = async (req, res) => {
    try {
    const user = req.user.email
    return res.send({ "user": user })    
    } catch (error) {
        console.log(error);
        return res.send(error)
    }
};


// API 10 
trainingPlanRouter.post('/getTrainingActivities',userAuthMiddleware, getTrainingActCtrl); // router
const getTrainingActCtrl = async(req, res) =>{ // controller
    try {
        const results = await getTrainingActModel(req.user.user_id)
        if (!results.error) {
            return res.send(results);
        }
        return res.send({error: true, errorMessage: results.errorMessage})

    } catch (error) {
        console.error("Exception in get training activities controller", error);
        res.status(500).send("Internal Server Error");        
    }
}
const getTrainingActModel= async(params) =>{ //models
    try {
        const selectQuery = `SELECT  
        tm.tech_id AS tech_id,tm.technology AS tech,
        am.activity AS activity_name,ttm.topic AS topic_name,
        tst.sub_topic AS sub_topic_name,tp.training_plan_id as tp_id,
        tp.start_date AS start_date,tp.due_date AS due_date,
        tp.end_date AS end_date,c.comment AS comments,
        am.resource_link AS resource_link,am.description AS activity_description, sm.status AS status_name 
        FROM training_plan AS tp INNER JOIN activities_master AS am ON tp.activity_id = am.activity_id INNER JOIN tech_sub_topics_master AS tst ON am.sub_topic_id = tst.tech_sub_topic_id 
        INNER JOIN tech_topics_master AS ttm ON tst.tech_topic_id = ttm.tech_topic_id
        INNER JOIN technologies_master AS tm ON ttm.tech_id = tm.tech_id
        LEFT JOIN comments AS c ON tp.training_plan_id = c.training_plan_id
        INNER JOIN status_master AS sm ON tp.status_id = sm.status_id
        INNER JOIN trainee_trainer_tech AS ttt ON tp.ttt_id = ttt.ttt_id
        INNER JOIN users AS u ON ttt.trainee_id = u.user_id
        WHERE ttt.trainee_id = ?;`
        trainingActResults= await executeQuery(selectQuery ,params);
        if(trainingActResults.error){
            return {error: true,errorMessage:trainingActResults.error}
        }
        return trainingActResults

    } catch (error) {
        return {success: false,error: true,errorMessage: error.message}
    }
}

// API 11
const updatePassword = async (newPasswordHash , email) =>{
    try {
        const query = 'UPDATE users SET password = ? WHERE email = ?';
        const params = [newPasswordHash, email];
        return executeQuery(query,params);
    } catch (error) {
        console.error('Error in updateUserPasswordByEmail:', error);
        throw error;
    }
}

// API 12
// 8 .View Status Dropdown - Trainees Page - All 6 options
traineeRouter.get('/getStatus', userAuthMiddleware,getStatusCtrl);
const getStatusCtrl = async (_ , res)=>{
    try {
        const results = await getStatusQuery();
        if (!results.error) {
            return res.send(results);
        }
        return res.send({error: true, errorMessage: results.errorMessage})
    } catch (error) {
        console.error("Error in get Status Ctrl..:", error);
        res.status(500).send("Internal Server Error");
    }
}
const getStatusQuery = () =>{
    const query = `SELECT -1 as status_id, 'All' as status UNION ALL SELECT status_id, status FROM status_master`
    return executeQuery(query);
}

// API 13
technologyRouter.post('/completionPercentage',userAuthMiddleware , completionPercentageCtrl);
const compxletionPercentageCtrl = async(req , res)=>{
    try {
        const results = await completionPercentageQuery([req.user.user_id , req.body.tech_id]); 
        if (!results.error) {
            return res.send(results);
        }
        return res.send({error: true,errorMessage: results.errorMessage})
    } catch (error) {
        console.error("Error in Get traineesDashboardCtrl ..:", error);
        res.status(500).send("Internal Server Error");
    }
}
const completionPercentageQuery = ([user_id , tech_id])=>{
    const query = `SELECT
    (SUM(CASE WHEN tp.status_id =(SELECT status_id FROM status_master WHERE status='completed') THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS percentage_of_completed_activities
    FROM trainee_trainer_tech ttt  JOIN technologies_master t ON ttt.tech_id = t.tech_id
    JOIN training_plan tp ON ttt.ttt_id = tp.ttt_id 
    WHERE  ttt.trainee_id = ? AND ttt.tech_id = ?;`;
    return executeQuery(query , [user_id , tech_id]);
}