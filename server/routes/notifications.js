const router = require('express').Router();

const {updateNotification, createNotification, getNotification} = require("../utils/notification");

// Add new Notification 
router.post("/", async (req, res) => {
  await createNotification(req.body, res);
});

// get Notification By Id
router.get("/:id", async (req, res) => {
  await getNotification(req.params.id, res);
});

//update Notification
router.put("/:id", async (req, res) => {
  await updateNotification(req.params.id, req.body, res);
});


module.exports = router;
