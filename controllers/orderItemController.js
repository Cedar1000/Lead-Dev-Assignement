const db = require('../db');

const OrderItem = db.collection('OrderItems');

exports.getOrderItems = async (req, res) => {
  try {
    const sortParams = {};
    const { seller_id } = req.user;
    const { page, sortField, order } = req.query;

    sortParams[sortField || price] = order || -1;

    console.log(sortParams);

    const limit = parseInt(req.query.limit) || 20;

    const skip = (parseInt(page) - 1) * limit;

    const orders = await OrderItem.find({ seller_id })
      .sort(sortParams)
      .collation({ locale: 'en_US', numericOrdering: true })
      .limit(5)
      .skip(skip)
      .limit(limit)
      .toArray();

    res.status(200).json({
      status: 'success',
      results: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    const { statusCode, message } = error;
    res.status(statusCode || 500).json({
      staus: 'fail',
      message,
    });
  }
};
