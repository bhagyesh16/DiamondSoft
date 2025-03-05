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

// Define the Natts model
const Natts = sequelize.define('natts', {
  natts_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  natts_name: {
    type: DataTypes.STRING,
  },
  natts_order: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'natts',
  timestamps: false, // Assuming your table doesn't have timestamps
});

// insert new natts in the database
router.post('/natts', async (req,res)=>{
  try{
      const{natts_id, natts_name, natts_order} = req.body;
      const newNatts= await Natts.create({natts_id, natts_name, natts_order});
      res.json(newNatts);
  }
  catch(error){
      console.error('Error adding Natts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/natts', async (req, res) => {
  try {
      const natts = await Natts.findAll();
      res.json(natts);
  } catch (error) {
      console.error('Error fetching Natts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update natts by ID
router.put('/natts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { natts_name, natts_order } = req.body;

    const updatedNatts = await Natts.update(
      { natts_name, natts_order },
      { where: { natts_id: id } }
    );

    res.json(updatedNatts);
  } catch (error) {
    console.error('Error updating Natts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete natts by ID
router.delete('/natts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    const deletedNatts = await Natts.destroy({ where: { natts_id: id } });

    res.json({ message: 'Natts deleted successfully' });
  } catch (error) {
    console.error('Error deleting Natts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
