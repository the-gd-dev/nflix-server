const express = require("express");
const {
  postLogin,
  postRegister,
} = require("../controllers/api/v1/userController");

const router = express.Router();

router.post("/login", postLogin);
router.post("/register", postRegister);

module.exports = router;
