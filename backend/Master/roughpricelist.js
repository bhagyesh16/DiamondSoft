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
    },
  },
});

// Define the Pricelist model
const Pricelist = sequelize.define('pricelist', {
  shape_id: {
    type: DataTypes.STRING,
  },
  colour_id: {
    type: DataTypes.STRING,
  },
  purity_id: {
    type: DataTypes.STRING,
  },
  cut_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  flrn_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  f_weight: {
    type: DataTypes.DECIMAL(10, 2),
  },
  t_weight: {
    type: DataTypes.DECIMAL(10, 2),
  },
  Rate: {
    type: DataTypes.INTEGER,
  },
  Pricelist_id: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'pricelist',
  timestamps: false,
});

// GET endpoint for fetching pricelist rate
router.get('/roughpricelist', async (req, res) => {
  try {
    const { shape_id, colour_id, purity_id, flrn_id, cut_id ,purity_weight } = req.query;
    console.log('Query Parameters:', { shape_id, colour_id, purity_id, flrn_id, cut_id ,purity_weight });

    // Call the stored procedure to get the rate
    console.log('Received Parameters:', { shape_id, colour_id, purity_id, flrn_id, cut_id , purity_weight});

    const results = await sequelize.query('EXEC GetRate @p_shape_id = :shape_id, @p_colour_id = :colour_id, @p_purity_id = :purity_id, @p_cut_id = :cut_id, @p_flrn_id = :flrn_id, @p_purity_weight = :purity_weight', {
      replacements: {
        shape_id,
        colour_id,
        purity_id,
        cut_id: cut_id || null,
        flrn_id: flrn_id || null,
        purity_weight: req.query.purity_weight // Assuming purity_weight is passed in the request query
      },
      type: QueryTypes.SELECT
    });

    if (results.length > 0) {
      const rate = results[0].Rate;
      res.status(200).json({ rate });
    } else {
      console.log('No rate found for the provided criteria');
      res.status(404).json({ error: 'Rate not found for the provided criteria' });
    }
  } catch (error) {
    console.error('Error fetching rate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
