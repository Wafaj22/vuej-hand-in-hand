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
  addCharity,
  getCharityById,
  updateCharity,
  getAll
} = require("../utils/charity");

// Create Charity profile
router.post("/", upload.single('image'), async (req, res) => {
  let data = req.file ? {...req.body, image: req.file.path} : {...req.body}
  await addCharity(data, res);
});

// get Charity By Id
router.get("/:id", async (req, res) => {  
  await getCharityById(req.params.id , res);
});

//get all Charities
router.get("/", async (req, res) => { 
  await getAll({} , res);
});

//update Charity
router.put("/:id",upload.single('image'), async (req, res) => {  
  let data = req.file ? {...req.body, image: req.file.path} : {...req.body}
  await updateCharity(req.params.id, data , res);
});

//add supporting
router.put("/:id",upload.single('image'), async (req, res) => {  
  let data = req.file ? {...req.body, image: req.file.path} : {...req.body}
  await updateCharity(req.params.id, data , res);
});

module.exports = router;