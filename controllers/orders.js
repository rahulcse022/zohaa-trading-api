const Order = require("../Models/orders");
const {  getTimeDateFilters } = require("../utils/utils");
const shortid = require('shortid');
const { updateFuelAmount } = require("./finances");
const Finance = require("../Models/finances");

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
      ...getTimeDateFilters(filterBy),
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
    console.log('Request received')
    const { position, volume } = req.body;
    let shortId;
    while(!shortId){
      shortId = Math.floor(100000 + Math.random() * 900000);
      const isShortId = await Order.findOne({ shortId });
      if(isShortId){
        shortId = "";
      }
    }
    const order = new Order({ position, volume, userId: req.user.userId, shortId });
    const decrementBy = parseFloat(volume)
    await Finance.findOneAndUpdate(
      { userId: req.user.userId },
      { $inc: { botFuel: -decrementBy } } // Corrected syntax here
    );
    await order.save();
    console.log('Success!', order)
    return res.json({
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.log('Error!', error)

    return res.status(500).json({ message: error.message });
  }
};
