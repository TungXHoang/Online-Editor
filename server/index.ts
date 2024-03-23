// Models Import
import { User } from "./models/users";

// Utils Import
import express from "express";
import { Request, Response, NextFunction } from "express";

// DB and Auth Import
import mongoose from "mongoose";
import IORedis from "ioredis";
import RedisStore from "connect-redis";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/mernStack";
import session from "express-session";

// Routes Import
import userRoutes from "./routes/users";
import dotenv from "dotenv"

dotenv.config();


const app = express();
const port = process.env.PORT || 8080;

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("DB conencted");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const redisClient = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

const redisStore = new RedisStore({ client: redisClient }); 

//Configure redis client

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function () {
    console.log('Connected to redis successfully');
});



const sessionConfig: session.SessionOptions = {
  // store,
    store: new RedisStore({ client: redisClient }),
    name: process.env.SESS_COOKIE,
    secret: "keyword",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use(express.static(path.join(__dirname, "frontend/build")));

app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.currentUser = req.user; //
    next();
});


app.use("/", userRoutes);

// Start Server here
app.listen(port, () => {
   console.log("Server is running on port 8080!");
});