//colour
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

// Define the Colour model
const Colour = sequelize.define('colour', {
  colour_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    
  },
  colour_name: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'colour',
  timestamps: false, 
});

// insert new colour in the database
router.post('/colour', async (req,res)=>{
    try{
        const{colour_id,colour_name} = req.body;
        const newcolour= await Colour.create({colour_id,colour_name});
        res.json(newcolour);
    }
    catch(error){
        console.error('Error adding Colour:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/colour', async (req, res) => {
  try {
      const colour = await Colour.findAll();
      res.json(colour);
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update colour by ID
router.put('/colour/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { colour_name } = req.body;

    const updatedColour = await Colour.update(
      { colour_name },
      { where: { colour_id: id } }
    );

    res.json(updatedColour);
  } catch (error) {
    console.error('Error updating Colour:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete colour by ID
router.delete('/colour/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    const deletedColour = await Colour.destroy({ where: { colour_id: id } });

    res.json({ message: 'Colour deleted successfully' });
  } catch (error) {
    console.error('Error deleting Colour:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports= router;