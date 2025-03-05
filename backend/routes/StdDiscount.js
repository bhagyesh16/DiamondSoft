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

// Define the STANDARD DISCOUNT model
const Sdiscount = sequelize.define('sdiscount', {
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
    discount: {
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'Sdiscount',
    timestamps: false,
});

// Insert new Standard discount in the database
router.post('/sdiscount', async (req, res) => {
    try {
        const { shape, colour, purity, from_size, to_size, discount } = req.body;
        const newsdiscount = await Sdiscount.create({ shape, colour, purity, from_size, to_size, discount });
        res.json(newsdiscount);
    } catch (error) {
        console.error('Error adding Standard discount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Standard discount by ID
router.get('/sdiscount/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const sdiscount = await Sdiscount.findByPk(id);
        if (!sdiscount) {
            return res.status(404).json({ error: 'Standard discount not found' });
        }

        res.json(sdiscount);
    } catch (error) {
        console.error('Error fetching Standard discount by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update Standard discount by ID
router.put('/sdiscount/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        // Find the Standard discount record by its ID
        const sdiscount = await Sdiscount.findByPk(id);
        if (!sdiscount) {
            // If the record doesn't exist, return a 404 response
            return res.status(404).json({ error: 'Standard discount not found' });
        }

        // Update the Standard discount record with the provided data
        await sdiscount.update(updatedData);

        // Send a success message in the response
        res.json({ message: 'Standard discount updated successfully' });
    } catch (error) {
        // If an error occurs during the update process, return a 500 response
        console.error('Error updating Standard discount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete Standard discount by ID
router.delete('/sdiscount/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const sdiscount = await Sdiscount.findByPk(id);
        if (!sdiscount) {
            return res.status(404).json({ error: 'Standard discount not found' });
        }

        await sdiscount.destroy();
        res.json({ message: 'Standard discount deleted successfully' });
    } catch (error) {
        console.error('Error deleting Standard discount:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Upload CSV file endpoint
router.post('/sdiscount/upload', upload.single('file'), async (req, res) => {
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
            discount: parseInt(obj.discount),
        }));

        await Sdiscount.bulkCreate(resolvedArrayobj);

        res.status(200).json({ message: 'File uploaded and processed successfully', data: jsonArray });
    } catch (error) {
        console.error('Error uploading and processing file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get Standard discount details
router.get('/sdiscount', async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query('EXEC GetSdiscountDetails');
        res.json(results);
    } catch (error) {
        console.error('Error getting Standard discount details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// router.get('/getsdiscount/:shape/:colour/:purity', async (req, res) => {
//     const { shape, colour, purity } = req.params;

//     try {
//         // Find discounts based on the provided criteria
//         const discount = await Sdiscount.findOne({
//             attributes: ['discount'], // Select only the discount field
//             where: {
//                 shape,
//                 purity,
//                 colour,
//             }
//         });

//         if (!discount) {
//             return res.json({ discount: 0 }); 
//         }

//         res.json(discount);
//     } catch (error) {
//         console.error('Error fetching Standard discount:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
// Inside the router definition

// router.get('/getsdiscount/:polishWeight/:shape/:colour/:purity', async (req, res) => {
//     const { polishWeight, shape, colour, purity } = req.params;
  
//     try {
//       // Find the ID where polish weight falls within the size range
//       const idResult = await Sdiscount.findOne({
//         attributes: ['id'],
//         where: {
//           from_size: { [Sequelize.Op.lte]: polishWeight },
//           to_size: { [Sequelize.Op.gte]: polishWeight }
//         }
//       });
  
//       if (!idResult) {
//         return res.status(404).json({ error: 'No matching discount found for the specified polish weight.' });
//       }
  
//       // Use the retrieved ID to fetch the discount based on shape, colour, purity, and ID
//       const discount = await Sdiscount.findOne({
//         attributes: ['discount'],
//         where: {
//           id: idResult.id,
//           shape,
//           colour,
//           purity
//         }
//       });
  
//       if (!discount) {
//         return res.json({ discount: 0 }); 
//       }
  
//       res.json(discount);
//     } catch (error) {
//       console.error('Error fetching Standard discount:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });
  
router.get('/getsdiscount/:polishWeight/:shape/:colour/:purity', async (req, res) => {
    const { polishWeight, shape, colour, purity } = req.params;
  
    try {
        // Find the discount based on shape, colour, purity, and polish weight range
        const discountResult = await Sdiscount.findOne({
            attributes: ['discount'],
            where: {
                from_size: { [Sequelize.Op.lte]: polishWeight },
                to_size: { [Sequelize.Op.gte]: polishWeight },
                shape,
                colour,
                purity
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
