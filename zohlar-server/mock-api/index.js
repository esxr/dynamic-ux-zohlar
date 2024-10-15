const express = require('express');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger'); // Winston logger

const app = express();
const PORT = 3000;

// Helper function to serve mock data
const sendMockData = (res, fileName, filterFn) => {
  const filePath = path.join(__dirname, '../mock-data', fileName);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      logger.error(`Error reading mock data from file: ${fileName}, Error: ${err.message}`);
      res.status(500).json({ error: 'Error reading mock data' });
    } else {
      let jsonData = JSON.parse(data);
      if (filterFn) {
        jsonData = jsonData.filter(filterFn);
      }
      logger.info(`Returning data for file: ${fileName}`);
      res.json(jsonData.length > 0 ? jsonData : { error: 'No matching data found' });
    }
  });
};

// Mock API for product details
app.get('/products/details', (req, res) => {
  const { productName } = req.query;
  logger.info(`Received request for product details with productName: ${productName}`);
  sendMockData(res, 'product-details.json', (item) => item.product_details.productName === productName);
});

// Mock API for product pricing
app.get('/products/pricing', (req, res) => {
  const { productId } = req.query;
  logger.info(`Received request for product pricing with productId: ${productId}`);
  sendMockData(res, 'pricing.json', (item) => item.pricing.productId === productId);
});

// Mock API for listing all products
app.get('/products/list', (req, res) => {
  logger.info('Received request for listing all products');
  sendMockData(res, 'product-details.json');
});

// Mock API for installation availability
app.get('/installation/availability', (req, res) => {
  logger.info('Received request for installation availability');
  sendMockData(res, 'installation-availability.json');
});

// Mock API for savings estimates
app.get('/estimate/savings', (req, res) => {
  logger.info('Received request for savings estimates');
  sendMockData(res, 'savings-estimates.json');
});

// Mock API for incentives
app.get('/incentives', (req, res) => {
  logger.info('Received request for incentives');
  sendMockData(res, 'incentives.json');
});

// Mock API for purchase confirmation
app.get('/purchase/confirmation', (req, res) => {
  logger.info('Received request for purchase confirmation');
  sendMockData(res, 'purchase-confirmation.json');
});

// Mock API for financing options
app.get('/products/financing-options', (req, res) => {
  const { productId } = req.query;
  logger.info(`Received request for financing options with productId: ${productId}`);
  sendMockData(res, 'financing-options.json', (item) => item.productId === productId);
});


// Start the mock server
app.listen(PORT, () => {
  logger.info(`Mock server running on http://localhost:${PORT}`);
});
