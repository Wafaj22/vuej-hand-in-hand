const Charity = require("../models/charity");

let message = "";
let user = {};

const addCharity = async (userDets, res) => {
  try {
    // create a new user
    const newCharity = new Charity({
      ...userDets
    });
    console.log(userDets)
    user = await newCharity.save();

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

const getCharityById = async (id, res) => {
  const user = await Charity.findOne({ user: id })
    .populate({path: 'user', select: 'name username'})
    .populate({path: 'campaigns', populate : { path : 'donations', select: 'amount createdAt method'}})
    .populate({path: 'opportunities', populate : { path : 'volunteers'}, populate: {path: 'applications'}})
    .populate({path: 'supporter', select:'image about city skills causes user', populate : { path : 'user', select: 'username name'}})
    .populate({path: 'connection', select:'image mission city cause user', populate : { path : 'user', select: 'username name'}})
    .exec(function (err, user) {
      if (err){
      	message = `Charity is not found`
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
        message: "Charity found",
        success: true
     });
    });
};

const updateCharity = async (id, update, res) => {
  const user = await Charity.findOneAndUpdate({ user: id }, update, { new: true })
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
          message: "Charity profile updated",
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
  const user = await Charity.find()
    .populate('user', 'name')
    .populate({path:'campaigns', populate: {path: 'donations', select:'amount'}})
    .populate('opportunities')
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
  getCharityById,
  addCharity,
  getAll,
  updateCharity
};
