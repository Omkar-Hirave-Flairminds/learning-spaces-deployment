const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve('../.env') });
const {executeQuery} = require('../utils/db_queries');

const DBFIXESDIR = './dbFixes/';

// eslint-disable-next-line no-unused-vars
function initializeDB() {
    const sqlFilePath = './initSchema.sql';
    const sqlQueries = fs.readFileSync(sqlFilePath, { encoding: 'utf8', flag: 'r' });
    createSchema(sqlQueries);
}

async function createSchema(sqlQueries) {
    try {
        // const initSchemaResult = await executeQuery(sqlQueries);
        // console.info(initSchemaResult);
        await executeQuery(sqlQueries);
    } catch (error) {
        console.error(error);
    }
}

// eslint-disable-next-line no-unused-vars
async function initSeedData() {
    const sqlFilePath = './initSeed.sql';
    const sqlSeedDataQueries = fs.readFileSync(sqlFilePath, { encoding: 'utf8', flag: 'r' });
    try {
        // const sqlSeedDataQueriesResult = await executeQuery(sqlSeedDataQueries);
        // console.info(sqlSeedDataQueriesResult);
        await executeQuery(sqlSeedDataQueries);
    } catch (error) {
        console.error(error);
    }
}

// eslint-disable-next-line no-unused-vars
async function runDBFixes() {
    const files = fs.readdirSync(DBFIXESDIR);
    for (const file of files) {
        const dbFixFilePath = DBFIXESDIR + file;
        const dbFixQuery = fs.readFileSync(dbFixFilePath, { encoding: 'utf8', flag: 'r' });
        await executeQuery(dbFixQuery);
    }
}

if (process.env.NODE_ENV == 'development') {
    // initializeDB();
    // initSeedData();
    runDBFixes();
}
