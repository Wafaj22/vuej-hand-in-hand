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
  //addApplication,
  getApplication,
  updateApplication,
  getAll, 
  createApplication
} = require("../utils/application");

const {updateVolunteerApplication} = require("../utils/volunteer");
const {updateApplications} = require("../utils/opportunity");
const {createNotification} = require("../utils/notification");

// Add new Application 
router.post("/", async (req, res) => { 
  await createApplication(req.body.application).then((response)=>{
    updateVolunteerApplication( req.body.application.applicant, response._id).then(() => {
      console.log('volunteer updated')
      updateApplications( req.body.application.event, response._id).then(()=>{
        console.log('opp update')
        createNotification(req.body.notification).then(()=>{
          console.log('created Notification')
          return res.status(200).json({ message: 'Opportunity update', success: true});      
        })
      }).catch((err)=>{
        console.log('failed to update opp', err)
        return res.status(404).json({ message: err, success: false});      
      })  
    }).catch((err)=>{
      console.log('failed to update volunteer', err)
      return res.status(404).json({ message: err, success: false});
    }) 
  }).catch((error)=> {
    console.log('error', error)
    return res.status(404).json({ message: error, success: false});
  })
});

// get Application By Id
router.get("/:id", async (req, res) => {  
  await getApplication(req.params.id , res);
});

//get all Applications
router.get("/", async (req, res) => {  
  await getAll({} , res);
});

//update Application
router.put("/:id", async (req, res) => {  
  await updateApplication(req.params.id, req.body , res);
});

module.exports = router;
