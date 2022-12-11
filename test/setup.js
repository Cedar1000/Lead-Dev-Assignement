const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

const express = require('express');

require('dotenv').config();

const db = require('../db');

const app = express();

app.use(express.json());

//ROUTES
const userRoutes = require('../routes/authRoutes');
const orderItemRoutes = require('../routes/orderItemRoutes');

// Routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/order_items', orderItemRoutes);

let mongod;

beforeAll(async () => {
  // This will create an new instance of "MongoMemoryServer" and automatically start it
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  const client = new MongoClient(uri);

  // Database Name
  const dbName = 'testDB';

  client
    .connect()
    .then(() => console.log('Connected successfully to test DB!'));

  client.db(dbName);
});

afterAll(async () => await mongod.stop());

module.exports = app;
