const Volunteer = require("../models/volunteer");

let message = "";
let user = {};

const addVolunteer = async (userDets, res) => {
  try {
    // create a new user
    const newVolunteer = new Volunteer({
      ...userDets
    });
    console.log(userDets)
    user = await newVolunteer.save();

    return res.status(201).json({
      ...user,
      message: "Successfully added.",
      success: true,
    });

  } catch (err) {
    console.log('error', err)
    return res.status(500).json({
      message: "Unable to create your profile.",
      success: false
    });
  }
};

const getVolunteer = async (id, res) => {
  const user = await Volunteer.findOne({ user: id })
    .populate({path: 'user', select: 'name username'})
    .populate('donations')
    .populate('opportunities')
    .populate('applications')
    .populate({path: 'charities', select:'image user', populate : { path : 'user', select: 'username name'}})
    .exec(function (err, user) {
      if (err){
        message = `Volunteer is not found`
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
        message: "Volunteer found",
        success: true
     });
    });
};

const updateVolunteer = async (id, update, res) => {
  const user = await Volunteer.findOneAndUpdate({ user: id }, update, { new: true })
    .then(function (user) {
      if (!user) {
        message = `Unable to Update`
        return res.status(404).json({
          message: message,
          success: false
        });
      } else {
        let result = {
          user
        };
        console.log(result)
        return res.status(200).json({
          ...result,
          message: "Volunteer profile updated",
          success: true
        });
      }
    })
    .catch(function (err) {
      message = `Unable to update, Error: ${err}`
      return res.status(404).json({
        message: message,
        success: false
      });
    });
};

const updateVolunteerDonation = async (id, newDonation) => {
  const user = await Volunteer.findByIdAndUpdate(id, { $push: { donations: newDonation }})
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
      message: "Volunteer updated",
      success: true
    };
};

const updateVolunteerOpportunities = async (id, newOpp) => {
  const user = await Volunteer.findByIdAndUpdate(id, { $push: { opportunties: newOpp }})
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
      message: "Volunteer updated",
      success: true
    };
};

const updateVolunteerApplication = async (id, newApplication) => {
  const user = await Volunteer.findByIdAndUpdate(id, { $push: { applications: newApplication }})
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
      message: "Volunteer updated",
      success: true
    };
};

const getAll = async (req, res) => {
  const user = await Volunteer.find()
    .populate('user', 'name')
    .populate('donations')
    .populate('opportunities')
    .exec(function (err, user) {
      if (err)
        return handleError(err);

      result = {
        user
      };
      return res.status(200).json({
        ...result,
        message: "Volunteers found",
        success: true
      });
    })
};

module.exports = {
  getVolunteer,
  addVolunteer,
  getAll,
  updateVolunteer,
  updateVolunteerDonation,
  updateVolunteerApplication,
  updateVolunteerOpportunities
};
