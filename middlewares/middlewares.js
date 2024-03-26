const jwt = require("jsonwebtoken");
const { body, validationResult, checkExact, oneOf } = require("express-validator");

const middlewares = {};
middlewares.verifyUpdateOTP = [
  body("otp").notEmpty().withMessage('Please send otp')
]
middlewares.fuelBot = [
  body("fueldByAmount").notEmpty().withMessage("Please send bot fueld amount."),
];
middlewares.fundWallet = [
  body("walletFundedByAmount")
    .notEmpty()
    .withMessage("Please send funded amount."),
];
middlewares.createTicket = [
  body("description")
    .notEmpty()
    .withMessage("Please send ticket description"),
];
middlewares.createOrder = [
  body("position")
    .notEmpty()
    .withMessage("Please send order position"),
  body("volume")
    .notEmpty()
    .withMessage("Please send volume")
    .isNumeric()
    .withMessage("Please send a numeric value for volume"),
];
middlewares.updateFinancialInfo = [
  body("portfolioAmount")
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage("Please send a valid amount."),
    body("walletBalance")
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage("Please send a valid amount."),
    body("botFuel")
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage("Please send a valid amount."),
    body("totalWithdrawal")
      .optional()
      .notEmpty()
      .isNumeric()
      .withMessage("Please send a valid amount."),
  oneOf([
    body("portfolioAmount").exists(),
    body("walletBalance").exists(),
    body("botFuel").exists(),
    body("totalWithdrawal").exists(),
  ], {
    message: 'Please send valid data to update.'
  }),
  checkExact(),
];
middlewares.validateSignupData = [
  body("fullName").notEmpty().withMessage("Full name is required"),
  // body("lastName").notEmpty().withMessage("Last name is required"),
  body("userName").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
    .withMessage("Passwords must match"),
  body("address").notEmpty().withMessage("Address is required"),
  body("phoneNumber").notEmpty().withMessage("Phone number is required"),
];

middlewares.validateLoginData = [
  body("userName").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

middlewares.validateEmail = [
  body("email").isEmail().withMessage("Invalid email format"),
];

middlewares.validateResetPasswordData = [
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Passwords must match");
    }
    return true;
  }),
];
middlewares.validateUpdateFields = [
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("fullName")
    .optional()
    .notEmpty()
    .withMessage("Full name cannot be updated as empty value"),
  body("phoneNumber")
    .optional()
    .notEmpty()
    .withMessage("Phone number cannot be updated as empty value"),
  body("password")
    .optional()
    .notEmpty()
    .withMessage("Password cannot be updated as empty value"),
    body("address")
    .optional()
    .notEmpty()
    .withMessage("Address cannot be updated as empty value"),
  oneOf(
    [
      body("email").exists(),
      body("fullName").exists(),
      body("address").exists(),
      body("phoneNumber").exists(),
      body("password").exists(),
    ],
    {
      message:
        "At least one of email, firstName, lastName, phoneNumber or password must be provided",
    }
  ),
  checkExact(),
];
// Middleware function to verify JWT tokens
middlewares.verifyToken = (req, res, next) => {
  // Get the token from the request headers, query parameters, or cookies (whichever you prefer)
  const token =
    req.headers.authorization || req.query?.token || req.cookies?.token;

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }
  console.log(token, 'Token')
  // Verify the token
  jwt.verify(
    token.replace("Bearer ", ""),
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Token authentication failed or has expired!" });
      }

      // If the token is valid, attach the decoded payload to the request object for later use
      req.user = decoded;

      // Continue to the next middleware or route handler
      next();
    }
  );
};
// sequential processing, stops running validations chain if the previous one fails.
middlewares.validate = function (validations) {
  console.log('Calledddd')
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};
module.exports = middlewares;
