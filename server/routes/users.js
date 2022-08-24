const router = require('express').Router();

// Bring in the User Registration function
const {
  userAuth,
  userLogin,
  checkRole,
  userRegister,
  serializeUser
} = require("../utils/Auth");

// Users Registeration Route
router.post("/register-user", async (req, res) => {
  await userRegister(req.body, "user", res);
});

// Charity Registration Route
router.post("/register-charity", async (req, res) => {
  await userRegister(req.body, "charity", res);
});

// Users Login Route
router.post("/login-user", async (req, res) => {  
  await userLogin(req.body, "user", res);
});

// Charity Login Route
router.post("/login-charity", async (req, res) => {
  await userLogin(req.body, "charity", res);
});

// Profile Route
router.get("/profile", userAuth, async (req, res) => {
  return res.json(serializeUser(req.user));
});

// Users Protected Route
router.get(
  "/user-protectd",
  userAuth,
  checkRole(["user"]),
  async (req, res) => {
    return res.json("Hello User");
  }
);

// Charity Protected Route
router.get(
  "/charity-protectd",
  userAuth,
  checkRole(["charity"]),
  async (req, res) => {
    return res.json("Hello Charity");
  }
);

module.exports = router;
