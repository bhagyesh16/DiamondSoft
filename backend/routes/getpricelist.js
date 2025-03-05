const express = require('express');
const router = express.Router();
const { PricelistWithDetails } = require('../models/modelpricelist');

router.get('/details', async (req, res) => {
  try {
    const pricelistDetails = await PricelistWithDetails.getPricelistWithDetails();

    console.log('Pricelist Details:', pricelistDetails); // Add this line for debugging

    if (pricelistDetails && pricelistDetails.length > 0) {
      res.json(pricelistDetails);
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (error) {
    console.error('Error executing stored procedure:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
