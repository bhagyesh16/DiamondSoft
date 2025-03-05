const { json } = require('body-parser');
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

const Rough_header = sequelize.define('rough_header',{
    ID:{
        type:DataTypes.INTEGER,
        primaryKey:true,  
        autoIncrement:true,
    },
    Date_Of_Action:{
      type:DataTypes.DATE,
    },
    Name_Of_Site:{
      type:DataTypes.STRING,
    },
    Extra_Remarks:{
      type:DataTypes.STRING,
    },
    Rough_Desc:{
      type:DataTypes.STRING,
    },
    Sieves_id:{
      type:DataTypes.STRING,
    },
    Rough_weight:{
      type:DataTypes.DECIMAL,
    },
},{
  tableName: 'rough_header',
  timestamps: false,
});

router.post('/rough_header', async (req,res)=>{
  try{
    const{ID,Date_Of_Action,Name_Of_Site,Extra_Remarks,Rough_Desc,Sieves_id,Rough_weight}= req.body;
    const newRough_header= await Rough_header.create({ID,Date_Of_Action,Name_Of_Site,Extra_Remarks,Rough_Desc,Sieves_id,Rough_weight});
    res.json(newRough_header);
  }
  catch(error){
    console.error('Error adding Rough header:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/rough_header', async (req,res)=>
{
  try {
        const rough_header = await Rough_header.findAll();
        res.json(rough_header);
      } catch (error) {
        console.error('Error fetching Rough header:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

module.exports = router;