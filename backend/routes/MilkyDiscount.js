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

        // Define the milky DISCOUNT model
        const Mdiscount = sequelize.define('mdiscount', {
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
            milky: {
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
            tableName: 'Mdiscount',
            timestamps: false,
        });
        
        // Insert new milky discount in the database
        router.post('/mdiscount', async (req, res) => {
            try {
                const { shape, colour, purity, milky, from_size, to_size, discount } = req.body;
                const newmdiscount = await Mdiscount.create({ shape, colour, purity, milky, from_size, to_size, discount });
                res.json(newmdiscount);
            } catch (error) {
                console.error('Error adding milky discount:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Get milky discount by ID
        router.get('/mdiscount/:id', async (req, res) => {
            const { id } = req.params;

            try {
                const mdiscount = await Mdiscount.findByPk(id);
                if (!mdiscount) {
                    return res.status(404).json({ error: 'milky discount not found' });
                }

                res.json(mdiscount);
            } catch (error) {
                console.error('Error fetching milky discount by ID:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Update milky discount by ID
        router.put('/mdiscount/:id', async (req, res) => {
            const { id } = req.params;
            const updatedData = req.body;

            try {
                // Find the milky discount record by its ID
                const mdiscount = await Mdiscount.findByPk(id);
                if (!mdiscount) {
                    // If the record doesn't exist, return a 404 response
                    return res.status(404).json({ error: 'milky discount not found' });
                }

                // Update the milky discount record with the provided data
                await mdiscount.update(updatedData);

                // Send a success message in the response
                res.json({ message: 'milky discount updated successfully' });
            } catch (error) {
                // If an error occurs during the update process, return a 500 response
                console.error('Error updating milky discount:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Delete milky discount by ID
        router.delete('/mdiscount/:id', async (req, res) => {
            const { id } = req.params;

            try {
                const mdiscount = await Mdiscount.findByPk(id);
                if (!mdiscount) {
                    return res.status(404).json({ error: 'milky discount not found' });
                }

                await mdiscount.destroy();
                res.json({ message: 'milky discount deleted successfully' });
            } catch (error) {
                console.error('Error deleting milky discount:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        router.post('/mdiscount/upload', upload.single('file'), async (req, res) => {
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
        
                // Check if the required fields exist in the uploaded file
                const requiredFields = ['Shape', 'Colour', 'Purity', 'From_Size', 'To_Size', 'Milky', 'Discount'];
                const missingFields = requiredFields.filter(field => !jsonArray[0][field]);
        
                if (missingFields.length > 0) {
                    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
                }
        
                // Map and parse the JSON data
                const resolvedArrayobj = jsonArray.map(obj => ({
                    shape: obj.Shape,
                    colour: obj.Colour,
                    purity: obj.Purity,
                    from_size: parseFloat(obj.From_Size),
                    to_size: parseFloat(obj.To_Size),
                    milky: obj.Milky,
                    discount: parseInt(obj.Discount),
                }));
        
                // Bulk insert the parsed data into the Mdiscount table
                await Mdiscount.bulkCreate(resolvedArrayobj);
        
                res.status(200).json({ message: 'File uploaded and processed successfully', data: resolvedArrayobj });
            } catch (error) {
                console.error('Error uploading and processing file:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        // Get milky discount details
        router.get('/mdiscount', async (req, res) => {
            try {
                const [results, metadata] = await sequelize.query('EXEC GetMdiscountDetails');
                res.json(results);
            } catch (error) {
                console.error('Error getting milky discount details:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
        //get discount on the basics of shape , colour , purity , milky
        router.get('/getmdiscount/:polishWeight/:shape/:colour/:purity/:milky', async (req, res) => {
            const { polishWeight, shape, colour, purity, milky } = req.params;
        
            try {
                // Find the discount based on shape, colour, purity, Milky, and polish weight range
                const discountResult = await Mdiscount.findOne({
                    attributes: ['discount'],
                    where: {
                        from_size: { [Sequelize.Op.lte]: polishWeight },
                        to_size: { [Sequelize.Op.gte]: polishWeight },
                        shape,
                        colour,
                        purity,
                        milky
                    }
                });
                
                let discount = 0; // Default value for discount
                
                if (discountResult && discountResult.discount) {
                    // If discount is found, set the value
                    discount = discountResult.discount;
                }
        
                res.json({ discount });
            } catch (error) {
                console.error('Error fetching Milky discount:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        module.exports = router;
