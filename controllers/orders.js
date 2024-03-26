const Order = require("../Models/orders");
const {  getTimeDateFilters } = require("../utils/utils");
const shortid = require('shortid');
const { updateFuelAmount } = require("./finances");
const Finance = require("../Models/finances");

exports.getUserOrders = async (req, res) => {
  try {
    const { position, filterBy, pageSize=10,page=1 } = req.query;
    console.log(filterBy, 'ff')
    console.log(position, filterBy);
    const findData = {
      userId: req.user.userId,
    };
    if (position) {
      findData.position = position;
    }
    const pageNumber = parseInt(page) || 1;

    const limit = parseInt(pageSize) || 10; // Default page size
    const skipValue = (pageNumber - 1) * limit;

    const filters = getTimeDateFilters(filterBy);

    const orders = await Order.find({
      ...filters,
      ...findData
    }).limit(limit)
    .sort({ _id: -1 }).skip(skipValue).exec()
    ;
    console.log(orders, 'Orders', filters, ':::filters')
    if (orders.length > 0) {
      return res.json({data:orders, message:'Trades fetched',
        totalPages: Math.floor(await Order.countDocuments(filters) / limit) 
    });
    } else {
      return res.status(404).json({
        message: "No orders found",
        data: [],
        totalPages: Math.floor(await Order.countDocuments(filters) / limit) 
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
exports.getUserHistory = async () => {};