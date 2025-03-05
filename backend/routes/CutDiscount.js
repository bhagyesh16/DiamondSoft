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

// Define the CUT DISCOUNT model
const Cdiscount = sequelize.define('cdiscount', {
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
    cut: {
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
    tableName: 'Cdiscount',
    timestamps: false,
});

// Insert new cut discount in the database
router.post('/cdiscount', async (req, res) => {
    try {
        const { shape, colour, purity, cut, from_size, to_size, discount } = req.body;
        const newCdiscount = await Cdiscount.create({ shape, colour, purity, cut, from_size, to_size, discount });
        res.json(newCdiscount);
    } catch (error) {
        console.error('Error adding cut discount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get cut discount by ID
router.get('/cdiscount/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const cdiscount = await Cdiscount.findByPk(id);
        if (!cdiscount) {
            return res.status(404).json({ error: 'Cut discount not found' });
        }

        res.json(cdiscount);
    } catch (error) {
        console.error('Error fetching cut discount by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update cut discount by ID
router.put('/cdiscount/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        // Find the cut discount record by its ID
        const cdiscount = await Cdiscount.findByPk(id);
        if (!cdiscount) {
            // If the record doesn't exist, return a 404 response
            return res.status(404).json({ error: 'Cut discount not found' });
        }

        // Update the cut discount record with the provided data
        await cdiscount.update(updatedData);

        // Send a success message in the response
        res.json({ message: 'Cut discount updated successfully' });
    } catch (error) {
        // If an error occurs during the update process, return a 500 response
        console.error('Error updating cut discount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete cut discount by ID
router.delete('/cdiscount/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const cdiscount = await Cdiscount.findByPk(id);
        if (!cdiscount) {
            return res.status(404).json({ error: 'Cut discount not found' });
        }

        await cdiscount.destroy();
        res.json({ message: 'Cut discount deleted successfully' });
    } catch (error) {
        console.error('Error deleting cut discount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Upload CSV file endpoint
router.post('/cdiscount/upload', upload.single('file'), async (req, res) => {
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
            cut: obj.cut,
            from_size: parseFloat(obj.from_size),
            to_size: parseFloat(obj.to_size),
            discount: parseInt(obj.discount),
        }));

        await Cdiscount.bulkCreate(resolvedArrayobj);

        res.status(200).json({ message: 'File uploaded and processed successfully', data: jsonArray });
    } catch (error) {
        console.error('Error uploading and processing file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get cut discount details
router.get('/cdiscount', async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query('EXEC GetCdiscountDetails');
        res.json(results);
    } catch (error) {
        console.error('Error getting cut discount details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//get discount on the basics of shape , colour , purity , cut
router.get('/getcdiscount/:polishWeight/:shape/:colour/:purity/:cut', async (req, res) => {
    const { polishWeight, shape, colour, purity, cut } = req.params;
  
    try {
        // Find the discount based on shape, colour, purity, cut, and polish weight range
        const discountResult = await Cdiscount.findOne({
            attributes: ['discount'],
            where: {
                from_size: { [Sequelize.Op.lte]: polishWeight },
                to_size: { [Sequelize.Op.gte]: polishWeight },
                shape,
                colour,
                purity,
                cut
            }
        });
        
        let discount = 0; // Default value for discount
        
        if (discountResult && discountResult.discount) {
            // If discount is found, set the value
            discount = discountResult.discount;
        }
  
        res.json({ discount });
    } catch (error) {
        console.error('Error fetching CUT discount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
