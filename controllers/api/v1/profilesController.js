const User = require("../../../models/User");
const Profile = require("../../../models/Profile");
/**
 * get all profiles of user
 * @param {*} req
 * @param {*} res
 */
exports.getProfiles = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.user.user_id }).populate("profiles").exec();
    return res.status(200).send({
      status: 200,
      profiles: user.profiles,
      message: "Profiles Fetched.",
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: "Internal Server Error." });
  }
};

/**
 * add new profile
 * @param {*} req
 * @param {*} res
 */
exports.addNewProfile = async (req, res) => {
  try {
    const { name } = req.body;
    let isProfileExist = await Profile.findOne({ name: name });
    let profile_data = isProfileExist;
    let userData = await User.findOne({ _id: req.user.user_id, name });
    if (!isProfileExist) {
      profile_data = await Profile.create({ name });
      userData.profiles.push(profile_data._id);
      userData.save();
    } else {
      return res.status(400).send({
        status: 400,
        profile: { name },
        message: "Profile Already Exist.",
      });
    }
    return res.status(200).send({
      status: 200,
      profile: profile_data,
      message: "New Profile Created.",
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: "Internal Server Error.", error });
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
    const { name, avatar } = req.body;
    let isProfileExist = await Profile.findOne({ _id: profileId });
    if (isProfileExist) {
      if (isProfileExist.name === name && isProfileExist.avatar === avatar) {
        return res.status(400).send({
          status: 400,
          message: "Profile Name Already Exist.",
        });
      }
      profile_data = await Profile.findOne({ _id: profileId }).updateOne({
        name,
        avatar,
      });
    } else {
      return res.status(404).send({
        status: 404,
        message: "Profile Not Found.",
      });
    }
    const newProfileData = await Profile.findOne({ _id: profileId });
    return res.status(200).send({
      status: 200,
      profile: newProfileData,
      message: "Updated Profile.",
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: "Internal Server Error.", error });
  }
};

/**
 * delete profile
 * @param {*} req
 * @param {*} res
 */
exports.trashProfile = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.user.user_id }).populate("profiles");
    const profileId = req.params.profileId;
    let isProfileExist = await Profile.findOne({ _id: profileId });
    if (!isProfileExist) {
      return res.status(404).send({
        status: 404,
        message: "Profile Not Found.",
      });
    }
    const updatedProfiles = user.profiles.filter((profile) => profile._id !== profileId);
    await User.findOne({ _id: req.user.user_id }).updateOne({ profiles: updatedProfiles });
    const profileDeleted = await Profile.deleteOne({ _id: profileId });
    return res.status(200).send({
      status: 200,
      profile: profileDeleted,
      message: "Deleted Profile.",
    });
  } catch (error) {
    return res.status(500).send({ status: 500, message: "Internal Server Error.", error });
  }
};
