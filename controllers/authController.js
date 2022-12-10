const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const ObjectId = require('mongodb').ObjectId;

const AppError = require('../utils/appError');

const db = require('../db');
const signToken = require('../utils/signToken');

const Seller = db.collection('Sellers');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username && password) {
      // Find Seller From Database
      const seller = await Seller.findOne({ seller_id: username });

      // Checks if seller does not exists in db and password is incorrect
      if (!seller || password !== seller.seller_zip_code_prefix) {
        throw new AppError('Usernamme or Password is incorrect', 401);
      }

      // Sign JWT
      const token = signToken(seller._id);

      res.status(200).json({
        status: 'success',
        token,
        seller,
      });
    } else {
      throw new AppError('Please provide username and password', 401);
    }
  } catch (error) {
    const { statusCode, message } = error;
    res.status(statusCode).json({
      staus: 'fail',
      message,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    //1) Getting token and check if its there

    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    //2) Validate token
    if (!token) {
      throw new AppError(
        'You are not logged in! Please login to get access',
        401
      );
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3) Check if user still exists
    const currentUser = await Seller.findOne({ _id: ObjectId(decoded.id) });
    if (!currentUser) {
      throw new AppError(
        'The user belonging to the token no longer exists.',
        401
      );
    }

    // GRANT ACCESS TO ROUTE
    req.user = currentUser;

    next();
  } catch (error) {
    console.log(error);
    const { statusCode, message } = error;
    res.status(statusCode || 500).json({
      staus: 'fail',
      message,
    });
  }
};
