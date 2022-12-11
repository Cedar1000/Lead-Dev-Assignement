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

describe('User Authentication', () => {
  describe('User Login', () => {
    test('Given username was ommited', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: '', password: 'test1234' });

      expect(res.statusCode).toBe(401);
    });

    test('Given password was ommited', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'ced@ced.com', password: '' });

      expect(res.statusCode).toBe(401);
    });

    test('Given user with provided username does not exist', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'cedr@ced.com', password: 'test1234' });

      expect(res.statusCode).toBe(401);
    });

    test('Given passwod is incorrect', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ username: 'ced@ced.com', password: 'test12345' });

      expect(res.statusCode).toBe(401);
    });

    test('Given passwod and username are correct', async () => {
      const res = await request(app).post('/api/v1/auth/login').send(payload);

      expect(res.statusCode).toBe(200);
    });
  });

  describe('Seller Account', () => {
    describe('given the seller is not logged in', () => {
      test('should return 401', async () => {
        const res = await request(app).patch(`/api/v1/auth/account`).send({});

        expect(res.statusCode).toBe(401);
      });
    });

    describe('given the seller is logged in', () => {
      test('should return 401', async () => {
        const res = await request(app)
          .patch(`/api/v1/auth/account`)
          .set('Authorization', `Bearer ${token}`)
          .send({});

        expect(res.statusCode).toBe(200);
      });
    });
  });
});
