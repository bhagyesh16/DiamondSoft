//shape
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

// Define the Shape model
const Shape = sequelize.define('shape', {
  shape_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  shape_name: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'shape',
  timestamps: false, // Assuming your table doesn't have timestamps
});

// Insert new shape in the database
router.post('/shape', async (req, res) => {
  try {
    const { shape_id, shape_name } = req.body;
    const newShape = await Shape.create({ shape_id, shape_name });
    res.json(newShape);
  }
  catch (error) {
    console.error('Error adding shape:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all data of shape from the database
router.get('/shape', async (req, res) => {
  try {
    const shape = await Shape.findAll();
    res.json(shape);
  } catch (error) {
    console.error('Error fetching shape:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update shape by ID
router.put('/shape/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { shape_name } = req.body;

    const updatedShape = await Shape.update(
      { shape_name },
      { where: { shape_id: id } }
    );

    res.json(updatedShape);
  } catch (error) {
    console.error('Error updating shape:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete shape by ID
router.delete('/shape/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const deletedShape = await Shape.destroy({ where: { shape_id: id } });

    res.json({ message: 'Shape deleted successfully' });
  } catch (error) {
    console.error('Error deleting shape:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
