const cron = require('node-cron');
const CONFIG = require('./utils/config');
const {addLogFiles} = require('./utils/log_scheduler');
const { createServer } = require('./utils/server');

const app = createServer();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

cron.schedule('0 23 * * *', () => {
  if (addLogFiles()) {
    console.info("Log files uploaded ssucessfully and deleted from logs folder");
  } else {
    console.info("Could not upload log files and delete from logs folder");
  }
});

app.listen(CONFIG.SERVER_PORT, () => {
  console.info(`Server running on port ${CONFIG.SERVER_PORT}`);
});
