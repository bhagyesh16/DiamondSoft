//flrn
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
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

// Define the Flrn model
const Flrn = sequelize.define('flrn', {
  flrn_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  flrn_name: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'flrn',
  timestamps: false, // Assuming your table doesn't have timestamps
});

// Insert new flrn in the database
router.post('/flrn', async (req, res) => {
  try {
    const { flrn_id, flrn_name } = req.body;
    const newFlrn = await Flrn.create({ flrn_id, flrn_name });
    res.json(newFlrn);
  } catch (error) {
    console.error('Error adding flrn:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all data of flrn from the database
router.get('/flrn', async (req, res) => {
  try {
    const flrn = await Flrn.findAll();
    res.json(flrn);
  } catch (error) {
    console.error('Error fetching flrn:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update flrn by ID
router.put('/flrn/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { flrn_name } = req.body;

    const updatedFlrn = await Flrn.update(
      { flrn_name },
      { where: { flrn_id: id } }
    );

    res.json(updatedFlrn);
  } catch (error) {
    console.error('Error updating flrn:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete flrn by ID
router.delete('/flrn/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const deletedFlrn = await Flrn.destroy({ where: { flrn_id: id } });

    res.json({ message: 'Flrn deleted successfully' });
  } catch (error) {
    console.error('Error deleting flrn:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
