const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//configure env file
const dotenv = require("dotenv");
const User = require("./models/User");
const mongoose = require("mongoose");
dotenv.config();
const userServices = require("./services/userServices");

// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use("/api/v1/users", userServices);

mongoose.connect(process.env.MONGO_URL).then((res) => {
  server.listen(process.env.PORT);
  console.log("Netflix Server Running at http://localhost:8080");
});
