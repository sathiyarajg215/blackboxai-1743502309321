const Product = require('../models/productModel');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll(req.query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.findFeatured();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create product (admin only)
exports.createProduct = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const productId = await Product.create(req.body);
    res.status(201).json({ id: productId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product (admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await Product.update(req.params.id, req.body);
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete product (admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await Product.delete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};