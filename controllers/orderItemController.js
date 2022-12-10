const db = require('../db');

const ObjectId = require('mongodb').ObjectId;

const AppError = require('../utils/appError');

const OrderItem = db.collection('OrderItems');

exports.getOrderItems = async (req, res) => {
  try {
    const sortParams = {};
    const { seller_id } = req.user;
    const { offset, sortField, order } = req.query;

    sortParams[sortField || 'price'] = parseInt(order) || -1;

    const limit = parseInt(req.query.limit) || 20;

    const skip = (parseInt(offset | 1) - 1) * limit;

    // const orders = await OrderItem.find({ seller_id })
    //   .sort(sortParams)
    //   .collation({ locale: 'en_US', numericOrdering: true })
    //   .skip(skip)
    //   .limit(limit)
    //   .toArray();

    const orders = await OrderItem.aggregate(
      [
        { $match: { seller_id } },

        { $sort: sortParams },

        { $skip: skip },

        { $limit: limit },

        {
          $lookup: {
            from: 'Products',
            localField: 'product_id',
            foreignField: 'product_id',
            as: 'category',
          },
        },

        { $unwind: '$category' },

        {
          $project: {
            _id: 0,
            id: '$_id',
            product_id: '$product_id',
            product_category_name: '$category.product_category_name',
            price: '$price',
            date: '$shipping_limit_date',
          },
        },
      ],
      { collation: { locale: 'en_US', numericOrdering: true } }
    ).toArray();

    res.status(200).json({
      status: 'success',
      results: orders.length,
      limit,
      offset: parseInt(offset),
      data: orders,
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

exports.deleteOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.findOneAndDelete({
      _id: ObjectId(req.params.id),
    });

    if (!orderItem.value)
      throw new AppError('No Order Item was found with this ID', 404);

    res.status(204).json({
      status: 'success',
      data: null,
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
