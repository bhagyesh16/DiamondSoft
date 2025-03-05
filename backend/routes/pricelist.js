//colour
const express = require('express');
const { connect } = require('mssql');
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
const Pricelist = sequelize.define('pricelist', {
    Pricelist_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
   autoIncrement: true
  },
  price_date: {
    type: DataTypes.DATE,
  },
  price_type:{
    type: DataTypes.STRING,
  },
  shape_id:{
    type: DataTypes.STRING,
  },
  colour_id:{
    type: DataTypes.STRING,
  },
  purity_id:{
    type: DataTypes.STRING,
  },
  cut_id:{
    type: DataTypes.STRING,
    allowNull: true, 
  },
  flrn_id:{
    type: DataTypes.STRING,
    allowNull: true, 
  },
  f_weight:{
    type: DataTypes.DECIMAL,
  },
  t_weight:{
    type: DataTypes.DECIMAL,
  },
  Rate:{
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'pricelist',
  timestamps: false, // Assuming your table doesn't have timestamps
});

// insert new colour in the database
router.post('/pricelist', async (req,res)=>{
    try{
        const{Pricelist_id,price_date,price_type,shape_id,colour_id,purity_id,cut_id,flrn_id,f_weight,t_weight,Rate} = req.body;
        const newPricelist= await Pricelist.create({Pricelist_id,price_date,price_type,shape_id,colour_id,purity_id,cut_id,flrn_id,f_weight,t_weight,Rate});
        res.json(newPricelist);
    }
    catch(error){
        console.error('Error adding pricelist:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get pricelist by Pricelist_id
router.get('/pricelist/:Pricelist_id', async (req, res) => {
  const { Pricelist_id } = req.params;

  try {
    const pricelist = await Pricelist.findByPk(Pricelist_id);
    if (!pricelist) {
      return res.status(404).json({ error: 'Pricelist not found' });
    }

    res.json(pricelist);
  } catch (error) {
    console.error('Error fetching pricelist by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// router.get('/pricelist/own', async (req, res) => {
//   try {
//     const pricelist = await Pricelist.findAll();
//     res.json(pricelist);
//   } catch (error) {
//     console.error('Error fetching pricelist by ID:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// Update pricelist by Pricelist_id

router.put('/pricelist/:Pricelist_id', async (req, res) => {
  const { Pricelist_id } = req.params;
  const updatedData = req.body;

  try {
    const pricelist = await Pricelist.findByPk(Pricelist_id);
    if (!pricelist) {
      return res.status(404).json({ error: 'Pricelist not found' });
    }

    await pricelist.update(updatedData);
    res.json({ message: 'Pricelist updated successfully' });
  } catch (error) {
    console.error('Error updating pricelist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete pricelist by Pricelist_id
router.delete('/pricelist/:Pricelist_id', async (req, res) => {
  const { Pricelist_id } = req.params;

  try {
    const pricelist = await Pricelist.findByPk(Pricelist_id);
    if (!pricelist) {
      return res.status(404).json({ error: 'Pricelist not found' });
    }

    await pricelist.destroy();
    res.json({ message: 'Pricelist deleted successfully' });
  } catch (error) {
    console.error('Error deleting pricelist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//get Rate for Rep
router.get('/getpricelistrep/:polishWeight/:shape_id/:colour_id/:purity_id/:flrn_id/:cut_id/:pricetype?', async (req, res) => {
  const { polishWeight, shape_id, colour_id, purity_id, cut_id, flrn_id, pricetype = 'Rep' } = req.params;

  try {
    // Find the ID where polish weight falls within the size range
    const idResult = await Pricelist.findOne({
      attributes: ['Pricelist_id'],
      where: {
        f_weight: { [Sequelize.Op.lte]: polishWeight },
        t_weight: { [Sequelize.Op.gte]: polishWeight },
        price_type: pricetype
      }
    });

    console.log(`ID:`, idResult);

    let Rate = 0; // Default value for rate
    
    if (idResult) {
      // Use the retrieved ID to fetch the rate based on shape, colour, purity, FLRN, and cut
      const rateResult = await Pricelist.findOne({
        attributes: ['Rate'],
        where: {
          Pricelist_id: idResult.Pricelist_id, // Corrected attribute name
          shape_id, colour_id, purity_id, cut_id, flrn_id
        }
      });

      if (rateResult) {
        // If rate is found, set the value
        Rate = rateResult.Rate;
      }
    }

    res.json({ Rate });
  } catch (error) {
    console.error('Error fetching rate:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//get Rate for own 
// router.get('/getpricelistown/:polishWeight/:shape_id/:colour_id/:purity_id/:pricetype?', async (req, res) => {
//   const { polishWeight, shape_id, colour_id, purity_id, pricetype = 'own' } = req.params;

//   try {
//     // Find the ID where polish weight falls within the size range
//     const idResult = await Pricelist.findOne({
//       attributes: ['Pricelist_id'],
//       where: {
//         f_weight: { [Sequelize.Op.lte]: polishWeight },
//         t_weight: { [Sequelize.Op.gte]: polishWeight },
//         price_type: pricetype
//       }
//     });

//     console.log(`ID:`, idResult);

//     let Rate = 0; // Default value for rate
    
//     if (idResult) {
//       // Use the retrieved ID to fetch the rate based on shape, colour, purity, FLRN, and cut
//       const rateResult = await Pricelist.findOne({
//         attributes: ['Rate'],
//         where: {
//           Pricelist_id: idResult.Pricelist_id, // Corrected attribute name
//           shape_id, colour_id, purity_id
//         }
//       });

//       if (rateResult) {
//         // If rate is found, set the value
//         Rate = rateResult.Rate;
//       }
//     }

//     res.json({ Rate });
//   } catch (error) {
//     console.error('Error fetching rate:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.get('/getpricelistown/:polishWeight/:shape_id/:colour_id/:purity_id/:pricetype?', async (req, res) => {
  const { polishWeight, shape_id, colour_id, purity_id, pricetype = 'own' } = req.params;

  try {
    // Find the rate based on shape, colour, purity, and polish weight range
    const rateResult = await Pricelist.findOne({
      attributes: ['Rate'],
      where: {
        shape_id,
        colour_id,
        purity_id,
        f_weight: { [Sequelize.Op.lte]: polishWeight },
        t_weight: { [Sequelize.Op.gte]: polishWeight },
        price_type: pricetype
      }
    });

    let Rate = 0; // Default value for rate

    if (rateResult && rateResult.Rate) {
      Rate = rateResult.Rate;
    }

    res.json({ Rate });
  } catch (error) {
    console.error('Error fetching rate:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = {router,Pricelist};

