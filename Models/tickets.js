const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema(
  {
    description: String,
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

module.exports = mongoose.model("Ticket", TicketSchema);
