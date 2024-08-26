const logSchedulerRouter = require("express").Router();
const CONFIG = require("../utils/config");
const {addLogFiles, getLogFiles} = require('../utils/log_scheduler');

if (CONFIG.NODE_ENV == 'development') {
    logSchedulerRouter.get("/", async(req, res) => {
        const msg = await addLogFiles();
        res.send(msg);
    });
    logSchedulerRouter.get('/getObjectList', async(req, res) => {
        const response = await getLogFiles();
        res.send(response);
    });
}


module.exports = {logSchedulerRouter};