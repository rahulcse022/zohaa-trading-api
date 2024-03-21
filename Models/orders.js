const mongoose = require('mongoose');

const OrdersSchema = new mongoose.Schema(
  {
    // position: { type: String, enum: ["Buy", "Sell"] },
    position: String,
    shortId: { type:String, unique: true },
    volume: Number,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrdersSchema);
