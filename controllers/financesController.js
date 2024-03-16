const FinancesModel = require("../Models/financesModel");

exports.getUserFinancialInfo = async (req, res) => {
  try {
    const financialInfo = await FinancesModel.findOne({
      userId: req.user.userId,
    });
    if (financialInfo) {
      return res.json(financialInfo);
    } else {
      return res.status(404).json({
        message: "Details not found for this user",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
exports.updateUserFinancialIndo = async (req, res) => {
  const info = new FinancesModel({
    ...req.body,
    userId: req.user.userId,
  });
};
