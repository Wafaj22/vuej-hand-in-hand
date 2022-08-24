const Donation = require("../models/donation");

let message =""; 

const addDonation = async (userDets, res) => {
  try {
    // create a new user
    const newDonation = new Donation({
      ...userDets
    });

    await newDonation.save();

    return res.status(201).json({
      message: "Successfully added.",
      success: true,
      _id: newDonation._id
    });
    
  } catch (err) {
    return res.status(500).json({
      message: "Unable to add Donation.",
      success: false
    });
  }
};

const getDonation = async (id, res) => {
  const user = await Donation.findById(id);
  if (!user) { 
    message=`Donation is not found` 
    return res.status(404).json({
      message: message,
      success: false
    });
  }
    result = {
      user
    };

    return res.status(200).json({
      ...result,
      message: "Donation found",
      success: true
    });
};

const updateDonation = async (id, update, res) => {
  const user = await Donation.findByIdAndUpdate(id , update);
  if (!user) { 
    message=`Unable to Update` 
    return res.status(404).json({
      message: message,
      success: false
    });
  }
    result = {
      user
    };

    return res.status(200).json({
      ...result,
      message: "Donation updated",
      success: true
    });
};

const getAll = async (res) => {
  const user = await Donation.find();
  if (!user) { 
    message=`No Donations found` 

    return res.status(404).json({
      message: message,
      success: false
    });
  }

    result = {
      user
    };

    return res.status(200).json({
      ...result,
      message: "Donation found",
      success: true
    });
};

const createDonation = async (userDets) => {
  try {
    // create a new user
    const newDonation = new Donation({
      ...userDets
    });

    await newDonation.save();

    return {
      message: "Successfully added.",
      success: true,
      _id: newDonation._id
    };
    
  } catch (err) {
    return {
      message: "Unable to add Donation.",
      success: false
    };
  }
};

module.exports = {
  getDonation,
  addDonation,
  getAll,
  updateDonation, 
  createDonation
};
