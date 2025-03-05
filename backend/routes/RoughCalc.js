const express = require('express');
const { Sequelize, DataTypes, QueryTypes } = require('sequelize');

const router = express.Router();

// Sequelize configuration
const sequelize = new Sequelize('DiamondSoft', 'iits', 'iits123', {
  host: 'localhost',
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: true
    },
  },
});

const RoughCalc = sequelize.define('roughcalc', {
  RH_id: {
    type: DataTypes.INTEGER,
  },
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ID' // Specify the field name in the database
  },
  shape_id: {
    type: DataTypes.STRING,
    field: 'shape_id' // Specify the field name in the database
  },
  colour_id: {
    type: DataTypes.STRING,
    field: 'colour_id' // Specify the field name in the database
  },
  purity_id: {
    type: DataTypes.STRING,
    field: 'purity_id' // Specify the field name in the database
  },
  cut_id: {
    type: DataTypes.STRING,
    field: 'cut_id', // Specify the field name in the database
    allowNull: true
  },
  flrn_id: {
    type: DataTypes.STRING,
    field: 'flrn_id', // Specify the field name in the database
    allowNull: true
  },
  purity_weight: {
    type: DataTypes.DECIMAL,
    field: 'purity_weight' // Specify the field name in the database
  },
  Rate: {
    type: DataTypes.DECIMAL,
    field: 'Rate' // Specify the field name in the database
  },
  discount: {
    type: DataTypes.DECIMAL,
    field: 'discount' // Specify the field name in the database
  },
  price: {
    type: DataTypes.DECIMAL,
    field: 'price' // Specify the field name in the database
  },
  value: {
    type: DataTypes.DECIMAL,
    field: 'value' // Specify the field name in the database
  },
  labour: {
    type: DataTypes.DECIMAL,
    field: 'labour' // Specify the field name in the database
  },
  extra_exp: {
    type: DataTypes.DECIMAL,
    field: 'extra_exp' // Specify the field name in the database
  },
  roughprice: {
    type: DataTypes.DECIMAL,
    field: 'roughprice' // Specify the field name in the database
  },
  MU: {
    type: DataTypes.DECIMAL,
    field: 'MU' // Specify the field name in the database
  }
}, {
  tableName: 'roughcalc',
  timestamps: false,
});

router.post('/roughcalc', async (req, res) => {
  try {
    const { RH_id, colour_id, cut_id, shape_id, purity_id, flrn_id, purity_weight, Rate, discount, price, value, labour, extra_exp, roughprice, MU } = req.body;

    console.log('Received data:', req.body); // Log the received data

    // Insert the data into the database, excluding the 'ID' field
    const insertedData = await RoughCalc.create({
      RH_id,
      colour_id,
      cut_id,
      shape_id,
      purity_id,
      flrn_id,
      purity_weight,
      Rate,
      discount,
      price,
      value,
      labour,
      extra_exp,
      roughprice,
      MU
    });

    console.log('Inserted data:', insertedData); // Log the inserted data

    res.status(200).json({ success: true, message: 'Data inserted successfully.', data: insertedData });
  } catch (error) {
    console.error('Error occurred during data insertion:', error);
    res.status(500).json({ success: false, message: 'Failed to insert data.', error: error.message });
  }
});

router.get('/roughcalc/:RH_id', async (req, res) => {
  try {
    const { RH_id } = req.params;

    // Call the stored procedure to fetch rough body data with details for the specified RH_id
    const fetchedData = await sequelize.query('EXEC FetchRoughBodyData @RH_id=:RH_id', {
      replacements: { RH_id: parseInt(RH_id) }, // Provide the RH_id as a parameter
      type: QueryTypes.SELECT
    });

    res.status(200).json({ success: true, message: 'Data fetched successfully.', data: fetchedData });
  } catch (error) {
    console.error('Error occurred during data fetching:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch data.', error: error.message });
  }
});

router.delete('/roughcalc/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Call the DeletePolishDetails stored procedure
    await sequelize.query('EXEC DeletePolishDetails @itemId=:itemId', {
      replacements: { itemId: id },
      type: QueryTypes.DELETE
    });

    res.status(200).json({ success: true, message: 'Data deleted successfully.' });
  } catch (error) {
    console.error('Error occurred during data deletion:', error);
    res.status(500).json({ success: false, message: 'Failed to delete data.', error: error.message });
  }
});

router.put('/roughcalc/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      SelectedColour,
      SelectedShape,
      SelectedPurity,
      SelectedCut,
      SelectedFlrn,
      PurityWeight,
      Rate,
      Discount,
      Price,
      Value,
      Labour,
      ExtraExp,
      RoughPrice,
      MU
    } = req.body;

    // Construct the SQL query string with named replacements
    const query = `
      EXEC UpdateRoughCalc 
        @ID = :ID,
        @SelectedColour = :SelectedColour,
        @SelectedCut = :SelectedCut,
        @SelectedShape = :SelectedShape,
        @SelectedPurity = :SelectedPurity,
        @SelectedFlrn = :SelectedFlrn,
        @PurityWeight = :PurityWeight,
        @Rate = :Rate,
        @Discount = :Discount,
        @Price = :Price,
        @Value = :Value,
        @Labour = :Labour,
        @ExtraExp = :ExtraExp,
        @RoughPrice = :RoughPrice,
        @MU = :MU
    `;

    // Execute the query with replacements
    await sequelize.query(query, {
      replacements: {
        ID: id,
        SelectedColour,
        SelectedCut,
        SelectedShape,
        SelectedPurity,
        SelectedFlrn,
        PurityWeight,
        Rate,
        Discount,
        Price,
        Value,
        Labour,
        ExtraExp,
        RoughPrice,
        MU
      },
      type: QueryTypes.UPDATE // Specify the query type
    });

    res.status(200).json({ success: true, message: 'Data updated successfully.' });
  } catch (error) {
    console.error('Error occurred during data update:', error);
    res.status(500).json({ success: false, message: 'Failed to update data.', error: error.message });
  }
});



module.exports = router;
