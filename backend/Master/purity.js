//purity
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

// Define the Purity model
const Purity = sequelize.define('purity', {
    purity_id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    purity_name: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'purity',
    timestamps: false, // Assuming your table doesn't have timestamps
});

// Insert new purity in the database
router.post('/purity', async (req, res) => {
    try {
        const { purity_id, purity_name } = req.body;
        const newPurity = await Purity.create({ purity_id, purity_name });
        res.json(newPurity);
    }
    catch (error) {
        console.error('Error adding purity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all data of purity from the database
router.get('/purity', async (req, res) => {
    try {
        const purity = await Purity.findAll();
        res.json(purity);
    } catch (error) {
        console.error('Error fetching purity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update purity by ID
router.put('/purity/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { purity_name } = req.body;

        const updatedPurity = await Purity.update(
            { purity_name },
            { where: { purity_id: id } }
        );

        res.json(updatedPurity);
    } catch (error) {
        console.error('Error updating purity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete purity by ID
router.delete('/purity/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const deletedPurity = await Purity.destroy({ where: { purity_id: id } });

        res.json({ message: 'Purity deleted successfully' });
    } catch (error) {
        console.error('Error deleting purity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
