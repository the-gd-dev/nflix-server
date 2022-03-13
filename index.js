const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

//configure env file
const dotenv = require("dotenv");
dotenv.config();

//cors
var corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

const userServices = require("./services/userServices");

// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use("/api/v1/users", userServices);

mongoose.connect(process.env.MONGO_URL).then((res) => {
  server.listen(process.env.PORT);
  console.log("Netflix Server Running at http://localhost:8080");
});
