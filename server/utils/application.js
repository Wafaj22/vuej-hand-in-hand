const Application = require("../models/application");
let message = "";

const addApplication = async (userDets, res) => {
  try {
    // create a new user
    const newApplication = new Application({...userDets});
    await newApplication.save();
    return res.status(201).json({message: "Successfully added.", success: true, _id: newApplication._id });
  } catch (err) {
    return res.status(500).json({message: "Unable to add Application.", success: false });
  }
};

const createApplication = async (userDets) => {
  try {
    // create a new user
    const newApplication = new Application({...userDets});
    await newApplication.save();
    return {message: "Successfully added.", success: true, _id: newApplication._id };
  } catch (err) {
    return {message: "Unable to add Application.", success: false };
  }
};

const getApplication = async (id, res) => {
  const user = await Application.findById(id);
  if (!user) {
    message = `Application is not found`
    return res.status(404).json({message: message, success: false});
  }
  result = { user };
  return res.status(200).json({...result, message: "Application found", success: true});
};

const updateApplication = async (id, update, res) => {
  const user = await Application.findByIdAndUpdate(id, update);
  if (!user) {
    message = `Unable to Update`
    return res.status(404).json({ message: message, success: false});
  }
  result = {user};
  return res.status(200).json({...result, message: "Application updated", success: true });
};

const getAll = async (res) => {
  const user = await Application.find();
  if (!user) {
    message = `No Applications found`
    return res.status(404).json({message: message, success: false});
  }
  result = { user};
  return res.status(200).json({...result, message: "Application found", success: true});
};

module.exports = {getApplication, addApplication, getAll, updateApplication, createApplication};
