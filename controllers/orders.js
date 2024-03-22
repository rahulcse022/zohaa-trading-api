const Order = require("../Models/orders");
const {  getTimeDateFilters } = require("../utils/utils");
const shortid = require('shortid');

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
