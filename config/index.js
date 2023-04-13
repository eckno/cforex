const mtdconfig = require("../mtdconfig.json");


const SERVICE_ACCOUNT_PATH = mtdconfig;
const SESSION_KEY ="686f746a95b6f836d7d70567c302c3f9ebb5ee0def3d1220ee9d4e9f34f5e131";
const REDIS_URL = 'redis://localhost:6379';
const REDIS_HOST = 'localhost';
const REDIS_PORT = 6379;

module.exports = { SERVICE_ACCOUNT_PATH, SESSION_KEY, REDIS_URL, REDIS_PORT, REDIS_HOST };