//cut
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

// Define the Cut model
const Cut = sequelize.define('cut', {
  cut_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  cut_name: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'cut',
  timestamps: false, // Assuming your table doesn't have timestamps
});

// Insert new cut in the database
router.post('/cut', async (req, res) => {
  try {
    const { cut_id, cut_name } = req.body;
    const newcut = await Cut.create({ cut_id, cut_name });
    res.json(newcut);
  } catch (error) {
    console.error('Error adding cut:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all data of cut from the database
router.get('/cut', async (req, res) => {
  try {
    const cut = await Cut.findAll();
    res.json(cut);
  } catch (error) {
    console.error('Error fetching cut:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update cut by ID
router.put('/cut/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { cut_name } = req.body;

    const updatedCut = await Cut.update(
      { cut_name },
      { where: { cut_id: id } }
    );

    res.json(updatedCut);
  } catch (error) {
    console.error('Error updating cut:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete cut by ID
router.delete('/cut/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const deletedCut = await Cut.destroy({ where: { cut_id: id } });

    res.json({ message: 'Cut deleted successfully' });
  } catch (error) {
    console.error('Error deleting cut:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
