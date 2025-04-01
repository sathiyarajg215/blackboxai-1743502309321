const db = require('../config/db');

// Product model
const Product = {
  // Create a new product
  create: async (productData) => {
    const { name, price, description, category, image_url, stock } = productData;
    const result = await db.runQuery(
      'INSERT INTO products (name, price, description, category, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [name, price, description, category, image_url, stock]
    );
    return result.lastID;
  },

  // Get all products
  findAll: async (filters = {}) => {
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    // Apply filters
    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }
    if (filters.featured) {
      query += ' AND stock > 0 ORDER BY RANDOM() LIMIT 3';
    }
    if (filters.search) {
      query += ' AND name LIKE ?';
      params.push(`%${filters.search}%`);
    }

    return await db.getRows(query, params);
  },

  // Get product by ID
  findById: async (id) => {
    return await db.getRow('SELECT * FROM products WHERE id = ?', [id]);
  },

  // Update product
  update: async (id, productData) => {
    const { name, price, description, category, image_url, stock } = productData;
    await db.runQuery(
      'UPDATE products SET name = ?, price = ?, description = ?, category = ?, image_url = ?, stock = ? WHERE id = ?',
      [name, price, description, category, image_url, stock, id]
    );
    return true;
  },

  // Delete product
  delete: async (id) => {
    await db.runQuery('DELETE FROM products WHERE id = ?', [id]);
    return true;
  },

  // Get products by category
  findByCategory: async (category) => {
    return await db.getRows('SELECT * FROM products WHERE category = ?', [category]);
  },

  // Get featured products
  findFeatured: async () => {
    return await db.getRows('SELECT * FROM products WHERE stock > 0 ORDER BY RANDOM() LIMIT 3');
  }
};

module.exports = Product;