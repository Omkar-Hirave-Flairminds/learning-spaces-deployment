const {executeQuery} = require('../utils/exec_db_query');

// 1 . add user API - Admin Page
const addUserQuery = (userName, email, password, isAdmin, createdAt) => {
    const query = `INSERT INTO users (user_name, email, password, is_admin , created_at) VALUES (?, ?, ?, ? ,?)`;
    const params = [userName, email, password, isAdmin, createdAt];
    return executeQuery(query, params);
}
// 1 . add user API - Admin Page
const userExists = async (email) => {
    const query = `SELECT * FROM users WHERE email = ?`;
    const params = email;
    return await executeQuery(query, params);
}

module.exports = {addUserQuery, userExists };