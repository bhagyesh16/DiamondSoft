const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const router = express.Router();

const sequelize = new Sequelize('DiamondSoft', 'iits', 'iits123', {
  host: 'localhost',
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: true,
    },
  },
});

// Define the milky model
const Milky = sequelize.define('milky', {
  milky_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  milky_name: {
    type: DataTypes.STRING,
  },
  milky_order: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'milky',
  timestamps: false, // Assuming your table doesn't have timestamps
});

// insert new milky in the database
router.post('/milky', async (req,res)=>{
  try{
      const{milky_id, milky_name, milky_order} = req.body;
      const newmilky= await Milky.create({milky_id, milky_name, milky_order});
      res.json(newmilky);
  }
  catch(error){
      console.error('Error adding milky:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/milky', async (req, res) => {
  try {
      const milky = await Milky.findAll();
      res.json(milky);
  } catch (error) {
      console.error('Error fetching milky:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update milky by ID
router.put('/milky/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { milky_name, milky_order } = req.body;

    const updatedmilky = await Milky.update(
      { milky_name, milky_order },
      { where: { milky_id: id } }
    );

    res.json(updatedmilky);
  } catch (error) {
    console.error('Error updating milky:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete milky by ID
router.delete('/milky/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    const deletedmilky = await Milky.destroy({ where: { milky_id: id } });

    res.json({ message: 'milky deleted successfully' });
  } catch (error) {
    console.error('Error deleting milky:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
