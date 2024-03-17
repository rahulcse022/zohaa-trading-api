const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    portfolioAmount: {
      type: Number,
      default: 0,
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    botFuel: {
      type: Number,
      default: 0,
    },
    totalWithdrawal: {
      type: Number,
      default: 0,
    },
    lastWithdrawal: {
      type: Date,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
  },
  {
    timestamps: true,
    collection: 'user-financial-info'
  }
);

module.exports = mongoose.model("UserFinancialInfo", UserSchema);
