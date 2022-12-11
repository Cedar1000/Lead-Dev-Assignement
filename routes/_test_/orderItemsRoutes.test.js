const request = require('supertest');
const app = require('../../test/setup');

const payload = require('../../test/payloads/user.payload');

const db = require('../../db');

const signToken = require('../../utils/signToken');

let token;

beforeAll(async () => {
  const user = await db.collection('Sellers').findOne({
    seller_id: payload.username,
    seller_zip_code_prefix: payload.password,
  });

  token = signToken(user._id);
});

describe('Order Items', () => {
  describe('Get Order Items', () => {
    describe('given the seller is not logged in', () => {
      test('should return 401', async () => {
        const res = await request(app).get('/api/v1/order_items').send({});

        expect(res.statusCode).toBe(401);
      });
    });

    describe('given the seller is logged in', () => {
      test('should return 401', async () => {
        const res = await request(app)
          .get(`/api/v1/order_items`)
          .set('Authorization', `Bearer ${token}`)
          .send({});

        expect(res.statusCode).toBe(200);
      });
    });
  });

  describe('Delete Order Items', () => {
    describe('given the seller is not logged in', () => {
      test('should return 401', async () => {
        const res = await request(app)
          .delete('/api/v1/order_items/33838')
          .send({});

        expect(res.statusCode).toBe(401);
      });
    });

    describe('given the seller is logged in', () => {
      test('should return 401', async () => {
        const orderItem = await db.collection('OrderItems').findOne({});
        const res = await request(app)
          .delete(`/api/v1/order_items/${orderItem._id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({});

        expect(res.statusCode).toBe(204);
      });
    });
  });
});
