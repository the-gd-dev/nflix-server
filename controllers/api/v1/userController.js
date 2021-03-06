const jwt = require("jsonwebtoken");
const User = require("../../../models/User");
const bcrypt = require("bcrypt");
const Profile = require("../../../models/Profile");
/**
 * Create New User
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.postRegister = async (req, res) => {
  try {
    //validations
    const { name, phoneNumber, email, password } = req.body;
    if (!(name && email && phoneNumber && password))
      return res.status(400).send({ status: 400, message: "Data is missing." });
    // check if user already exist
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res
        .status(409)
        .send({ status: 400, message: "User Already Exist. Please Login" });
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
      password: encryptedPassword,
      profiles: [defaultProfile],
    });

    let resUser = {
      user_id: user._id,
      name,
      email,
    };
    // Jwt
    const token = jwt.sign(resUser, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });
    return res
      .status(201)
      .json({ message: "Signed up.", user: resUser, token });
  } catch (err) {
    return res.status(500).json(err);
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
    if (!(username && password))
      return res
        .status(400)
        .send({ status: 400, message: "Credentials required." });
    const user = await User.findOne({ email: username });
    //credentials matched
    if (user && (await bcrypt.compare(password, user.password))) {
      //Jwt Token Generation
      let resUser = {
        user_id: user._id,
        name: user.name,
        email: user.email,
      };
      const token = jwt.sign(resUser, process.env.TOKEN_KEY, {
        expiresIn: "2h",
      });
      return res
        .status(200)
        .json({ message: "Logged in.", user: resUser, token });
    }
    //credentials not matched
    return res
      .status(400)
      .send({ status: 400, message: "Invalid Credentials" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err });
  }
  // Our register logic ends here
};

/**
 * get JWT user
 * @param {*} req
 * @param {*} res
 */
exports.getUser = async (req, res) => {
  let user = await User.findOne({ _id: req.user.user_id }).select('_id name email phoneNumber');
  return res.status(200).json({ message: "User Fetched.", user: user });
};
