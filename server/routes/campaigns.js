const router = require('express').Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const {
  addCampaign,
  getCampaign,
  updateCampaign,
  getAll
} = require("../utils/campaign");

// Add new Campaign 
router.post("/", upload.single('image'),  async (req, res) => {
  let data = req.file ? {...req.body, image: req.file.path} : {...req.body}
  await addCampaign(data, res);
});

// get Campaign By Id
router.get("/:id", async (req, res) => {  
  await getCampaign(req.params.id , res);
});

//get all Campaigns
router.get("/", async (req, res) => {  
  await getAll({} , res);
});

//update Campaign
router.put("/:id", upload.single('image'), async (req, res) => {  
  let data = req.file ? {...req.body, image: req.file.path} : {...req.body}
  await updateCampaign(req.params.id, data , res);
});

module.exports = router;