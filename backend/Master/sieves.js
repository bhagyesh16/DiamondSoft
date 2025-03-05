//sieves
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

// Define the Sieves model
const Sieves = sequelize.define('sieves', {
  sieves_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  sieves_name: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'sieves',
  timestamps: false, // Assuming your table doesn't have timestamps
});

// Insert new sieves in the database
router.post('/sieves', async (req, res) => {
  try {
    const { sieves_id, sieves_name } = req.body;
    const newSieves = await Sieves.create({ sieves_id, sieves_name });
    res.json(newSieves);
  }
  catch (error) {
    console.error('Error adding sieves:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all data of sieves from the database
router.get('/sieves', async (req, res) => {
  try {
    const sieves = await Sieves.findAll();
    res.json(sieves);
  } catch (error) {
    console.error('Error fetching sieves:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update sieves by ID
router.put('/sieves/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { sieves_name } = req.body;

    const updatedSieves = await Sieves.update(
      { sieves_name },
      { where: { sieves_id: id } }
    );

    res.json(updatedSieves);
  } catch (error) {
    console.error('Error updating sieves:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete sieves by ID
router.delete('/sieves/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const deletedSieves = await Sieves.destroy({ where: { sieves_id: id } });

    res.json({ message: 'Sieves deleted successfully' });
  } catch (error) {
    console.error('Error deleting sieves:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
