const { Router } = require('express');

const {
  getOrderItems,
  deleteOrderItem,
  getOrderItem,
  updateOrderItem,
} = require('../controllers/orderItemController');

const { protect } = require('../controllers/authController');

const router = Router();

router.get('/', protect, getOrderItems);

router
  .route('/:id')
  .get(getOrderItem)
  .patch(updateOrderItem)
  .delete(protect, deleteOrderItem);

module.exports = router;
