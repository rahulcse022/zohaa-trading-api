exports.getUserFinancialInfo = async (req, res) => {
  try {
    res.json({
      portfolioAmount: "5",
      walletBalance: "20",
      botFuel: 10,
      totalWithdrawal: 10,
      lastWithdrawal: "2024-03-16T05:56:34.924Z",
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
