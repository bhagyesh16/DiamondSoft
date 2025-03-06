import React, { useState } from 'react';
import axios from 'axios';

const FileUploadForm = ({ setPricelistData }) => {
  const [file, setFile] = useState(null);
  const [priceType, setPriceType] = useState('own');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePriceTypeChange = (value) => {
    setPriceType(value);
  };

  const handleSubmit = async (e, setPricelistData) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('date', new Date().toISOString());
        formData.append('price_type', priceType);

        const apiUrl = priceType === 'own' ? 'https://diamondsoft-backend.onrender.com/api/ownupload' : 'https://diamondsoft-backend.onrender.com/api/upload';

        const response = await axios({
          method: 'post',
          url: apiUrl,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          alert('CSV file uploaded successfully');
          // Fetch pricelist data again after successful upload
          fetchPricelistData();
        } else {
          console.error('Error uploading file:', response.statusText);
        }
      } catch (error) {
        console.error('Error uploading file in catch:', error.message);
      }
    }
  };

  const fetchPricelistData = async () => {
    try {

      const response = await axios.get('https://diamondsoft-backend.onrender.com/api/details');
      setPricelistData(response.data);
    } catch (error) {
      console.error('Error fetching pricelist data:', error);
    }
  };

  return (
    <div className="">
      <form onSubmit={(e) => handleSubmit(e, setPricelistData)} className="rounded sm:flex space-x-4">

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Select Your PriceList Type</label>
          <div className="flex items-center">
            <input
              type="radio"
              id="own"
              name="price_type"
              value="own"
              checked={priceType === 'own'}
              onChange={() => handlePriceTypeChange('own')}
              className="mr-2 leading-tight"
            />
            <label htmlFor="own" className="text-sm">Own</label>
            <input
              type="radio"
              id="Rep"
              name="price_type"
              value="Rep"
              checked={priceType === 'Rep'}
              onChange={() => handlePriceTypeChange('Rep')}
              className="mr-2 ml-4 leading-tight"
            />
            <label htmlFor="Rep" className="text-sm">Rep</label>
          </div>
        </div>


        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Enter Date of the Pricelist</label>
          <input type="date" name="date" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>


        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Upload CSV File</label>
          <input type="file" onChange={handleFileChange} className="shadow bg-white appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>


        <div className="flex items-center justify-between">
          <button type="submit" className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Upload</button>
        </div>

      </form>
    </div>
  );
};

export default FileUploadForm;
