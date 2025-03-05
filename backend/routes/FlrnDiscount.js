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

// Define the FLRN DISCOUNT model
const Fdiscount = sequelize.define('fdiscount', {
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
    flrn: {
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
    tableName: 'Fdiscount',
    timestamps: false,
});

// Insert new flrn discount in the database
router.post('/fdiscount', async (req, res) => {
    try {
        const { shape, colour, purity, flrn, from_size, to_size, discount } = req.body;
        const newfdiscount = await Fdiscount.create({ shape, colour, purity, flrn, from_size, to_size, discount });
        res.json(newfdiscount);
    } catch (error) {
        console.error('Error adding flrn discount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get flrn discount by ID
router.get('/fdiscount/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const fdiscount = await Fdiscount.findByPk(id);
        if (!fdiscount) {
            return res.status(404).json({ error: 'flrn discount not found' });
        }

        res.json(fdiscount);
    } catch (error) {
        console.error('Error fetching flrn discount by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update flrn discount by ID
router.put('/fdiscount/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        // Find the flrn discount record by its ID
        const fdiscount = await Fdiscount.findByPk(id);
        if (!fdiscount) {
            // If the record doesn't exist, return a 404 response
            return res.status(404).json({ error: 'flrn discount not found' });
        }

        // Update the flrn discount record with the provided data
        await fdiscount.update(updatedData);

        // Send a success message in the response
        res.json({ message: 'flrn discount updated successfully' });
    } catch (error) {
        // If an error occurs during the update process, return a 500 response
        console.error('Error updating flrn discount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete flrn discount by ID
router.delete('/fdiscount/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const fdiscount = await Fdiscount.findByPk(id);
        if (!fdiscount) {
            return res.status(404).json({ error: 'flrn discount not found' });
        }

        await fdiscount.destroy();
        res.json({ message: 'flrn discount deleted successfully' });
    } catch (error) {
        console.error('Error deleting flrn discount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Upload CSV file endpoint
router.post('/fdiscount/upload', upload.single('file'), async (req, res) => {
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

        // Map JSON data to match the Fdiscount model structure
        const resolvedArrayobj = jsonArray.map(obj => ({
            shape: obj.shape,
            colour: obj.colour,
            purity: obj.purity,
            from_size: parseFloat(obj.from_size),
            to_size: parseFloat(obj.to_size),
            flrn: obj.flrn,
            discount: parseInt(obj.discount),
        }));

        // Bulk insert the data into the database
        await Fdiscount.bulkCreate(resolvedArrayobj);

        res.status(200).json({ message: 'File uploaded and processed successfully', data: jsonArray });
    } catch (error) {
        console.error('Error uploading and processing file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Get flrn discount details
router.get('/fdiscount', async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query('EXEC GetFdiscountDetails');
        res.json(results);
    } catch (error) {
        console.error('Error getting flrn discount details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/getfdiscount/:polishWeight/:shape/:colour/:purity/:flrn', async (req, res) => {
    const { polishWeight, shape, colour, purity, flrn } = req.params;
  
    try {
        // Find the discount based on shape, colour, purity, FLRN, and polish weight range
        const discountResult = await Fdiscount.findOne({
            attributes: ['discount'],
            where: {
                from_size: { [Sequelize.Op.lte]: polishWeight },
                to_size: { [Sequelize.Op.gte]: polishWeight },
                shape,
                colour,
                purity,
                flrn
            }
        });
        
        let discount = 0; // Default value for discount
        
        if (discountResult && discountResult.discount) {
            // If discount is found, set the value
            discount = discountResult.discount;
        }
  
        res.json({ discount });
    } catch (error) {
        console.error('Error fetching Standard discount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
