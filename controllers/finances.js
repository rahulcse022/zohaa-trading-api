const FinancesModel = require("../Models/finances");

exports.getUserFinancialInfo = async (req, res) => {
  try {
    const financialInfo = await FinancesModel.findOne({
      userId: req.user.userId,
    });
    if (financialInfo) {
      return res.json({ data: financialInfo });
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
  try{
    const info = await FinancesModel.findOneAndUpdate(
      {
        userId: req.user.userId,
      },
      req.body,
      { new: true }
    );
    return res.json({
      message: "Financial details updated successfully",
      data: info,
    });
  }catch(error){
    res.status(500).json({ message: error.message });
  }

};
exports.updateFuelAmount = async (req, res) => {
  try {
    const info = await FinancesModel.findOne({
      userId: req.user.userId,
    });
    info.botFuel += parseInt(req.body.fueldByAmount);
    console.log(info,'Inffooo')
    await info.save();
    return res.json({
      message: "Financial details updated successfully",
      data: info,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.fundWallet = async (req, res) => {
  try {
    console.log(req.body, '>>>')
   const info = await FinancesModel.findOneAndUpdate(
      { userId: req.user.userId },
      { $inc: { walletBalance: parseFloat(req.body.walletFundedByAmount) } }, // Corrected syntax here
      { new: true },
    );
    console.log(info, 'INFOOOOOOOOo`')
    return res.json({
      message: "Financial details updated successfully",
      data: info,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.withdrawWallet = async (req, res) => {
  try {
    const decrementBy = parseFloat(req.body.walletFundedByAmount);
    const info = await FinancesModel.findOneAndUpdate(
      { userId: req.user.userId },
      { $inc: { walletBalance: -decrementBy, totalWithdrawal: decrementBy } }, // Corrected syntax here
      { new: true }
    );
    return res.json({
      message: "Financial details updated successfully",
      data: info,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};