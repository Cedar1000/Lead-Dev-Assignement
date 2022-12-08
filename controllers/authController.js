const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');

const db = require('../db');

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (username && password) {
      // Find User From Database
      const user = await User.findOne({ email });

      // Checks if user does not exists in db and password is incorrect
      if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Email or Password is incorrect', 401));
      }

      if (!user.active)
        return next(
          new AppError('You have been de-activated and hence cannot login', 401)
        );

      // Send JWT
      createAndSendToken(user, 200, res, next);
    } else {
      throw new AppError('Please provide email and password', 401);
    }
  } catch (error) {
    console.log(error);
    const { statusCode, message } = error;
    res.status(statusCode).json({
      staus: 'fail',
      message,
    });
  }
};
