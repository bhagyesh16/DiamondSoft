const express = require('express');
const multer = require('multer');
const csvtojson = require('csvtojson');
const xlsx = require('xlsx');
const { Sequelize, DataTypes } = require('sequelize');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// Define the NATTS DISCOUNT model
const Ndiscount = sequelize.define('ndiscount', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    shape: {
        type: DataTypes.STRING,
    },
    colour: {
        type: DataTypes.STRING,
    },
    purity: {
        type: DataTypes.STRING,
    },
    natts: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    from_size: {
        type: DataTypes.DECIMAL,
    },
    to_size: {
        type: DataTypes.DECIMAL,
    },
    discount: { 
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'Ndiscount',
    timestamps: false,
});

// Insert new NATTS discount in the database
router.post('/ndiscount', async (req, res) => {
    try {
        const { shape, colour, purity, natts, from_size, to_size, discount } = req.body;
        const newndiscount = await Ndiscount.create({ shape, colour, purity, natts, from_size, to_size, discount });
        res.json(newndiscount);
    } catch (error) {
        console.error('Error adding NATTS discount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get NATTS discount by ID
router.get('/ndiscount/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const ndiscount = await Ndiscount.findByPk(id);
        if (!ndiscount) {
            return res.status(404).json({ error: 'NATTS discount not found' });
        }

        res.json(ndiscount);
    } catch (error) {
        console.error('Error fetching NATTS discount by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update NATTS discount by ID
router.put('/ndiscount/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        // Find the NATTS discount record by its ID
        const ndiscount = await Ndiscount.findByPk(id);
        if (!ndiscount) {
            // If the record doesn't exist, return a 404 response
            return res.status(404).json({ error: 'NATTS discount not found' });
        }

        // Update the NATTS discount record with the provided data
        await ndiscount.update(updatedData);

        // Send a success message in the response
        res.json({ message: 'NATTS discount updated successfully' });
    } catch (error) {
        // If an error occurs during the update process, return a 500 response
        console.error('Error updating NATTS discount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete NATTS discount by ID
router.delete('/ndiscount/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const ndiscount = await Ndiscount.findByPk(id);
        if (!ndiscount) {
            return res.status(404).json({ error: 'NATTS discount not found' });
        }

        await ndiscount.destroy();
        res.json({ message: 'NATTS discount deleted successfully' });
    } catch (error) {
        console.error('Error deleting NATTS discount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Upload CSV file endpoint
router.post('/ndiscount/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileBuffer = req.file.buffer;
        const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

        let jsonArray;

        if (fileExtension === 'csv') {
            // Convert CSV to JSON using csvtojson
            jsonArray = await csvtojson().fromString(fileBuffer.toString());
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
            // Convert Excel to JSON using xlsx
            const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            jsonArray = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        } else {
            return res.status(400).json({ error: 'Unsupported file format. Only CSV and Excel files are allowed.' });
        }

        const resolvedArrayobj = jsonArray.map(obj => ({
            shape: obj.shape,
            
            colour: obj.colour,
            purity: obj.purity,
            from_size: parseFloat(obj.from_size),
            to_size: parseFloat(obj.to_size),
            natts:obj.natts,
            discount: parseInt(obj.discount),
        }));

        await Ndiscount.bulkCreate(resolvedArrayobj);
8-
        res.status(200).json({ message: 'File uploaded and processed successfully', data: jsonArray });
    } catch (error) {
        console.error('Error uploading and processing file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get NATTS discount details
router.get('/ndiscount', async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query('EXEC GetNdiscountDetails');
        res.json(results);
    } catch (error) {
        console.error('Error getting NATTS discount details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//get discount on the basics of shape , colour , purity , Natts
router.get('/getndiscount/:polishWeight/:shape/:colour/:purity/:natts', async (req, res) => {
    const { polishWeight, shape, colour, purity, natts } = req.params;
  
    try {
        // Find the discount based on shape, colour, purity, Natts, and polish weight range
        const discountResult = await Ndiscount.findOne({
            attributes: ['discount'],
            where: {
                from_size: { [Sequelize.Op.lte]: polishWeight },
                to_size: { [Sequelize.Op.gte]: polishWeight },
                shape,
                colour,
                purity,
                natts
            }
        });
        
        let discount = 0; // Default value for discount
        
        if (discountResult && discountResult.discount) {
            // If discount is found, set the value
            discount = discountResult.discount;
        }
  
        res.json({ discount });
    } catch (error) {
        console.error('Error fetching Natts discount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
