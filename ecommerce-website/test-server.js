const request = require('supertest');
const app = require('./backend/server');
const db = require('./backend/config/db');

describe('E-Commerce API', () => {
  beforeAll(async () => {
    // Initialize test database
    await db.runQuery('DELETE FROM products');
    await db.runQuery('DELETE FROM users');
    
    // Insert test data
    await db.runQuery(
      'INSERT INTO products (name, price, description, image_url, stock) VALUES (?, ?, ?, ?, ?)',
      ['Test Product', 19.99, 'Test description', 'https://test.com/image.jpg', 10]
    );
  });

  afterAll(() => {
    db.close();
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a single product', async () => {
      const res = await request(app).get('/api/products/1');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', 'Test Product');
    });
  });
});