const router = require('express').Router();

const {
  addDonation,
  getDonation,
  updateDonation,
  getAll
} = require("../utils/donation");

// Add new Donation 
router.post("/", async (req, res) => {
  await addDonation(req.body, res);
});

// get Donation By Id
router.get("/:id", async (req, res) => {
  await getDonation(req.params.id, res);
});

//get all Donations
router.get("/", async (req, res) => {
  await getAll({}, res);
});

//update Donation
router.put("/:id", async (req, res) => {
  await updateDonation(req.params.id, req.body, res);
});


module.exports = router;
