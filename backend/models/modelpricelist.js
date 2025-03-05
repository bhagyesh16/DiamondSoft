const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('DiamondSoft', 'iits', 'iits123', {
  host: 'localhost',
  dialect: 'mssql',
});

// Define a virtual model for the stored procedure result
const PricelistWithDetails = sequelize.define('PricelistWithDetails', {
  Pricelist_id: {
    type: DataTypes.INTEGER,
  },
  price_date: {
    type: DataTypes.DATE,
  },
  price_type: {
    type: DataTypes.STRING,
  },
  shape_name: {
    type: DataTypes.STRING,
  },
  colour_name: {
    type: DataTypes.STRING,
  },
  purity_name: {
    type: DataTypes.STRING,
  },
  cut_name: {
    type: DataTypes.STRING,
  },
  flrn_name: {
    type: DataTypes.STRING,
  },
  f_weight: {
    type: DataTypes.DECIMAL(10, 2),
  },
  t_weight: {
    type: DataTypes.DECIMAL(10, 2),
  },
  Rate: {
    type: DataTypes.DECIMAL(10, 2),
  },
}, {
  timestamps: false, // Disable createdAt and updatedAt fields
  tableName: 'PricelistWithDetails', // Assuming this is the name of the stored procedure result set
});


PricelistWithDetails.getPricelistWithDetails = async () => {
    try {
      const [result, metadata] = await sequelize.query('EXEC GetPricelistWithDetails');
      return result;
    } catch (error) {
      console.error('Error executing stored procedure:', error);
      throw error;
    }
  };
  
  module.exports = { PricelistWithDetails };