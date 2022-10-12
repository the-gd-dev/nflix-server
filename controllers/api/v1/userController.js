const jwt = require("jsonwebtoken");
const User = require("../../../models/User");
const bcrypt = require("bcrypt");
const Profile = require("../../../models/Profile");
const mailSender = require("../../../helpers/mailSender");
const userDataRules = require("../../../rules/userDataRules");
const isEmpty = require("../../../helpers/isEmpty");
async function getUserFromCollection(usrId) {
  return await User.findOne({ _id: usrId })
    .populate("profiles")
    .select("_id name email phoneNumber");
}
/**
 * Create New User
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.postRegister = async (req, res) => {
  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  try {
    const { name, phoneNumber, email, password } = req.body;
    //form - validations
    var formErrors = userDataRules.validateUserData(name, email, password, phoneNumber);
    if (!isEmpty(formErrors)) {
      return res.status(422).send({ status: 400, message: "data is invalid.", errors: formErrors });
    }

    // check if user already exist
    const oldUser = await User.findOne({ email, phoneNumber });
    if (oldUser) {
      return res.status(409).send({ status: 400, message: "User Already Exist. Please Login" });
    }
    const defaultProfile = await Profile.create({
      name: name,
    });
    //Encrypt user password
    let encryptedPassword = await bcrypt.hash(password, 16);

    // Create user in our database
    const user = await User.create({
      name,
      phoneNumber,
      email,
      emailToConfirm: email,
      verificationCode,
      current_watching: defaultProfile,
      password: encryptedPassword,
      profiles: [defaultProfile],
    });
    const subject = "Verify Your Email - Netflix Clone";
    const verficationMail = new mailSender(email, subject, "verification", {
      userName: name,
      verificationCode: verificationCode,
    });
    verficationMail.send();
    const resUser = await getUserFromCollection(user.id);
    return res.status(201).json({
      message: "Signed up. Please verify your email address.",
      user: {
        _id: resUser._id,
        name: resUser.name,
        email: resUser.email,
        phoneNumber: resUser.phoneNumber,
      },
    });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

/**
 * Login User
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.postLogin = async (req, res) => {
  try {
    //validations
    const { username, password } = req.body;
    if (!(username && password)) {
      return res.status(400).send({ status: 400, message: "Credentials required." });
    }
    const user = await User.findOne({ email: username });
    if (!user || (await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ status: 400, message: "Invalid Credentials." });
    }
    if (user.emailToConfirm) {
      return res
        .status(400)
        .send({ status: 400, message: "Please confirm your email first.", user: {} });
    }

    //Jwt Token Generation
    let resUser = {
      user_id: user._id,
      name: user.name,
      email: user.email,
    };
    const responseUserData = await getUserFromCollection(user._id);
    const token = jwt.sign(resUser, process.env.TOKEN_KEY, {
      expiresIn: "24h",
    });
    return res.status(200).json({ message: "Logged in.", user: responseUserData, token });
  } catch (err) {
    return res.status(500).json({ status: 500, message: "Internal Server Error", error: err });
  }
  // Our register logic ends here
};

/**

 * update user data
 * @param {*} req
 * @param {*} res
 */
exports.updateUserData = async (req, res) => {
  let user = await User.findOne({ _id: req.user.user_id });
  if (!user) {
    return res.status(404).send({ status: 400, message: "User Not Found." });
  }
  try {
    await User.updateOne({ _id: req.user.user_id }, req.body);
    let updatedUser = await User.findOne({ _id: req.user.user_id })
      .populate("profiles")
      .select("_id name email phoneNumber");
    return res.status(200).json({ message: "User Updated.", user: updatedUser });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

/**
 * update user data
 * @param {*} req
 * @param {*} res
 */
exports.updateUserData = async (req, res) => {
  let user = await User.findOne({ _id: req.user.user_id });
  if (!user) {
    return res.status(404).send({ status: 400, message: "User Not Found." });
  }
  try {
    await User.updateOne({ _id: req.user.user_id }, req.body);
    let updatedUser = await User.findOne({ _id: req.user.user_id })
      .populate("profiles")
      .select("_id name email phoneNumber");
    return res.status(200).json({ message: "User Updated.", user: updatedUser });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

/**
 * get JWT user
 * @param {*} req
 * @param {*} res
 */
exports.getUser = async (req, res) => {
  let user = await getUserFromCollection(req.user.user_id);
  return res.status(200).json({ message: "User Fetched.", user: user });
};
