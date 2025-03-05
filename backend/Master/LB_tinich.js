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

// Define the LB model
const LBT = sequelize.define('LB', {
  LB_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  LB_name: {
    type: DataTypes.STRING,
  },
  LB_order: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'LB_tinich',
  timestamps: false, // Assuming your table doesn't have timestamps
});

// insert new LB in the database
router.post('/LB', async (req,res)=>{
  try{
      const{LB_id, LB_name, LB_order} = req.body;
      const newLB= await LBT.create({LB_id, LB_name, LB_order});
      res.json(newLB);
  }
  catch(error){
      console.error('Error adding LB:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/LB', async (req, res) => {
  try {
      const LB = await LBT.findAll();
      res.json(LB);
  } catch (error) {
      console.error('Error fetching LB:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update LB by ID
router.put('/LB/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { LB_name, LB_order } = req.body;

    const updatedLB = await LBT.update(
      { LB_name, LB_order },
      { where: { LB_id: id } }
    );

    res.json(updatedLB);
  } catch (error) {
    console.error('Error updating LB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete LB by ID
router.delete('/LB/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    const deletedLB = await LBT.destroy({ where: { LB_id: id } });

    res.json({ message: 'LB deleted successfully' });
  } catch (error) {
    console.error('Error deleting LB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
