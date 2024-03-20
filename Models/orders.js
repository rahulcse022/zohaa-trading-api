const mongoose = require('mongoose');

const OrdersSchema = new mongoose.Schema(
  {
    position: { type: String, enum: ["Buy", "Sell"] },
    volume: Number,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isPro: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrdersSchema);
