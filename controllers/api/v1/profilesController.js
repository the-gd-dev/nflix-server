const User = require("../../../models/User");
const Profile = require("../../../models/Profile");
/**
 * get all profiles of user
 * @param {*} req
 * @param {*} res
 */
exports.getProfiles = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.user.user_id })
      .populate("profiles")
      .exec();
    return res.status(200).send({
      status: 200,
      profiles: user.profiles,
      message: "Profiles Fetched.",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: 500, message: "Internal Server Error." });
  }
};

/**
 * add new profile
 * @param {*} req
 * @param {*} res
 */
exports.addNewProfile = async (req, res) => {
  try {
    const { isChildren, name } = req.body;
    let isProfileExist = await Profile.findOne({ name: name });
    let profile_data = isProfileExist;
    let userData = await User.findOne({ _id: req.user.user_id });
    if (!isProfileExist) {
      profile_data = await Profile.create({ name, isChildren });
      userData.profiles.push(profile_data._id);
      userData.save();
    } else {
      return res.status(409).send({
        status: 409,
        profile: profile_data,
        message: "Profile Already Exist.",
      });
    }
    return res.status(200).send({
      status: 200,
      profile: profile_data,
      message: "New Profile Created.",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: 500, message: "Internal Server Error.", error });
  }
};

/**
 * update profile
 * @param {*} req
 * @param {*} res
 */
exports.updateProfile = async (req, res) => {
  try {
    const profileId = req.params.profileId;
    const { name } = req.body;
    let isProfileExist = await Profile.findOne({ name: name });
    let profile_data = isProfileExist;
    if (!isProfileExist) {
      profile_data = await Profile.findOne({ _id: profileId }).updateOne({
        name,
      });
    } else {
      return res.status(409).send({
        status: 409,
        profile: profile_data,
        message: "Profile Already Exist.",
      });
    }
    return res.status(200).send({
      status: 200,
      profile: {
        _id: profileId,
        name,
      },
      message: "Updated Profile.",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: 500, message: "Internal Server Error.", error });
  }
};

/**
 * delete profile
 * @param {*} req
 * @param {*} res
 */
exports.trashProfile = (req, res) => {};
