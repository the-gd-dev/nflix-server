const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const server = http.createServer(app);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

//public path

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
const profileServices = require("./services/profileServices");

// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/api/v1/users", userServices);
app.use("/api/v1/profiles", profileServices);

mongoose.connect(process.env.MONGO_URL).then((res) => {
  server.listen(process.env.PORT);
  console.log("Netflix Server Running at http://localhost:8080");
});
