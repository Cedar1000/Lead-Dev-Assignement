const { Router } = require('express');

const {
  getOrderItems,
  deleteOrderItem,
} = require('../controllers/orderItemController');

const { protect } = require('../controllers/authController');

const router = Router();

router.get('/', protect, getOrderItems);

router.delete('/:id', protect, deleteOrderItem);

module.exports = router;
