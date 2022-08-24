const Opportunity = require("../models/opportunity");

let message =""; 

const addOpportunity = async (userDets, res) => {
  try {
    // create a new user
    const newOpportunity = new Opportunity({
      ...userDets
    });

    await newOpportunity.save();

    return res.status(201).json({
      message: "Successfully added.",
      success: true,
      _id: newOpportunity._id
    });
    
  } catch (err) {
    return res.status(500).json({
      message: "Unable to add Opportunity.",
      success: false
    });
  }
};

const getOpportunity = async (id, res) => {
  const user = await Opportunity.findById(id)
  .populate({ path :'charity', select: '_id user image', populate : { path : 'user', select: 'name'}})
  .populate({path: 'collaborating',select:'_id user image', populate : { path : 'user', select: 'name'}})
  .exec(function (err, user) {
    if (err){
      message=`Opportunity is not found` 
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

const updateOpportunity = async (id, update, res) => {
  const user = await Opportunity.findByIdAndUpdate(id , update, { new: true })
  .then(function (user) {
      if (!user) { 
        message=`Unable to Update` 
        return res.status(404).json({
          message: message,
          success: false
        });
      } else {
        result = {
          user
        };

        return res.status(200).json({
          ...result,
          message: "Opportunity updated",
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

const getAll = async (req, res) => {
  const user = await Opportunity.find()
    .populate({ path :'charity', select: '_id user image', populate : { path : 'user', select: 'name'}})
    .populate({path: 'collaborating',select:'_id user image', populate : { path : 'user', select: 'name'}})
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

const updateApplications = async (id, newApplication) => {
  const user = await Opportunity.findByIdAndUpdate(id , { $push: { applications: newApplication}});
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
      message: "Opportunity updated",
      success: true
    };
};

const updateVolunteers = async (id, newVolunteer) => {
  const user = await Opportunity.findByIdAndUpdate(id , { $push: { volunteers: newVolunteer}});
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
      message: "Opportunity updated",
      success: true
    };
};

module.exports = {
  getOpportunity,
  addOpportunity,
  getAll,
  updateOpportunity,
  updateApplications,
  updateVolunteers
};
