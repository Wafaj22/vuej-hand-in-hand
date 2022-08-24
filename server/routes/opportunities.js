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
  addOpportunity,
  getOpportunity,
  updateOpportunity,
  getAll, 
  updateVolunteers
} = require("../utils/opportunity");

const {
  updateVolunteerOpportunities
} = require("../utils/volunteer");

// Add new Opportunity 
router.post("/", upload.single('image'),  async (req, res) => {
  let data = req.file ? {...req.body, image: req.file.path} : {...req.body}
  await addOpportunity(data, res);
});

// get Opportunity By Id
router.get("/:id", async (req, res) => {  
  await getOpportunity(req.params.id , res);
});

//get all Opportunitys
router.get("/", async (req, res) => {  
  await getAll({} , res);
});

//update Opportunity
router.put("/:id", upload.single('image'), async (req, res) => {  
  let data = req.file ? {...req.body, image: req.file.path} : {...req.body}
  await updateOpportunity(req.params.id, data , res);
});

//update Opportunity
router.put("/:id/approve", async (req, res) => {  
  await updateVolunteers(req.params.id, req.body.applicant).then((response)=>{
    updateVolunteerOpportunities( req.body.applicant, req.params.id).then((response) => {
      console.log('volunteer updated')
      return res.status(200).json({ message: 'Opportunity update', success: true});   

    }).catch((err)=>{
      console.log('failed to update volunteer', err)
      return res.status(404).json({ message: err, success: false});
    }) 
  }).catch((error)=> {
    console.log('error', error)
    return res.status(404).json({ message: error, success: false});
  })
});

module.exports = router;