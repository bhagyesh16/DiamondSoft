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

// Define the flrn model
const Roughdesc = sequelize.define('Rough_Desc', {
    RoughDesc: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'Rough_Desc',
  timestamps: false, // Assuming your table doesn't have timestamps
});
// insert new cut in the database
router.post('/Rough_Desc', async (req,res)=>{
    try{
        const{RoughDesc} = req.body;
        const newRoughDesc= await Roughdesc.create({RoughDesc});
        res.json(newRoughDesc);
    }
    catch(error){
        console.error('Error adding RoughDesc:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/Rough_Desc', async (req, res) => {
  try {
    const Rough_Desc = await Roughdesc.findAll({
        attributes: ['RoughDesc'],
    });
      res.json(Rough_Desc);
  } catch (error) {
      console.error('Error fetching RoughDesc:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports= router;