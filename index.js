const session = require('express-session');
const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const SESSION_KEY = process.env.SESSION_KEY;
const cors = require("cors");
const passportSetup = require("./passport");
const passport = require("passport");
const authRoute = require("./routes/auth");
const app = express();
const mongoose = require('mongoose');

mongoose.connect(MONGO_URL);

mongoose.connection.on("connected",()=>{
    console.log("Successfully conncted to MongoDB");
})

mongoose.connection.on("error",()=>{
    console.log("Not connected to MongoDB");
})

require("./models/users");
app.use(session({
    secret:SESSION_KEY,
    resave: false,
    saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());

//app.use(require("./routes/routes"))
app.use(express.json());

app.use(
  cors(
    {
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  }
  )
);

app.use("/auth", authRoute);
// app.use("/api", authRoute);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
