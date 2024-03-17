const Ticket = require("../Models/tickets");

exports.getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({
      userId: req.user.userId,
    });
    if (tickets.length > 0) {
      return res.json(tickets);
    } else {
      return res.status(404).json({
        message: "No tickets found",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
exports.createTicket = async (req, res) => {
  try{
    const { description } = req.body;
    const ticket = new Ticket({ description, userId: req.user.userId });
    await ticket.save();
    return res.json({
      message: "Ticket created successfully",
      data: ticket,
    });
  }catch(error){
    res.status(500).json({ message: error.message });
  }

};