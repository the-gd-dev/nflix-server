const express = require("express");
const {
  getProfiles,
  trashProfile,
  addNewProfile,
  updateProfile,
} = require("../controllers/api/v1/profilesController");
const isAuthenticated = require("../middlewares/auth");
const router = express.Router();

router.get("/", isAuthenticated, getProfiles);
router.post("/create", isAuthenticated, addNewProfile);
router.post("/update/:profileId", isAuthenticated, updateProfile);
router.post("/trash/:profileId", isAuthenticated, trashProfile);

module.exports = router;
