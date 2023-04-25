require('dotenv').config();
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { SERVICE_ACCOUNT_PATH } = require("./config");
const { REDIS_PORT, REDIS_URL, SESSION_KEY } = require("./config");
const express = require("express");
const helmet = require("helmet");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const Redis = require('ioredis');
const redis = new Redis(REDIS_URL);

initializeApp({credential: cert(SERVICE_ACCOUNT_PATH)});
const app = express();
app.use(helmet({contentSecurityPolicy: false,}));
//app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/uploads')));

app.set('view engine', 'ejs');
dotenv.config();
//
app.use(session({
	store: new RedisStore({ client: redis }),
	secret: SESSION_KEY,
	resave: false,
	saveUninitialized: false
}));

//
const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {

        console.log("app running on port " + PORT);
});

//SET ROUTES RULES
app.use("/", require("./routes"));
app.use("/secure/", require("./routes/secure"));
app.use("/account/", require("./routes/account"));
app.use("/admin/", require("./routes/admin"));