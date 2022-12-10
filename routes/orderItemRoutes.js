const { Router } = require('express');

const { getOrderItems } = require('../controllers/orderItemController');

const { protect } = require('../controllers/authController');

const router = Router();

router.get('/', protect, getOrderItems);

module.exports = router;
