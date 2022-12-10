const express = require('express');
const cors = require('cors');

const app = express();

//ROUTES
const userRoutes = require('./routes/authRoutes');
const orderItemRoutes = require('./routes/orderItemRoutes');

app.use(cors());

app.use(express.json());

// Routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/order_items', orderItemRoutes);

module.exports = app;
