const Order = require("../Models/orders");
const { getCurrentDateFilter } = require("../utils/utils");

exports.getUserOrders = async (req, res) => {
  try {
    const { position, filterBy } = req.query;
    console.log(filterBy, 'ff')
    console.log(position, filterBy);
    const findData = {
      userId: req.user.userId,
    };
    if (position) {
      findData.position = position;
    }
    const orders = await Order.find({
      ...getCurrentDateFilter(filterBy),
      ...findData
    });
    if (orders.length > 0) {
      return res.json({data:orders, message:'Trades fetched'});
    } else {
      return res.status(404).json({
        message: "No orders found",
        data: []
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
exports.createOrder = async (req, res) => {
  try {
    const { position, volume } = req.body;
    const order = new Order({ position, volume, userId: req.user.userId });
    await order.save();
    return res.json({
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
