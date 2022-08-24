const Campaign = require("../models/campaign");

let message =""; 

const addCampaign = async (userDets, res) => {
  try {
    // create a new user
    const newCampaign = new Campaign({
      ...userDets
    });

    await newCampaign.save();

    return res.status(201).json({
      message: "Successfully added.",
      success: true,
      _id: newCampaign._id
    });
    
  } catch (err) {
    console.log('ERROR',err)
    return res.status(500).json({
      message: "Unable to add Campaign.",
      success: false,
      error: err
    });
  }
};

const getCampaign = async (id, res) => {
  const user = await Campaign.findById(id)
  .populate({ path :'charity', select: '_id user image', populate : { path : 'user', select: 'name'}})
  .populate({path: 'collaborating',select:'_id user image', populate : { path : 'user', select: 'name'}})
  .populate({path: 'donations',select:'amount'})
  .exec(function (err, user) {
    if (err){
      message=`Campaign is not found` 
      return res.status(404).json({
        message: message,
        success: false
      });
      //return handleError(err);
    }      

    result = {
      user
    };
    return res.status(200).json({
      ...result,
      message: "Charitys found",
      success: true
    });
  })
};

const updateCampaign = async (id, update, res) => {
  const user = await Campaign.findByIdAndUpdate(id , update);
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
      message: "Campaign updated",
      success: true
    });
};

const updateDonations = async (id, newDonation) => {
  const user = await Campaign.findByIdAndUpdate(id , { $push: { donations: newDonation}});
  if (!user) { 
    message=`Unable to Update` 
    return {
      message: message,
      success: false
    };
  }
    result = {
      user
    };

    return {
      ...result,
      message: "Campaign updated",
      success: true
    };
};

const getAll = async (req, res) => {
  const user = await Campaign.find()
    .populate({ path :'charity', select: '_id user image', populate : { path : 'user', select: 'name'}})
    .populate({path: 'collaborating',select:'_id user image', populate : { path : 'user', select: 'name'}})
    .populate({path: 'donations', select:'amount'})
    .exec(function (err, user) {
      if (err)
        return handleError(err);

      result = {
        user
      };
      return res.status(200).json({
        ...result,
        message: "Charitys found",
        success: true
      });
    })
};

module.exports = {
  getCampaign,
  addCampaign,
  getAll,
  updateCampaign,
  updateDonations
};
