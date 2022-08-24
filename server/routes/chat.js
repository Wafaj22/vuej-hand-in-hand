const router = require('express').Router();

const {updateChat, addChat, getChat} = require("../utils/chat");

// Add new Chat 
router.post("/", async (req, res) => {
  await addChat(req.body, res);
});

// get Chat By Id
router.get("/:id", async (req, res) => {
  await getChat(req.params.id, res);
});

//update Chat
router.put("/:id", async (req, res) => {
  await updateChat(req.params.id, req.body, res);
});


module.exports = router;
