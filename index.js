const express = require("express");
const redis = require("redis");
const helmet = require("helmet");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const expressSession = require('express-session');
const redisStore = require("connect-redis").default
const { REDIS_PORT, REDIS_HOST, SESSION_KEY } = require("./config");

const app = express();
//const RedisStore = connectRedis(expressSession);

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/uploads')));

app.set('view engine', 'ejs');
dotenv.config();
//
const redisClient = redis.createClient({
        port: REDIS_PORT,
        host: REDIS_HOST
});

app.use(expressSession({
    store: new redisStore({
    client: redisClient
    }),
    secret: SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30
    }
}));

//
const PORT = process.env.PORT || 5003;
//
app.listen(PORT, () => {
        console.log("app running on port " + PORT);
});

//SET ROUTES RULES
app.use("/", require("./routes"));
app.use("/secure/", require("./routes/secure"));
app.use("/account/", require("./routes/account"));
app.use("/admin/", require("./routes/admin"));