const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require("passport");
const mongoose = require('mongoose');
const { success, error } = require('consola');

// Bring in the app constants
const { DB, PORT } = require('./config');

//Initialize the app
const app = express();
const server = require('http').createServer(app);
const io = module.exports.io = require('socket.io')(server,{
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
mongoose.set('useFindAndModify', false);


// Middlewares
app.use(bodyParser.json({verify: (req, res, buf, encoding)=> {
  if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
  }
}, type: 'application/json' })); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use(passport.initialize());
require("./middlewares/passport")(passport);
app.use('/uploads', express.static('uploads'));

//Routes
app.use('/users', require('./routes/users'));
app.use('/chat', require('./routes/chat'));
app.use('/notification', require('./routes/notifications'));
app.use('/campaigns', require('./routes/campaigns'));
app.use('/opportunities', require('./routes/opportunities'));
app.use('/charities', require('./routes/charities'));
app.use('/volunteers', require('./routes/volunteers'));
app.use('/applications', require('./routes/applications'));
app.use('/donations', require('./routes/donations'));
app.use('/pay', require('./stripe'))

//Connection with DB
const startApp = async () => {
  try {
    // Connection With DB
    await mongoose.connect(DB, {
      useFindAndModify: true,
      useUnifiedTopology: true,
      useNewUrlParser: true
    });

    success({
      message: `Successfully connected with the Database \n${DB}`,
      badge: true
    });

    // Start Listenting for the server on PORT
    server.listen(PORT, () =>
      success({ message: `Server started on PORT ${PORT}`, badge: true })
    );
            
  } catch (err) {
    error({
      message: `Unable to connect with Database \n${err}`,
      badge: true
    });
    startApp();
  }
};

startApp(); 
       
//Socket
io.on('connection', require('./chat'));
