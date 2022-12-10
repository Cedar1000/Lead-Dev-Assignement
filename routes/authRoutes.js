const { Router } = require('express');

const {
  login,
  updateAccount,
  protect,
} = require('../controllers/authController');

const router = Router();

router.post('/login', login);

router.patch('/account', protect, updateAccount);

module.exports = router;
