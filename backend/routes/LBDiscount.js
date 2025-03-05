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

// Define the LB DISCOUNT model
const LBdiscount = sequelize.define('lbdiscount', {
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
    from_size: {
        type: DataTypes.DECIMAL,
    },
    to_size: {
        type: DataTypes.DECIMAL,
    },
    lb: {
        type: DataTypes.DECIMAL,
    },
    discount: { 
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'LBdiscount',
    timestamps: false,
});

// Insert new LB discount in the database
router.post('/lbdiscount', async (req, res) => {
    try {
        const { shape, colour, purity, lb, from_size, to_size, discount } = req.body;
        const newlbdiscount = await LBdiscount.create({ shape, colour, purity, lb, from_size, to_size, discount });
        res.json(newlbdiscount);
    } catch (error) {
        console.error('Error adding LB discount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get LB discount by ID
router.get('/lbdiscount/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const lbdiscount = await LBdiscount.findByPk(id);
        if (!lbdiscount) {
            return res.status(404).json({ error: 'LB discount not found' });
        }

        res.json(lbdiscount);
    } catch (error) {
        console.error('Error fetching LB discount by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update LB discount by ID
router.put('/lbdiscount/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        // Find the LB discount record by its ID
        const lbdiscount = await LBdiscount.findByPk(id);
        if (!lbdiscount) {
            // If the record doesn't exist, return a 404 response
            return res.status(404).json({ error: 'LB discount not found' });
        }

        // Update the LB discount record with the provided data
        await lbdiscount.update(updatedData);

        // Send a success message in the response
        res.json({ message: 'LB discount updated successfully' });
    } catch (error) {
        // If an error occurs during the update process, return a 500 response
        console.error('Error updating LB discount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete LB discount by ID
router.delete('/lbdiscount/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const lbdiscount = await LBdiscount.findByPk(id);
        if (!lbdiscount) {
            return res.status(404).json({ error: 'LB discount not found' });
        }

        await lbdiscount.destroy();
        res.json({ message: 'LB discount deleted successfully' });
    } catch (error) {
        console.error('Error deleting LB discount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Upload CSV file endpoint
router.post('/lbdiscount/upload', upload.single('file'), async (req, res) => {
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
            jsonArray = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName],{ defval: null });
        } else {
            return res.status(400).json({ error: 'Unsupported file format. Only CSV and Excel files are allowed.' });
        }

        const resolvedArrayobj = jsonArray.map(obj => ({
            shape: obj.shape,
            colour: obj.colour,
            purity: obj.purity,
            from_size: parseFloat(obj.from_size),
            to_size: parseFloat(obj.to_size),
            lb: isNaN(obj.lb) ? null : parseFloat(obj.lb),
            discount: parseInt(obj.discount),
        }));

        await LBdiscount.bulkCreate(resolvedArrayobj);

        res.status(200).json({ message: 'File uploaded and processed successfully', data: jsonArray });
    } catch (error) {
        console.error('Error uploading and processing file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get LB discount details
router.get('/lbdiscount', async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query('EXEC GetLBdiscountDetails');
        res.json(results);
    } catch (error) {
        console.error('Error getting LB discount details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//get discount on the basics of shape , colour , purity , LB
router.get('/getlbdiscount/:polishWeight/:shape/:colour/:purity/:lb', async (req, res) => {
    const { polishWeight, shape, colour, purity, lb } = req.params;
  
    try {
        // Find the discount based on shape, colour, purity, LB, and polish weight range
        const discountResult = await LBdiscount.findOne({
            attributes: ['discount'],
            where: {
                from_size: { [Sequelize.Op.lte]: polishWeight },
                to_size: { [Sequelize.Op.gte]: polishWeight },
                shape,
                colour,
                purity,
                lb
            }
        });
        
        let discount = 0; // Default value for discount
        
        if (discountResult && discountResult.discount) {
            // If discount is found, set the value
            discount = discountResult.discount;
        }
  
        res.json({ discount });
    } catch (error) {
        console.error('Error fetching LB discount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
