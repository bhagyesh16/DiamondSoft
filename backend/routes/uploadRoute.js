// Assuming you have a database connection and a pricelist model
const express = require('express');
const multer = require('multer');
const csvtojson = require('csvtojson');
const xlsx = require('xlsx');
const { Pricelist } = require('../routes/pricelist'); // pricelist model

const router = express.Router();

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the route for file upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Access the uploaded file via req.file.buffer
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

    // Log the JSON data
    console.log('JSON data:', jsonArray);

    // Extract the date and price_type from the form data
    const formData = req.body;
    const uploadDate = formData.date;
    const priceType = formData.price_type;

    // Delete existing records for the same date
    try {
      await Pricelist.destroy({
        where: {
          price_date: uploadDate,
          // You may want to add more conditions based on your data model
        },
      });
    } catch (error) {
      console.error('Error deleting records:', error);
      // Handle the error as needed
    }

    // Insert data into the pricelist table using bulkCreate on the model
    const arrayobj = jsonArray.map(async (obj) => {
      let row = Object.values(obj);
      console.log(row);
      let diamond = {
        shape_id: row[0],
        colour_id: row[1],
        purity_id: row[2],
        cut_id: row[3],
        flrn_id: row[4],
        f_weight: row[5],
        t_weight: row[6],
        Rate: row[7],
        price_date: uploadDate,
        price_type: priceType, // Inserting the selected price_type from the form
      };


      return diamond;
    });

    // Wait for all the promises to complete before sending the response
    const resolvedArrayobj = await Promise.all(arrayobj);

    // Insert the resolved array into the pricelist table using bulkCreate on the model
    await Pricelist.bulkCreate(resolvedArrayobj);
    
    res.status(200).json({ message: 'File uploaded and processed successfully', data: jsonArray });
  } catch (error) {
    // Handle errors
    console.error('Error uploading and processing file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
