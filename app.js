const express = require('express');
const cors = require('cors');

const app = express();

//ROUTES
const userRoutes = require('./routes/authRoutes');

app.use(cors());

app.use(express.json());

// Routes
app.use('/api/v1/auth', userRoutes);

module.exports = app;
