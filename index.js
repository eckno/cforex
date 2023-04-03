const express = require("express");
const redis = require("redis");
const helmet = require("helmet");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const ejs = require('ejs');
const expressSession = require('express-session');
//const RedisStore = require('connect-redis')(expressSession);
//const serviceAccount = require("./emailer-6f9eb-firebase-adminsdk-zwg5c-cc2535e7e8.json");

//Initializers
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
//   });

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/uploads')));

app.set('view engine', 'ejs');
dotenv.config();
//
// app.use(expressSession({
//     store: new RedisStore({
//     client: redis.get_connection()
//     }),
//     secret: process.env.SESSION_KEY,
//     resave: false,
//     saveUninitialized: false,
// }));

//
const PORT = process.env.PORT || 5003;
//
app.listen(PORT, () => {
        console.log("app running on port " + PORT);
});

//SET ROUTES RULES
app.use("/", require("./routes/index"));
app.use("/account/", require("./routes/account/index"));
app.use("/admin/", require("./routes/admin/index"));