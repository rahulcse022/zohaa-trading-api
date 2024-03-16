const jwt = require("jsonwebtoken");
var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
require("dotenv").config();
// ---------------Controllers--------

const UserController = require("../controllers/userController");
const middlewares = require("../middlewares/middlewares");
const User = require("../Models/UserModel");
const { getUserFinancialInfo } = require("../controllers/financesController");

router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

router.post("/signup", middlewares.validateSignupData, UserController.signup);
router.post("/login", middlewares.validateLoginData, UserController.login);
router.get("/users", middlewares.verifyToken, UserController.getUserProfile);
router.patch(
  "/users",
  middlewares.verifyToken,
  middlewares.validate(middlewares.validateUpdateFields),
  UserController.updateUserProfile
);
router.post(
  "/forgot-password",
  middlewares.validateEmail,
  UserController.forgotPassword
);
router.post(
  "/reset-password",
  middlewares.validateResetPasswordData,
  UserController.resetPassword
);
router.post(
  "/verify-update-otp",
  middlewares.verifyToken,
  middlewares.validate(middlewares.verifyUpdateOTP),
  UserController.verifyUpdateOTP
);
router.get(
  "/users/financial-info",
  middlewares.verifyToken,
  getUserFinancialInfo
);

// router.get("/getuserdetails", async (req, res) => {
//   const find = await User.findOne({ email: req.query.email });
//   res.send(find);
// });

function ensureWebToken(req, res, next) {
  const x_access_token = req.headers["authorization"];
  if (typeof x_access_token !== undefined) {
    req.token = x_access_token;
    verifyJWT(req, res, next);
  } else {
    res.sendStatus(403);
  }
}

async function verifyJWT(req, res, next) {
  jwt.verify(req.token, config.JWT_SECRET_KEY, async function (err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      const _data = await jwt.decode(req.token, {
        complete: true,
        json: true,
      });
      req.user = _data["payload"];
      next();
    }
  });
}

module.exports.routes = router;
