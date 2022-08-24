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
  addVolunteer,
  getVolunteer,
  updateVolunteer,
  getAll
} = require("../utils/volunteer");

// Create volunteer profile
router.post("/", upload.single('image'), async (req, res) => {
  let data = req.file ? {...req.body, image: req.file.path} : {...req.body}
  await addVolunteer(data, res);
});

// get Volunteer By Id
router.get("/:id", async (req, res) => {  
  await getVolunteer(req.params.id , res);
});

//get all volunteers
router.get("/", async (req, res) => {  
  console.log('getting req body', req)
  console.log('res body', res)
  await getAll({} , res);
});

//update volunteer
router.put("/:id", upload.single('image'), async (req, res) => {
  let data = req.file ? {...req.body, image: req.file.path} : {...req.body}
  await updateVolunteer(req.params.id, data , res);
});

module.exports = router;
