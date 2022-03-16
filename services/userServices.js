const express = require("express");
const {
  postLogin,
  postRegister,
  getUser,
} = require("../controllers/api/v1/userController");
const isAuthenticated = require("../middlewares/auth");

const router = express.Router();

router.get("/", isAuthenticated, getUser);
router.post("/login", postLogin);
router.post("/register", postRegister);

module.exports = router;
