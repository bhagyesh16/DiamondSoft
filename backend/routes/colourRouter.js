const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');  // Import jwt module

const router = express.Router();

// Sequelize configuration
const sequelize = new Sequelize('DiamondSoft', 'iits', 'iits123', {
  host: 'localhost',
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: true,
    },
  },
});

// Define the Colour model
const Colour = sequelize.define('Colour', {
  colour_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  colour_name: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'colour',
  timestamps: false, // Assuming your table doesn't have timestamps
});

// Mockup data for demonstration
const dropdownData = [
  { id: 1, label: 'Red' },
  { id: 2, label: 'Blue' },
  // Add more data as needed
];

// Bind colour
router.get('/dropdownData', async (req, res) => {
  try {
    const token = req.headers['authorization'];

    if (!token) {
      // Send a 401 Unauthorized response if the token is missing
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const skey = 'your_secret_key';  // Replace with your secret key

    jwt.verify(token, skey, async (err, user) => {
      if (err) {
        // Send a 403 Forbidden response if the token is invalid
        return res.status(403).json({ error: 'Invalid token' });
      }

      res.json(dropdownData);
    });
  } catch (error) {
    console.error('Error fetching dropdown data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
