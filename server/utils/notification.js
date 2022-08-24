const Notification = require("../models/notification");
let message = "";

  const getNotification = async (id, res) => {
    const user = await Notification.find({ user: id })
      .exec(function (err, user) {
        if (err){
          message = `Notification is not found`
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
          message: "Notification found",
          success: true
       });
      });
  };

  const createNotification = async (userDets) => {
    try {
      // create a new user
      const newNotification = new Notification({...userDets});
      await newNotification.save();
      return {message: "Successfully added.", success: true, _id: newNotification._id };
    } catch (err) {
      return {message: "Unable to add Notification.", success: false };
    }
  };

  const updateNotification = async (id, update, res) => {
    const user = await Notification.findByIdAndUpdate(id, update);
    if (!user) {
      message = `Unable to Update`
      return res.status(404).json({ message: message, success: false});
    }
    result = {user};
    return res.status(200).json({...result, message: "Notification updated", success: true });
  };
  
  module.exports = {updateNotification, createNotification, getNotification};