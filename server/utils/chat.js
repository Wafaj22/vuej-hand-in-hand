const Chat = require("../models/chat");
let message = "";
let user = {};

   const getChat = async (id, res) => {
    const user = await Chat.find({ users: id })
      //.populate({path: 'users', select: 'name username'})
      .exec(function (err, user) {
        if (err){
          message = `Chat is not found`
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
          message: "Chat found",
          success: true
       });
      });
  };

  const createChat = async (userDets) => {
    try {
      // create a new user
      const newChat = new Chat({...userDets});
      await newChat.save();
      return {message: "Successfully added.", success: true, _id: newChat._id };
    } catch (err) {
      return {message: "Unable to add Chat.", success: false };
    }
  };

  const addChat = async (userDets, res) => {
    try {
      // create a new user
      const newChat = new Chat({
        ...userDets
      });
      console.log(userDets)
      await newChat.save();
  
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

  const updateChat = async (id, newMessage, res) => {
    const user = await Chat.updateOne({users: id }, { $push: { messages: newMessage }});
    if (!user) {
      message = `Unable to Update`
      return res.status(404).json({ message: message, success: false});
    }
    result = {user};
    return res.status(200).json({...result, message: "Chat updated", success: true });
  };
  
  module.exports = {updateChat, createChat, getChat, addChat};