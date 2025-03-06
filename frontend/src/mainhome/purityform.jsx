import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PurityForm = () => {
  const [purity_id, setPurityId] = useState('');
  const [purity_name, setPurityName] = useState('');
  const [purityData, setPurityData] = useState([]);
  const [selectedPurity, setSelectedPurity] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // If selectedPurity is set, perform update
      if (selectedPurity) {

        const response = await axios.put(`https://diamondsoft-backend.onrender.com/master/purity/${selectedPurity.purity_id}`, {
          purity_name,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Update Response:', response.data);
        // Reset selectedPurity after update
        setSelectedPurity(null);
      } else {
        // Make a POST request to your API endpoint

        const response = await axios.post('https://diamondsoft-backend.onrender.com/master/purity', {
          purity_id,
          purity_name,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Handle the response as needed
        console.log('API Response:', response.data);
        alert(`Data Added Successfully`);
      }

      // Reset the form fields after submission
      setPurityId('');
      setPurityName('');

      // Fetch and update the data after submission
      fetchPurityData();
    } catch (error) {
      // Handle errors, e.g., display an error message to the user
      console.error('Error posting/updating data to API:', error);
      alert('Unable to Add/Update Purity as there was an error');
    }
  };

  const fetchPurityData = async () => {
    try {
      // Fetch data from the API endpoint

      const response = await axios.get('https://diamondsoft-backend.onrender.com/master/purity');

      // Update the state with the fetched data
      setPurityData(response.data);
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Make a DELETE request to your API endpoint

      const response = await axios.delete(`https://diamondsoft-backend.onrender.com/master/purity/${id}`);

      // Handle the response as needed
      console.log('Delete Response:', response.data);
      alert(`Purity ${id} Deleted Successfully`);
      // Fetch and update the data after deletion
      fetchPurityData();
    } catch (error) {
      alert(`Unable to delete Purity: ${id}`);
      console.error('Error deleting data from API:', error);
    }
  };

  const handleUpdate = (purity) => {
    // Set the selected purity for updating
    setSelectedPurity(purity);

    // Populate the form fields with the selected purity's data
    setPurityId(purity.purity_id);
    setPurityName(purity.purity_name);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchPurityData();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-8">
      <div className='sm:col-span-2 p-4 sm:p-8'>
        <form onSubmit={handleSubmit} className="bg-teal-800 p-4 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-white">
              Purity ID:
              <input
                placeholder='ENTER PURITY ID'
                type="text"
                value={purity_id}
                onChange={(e) => setPurityId(e.target.value)}
                className="block w-full mt-2 p-2 rounded-md text-black border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              />
            </label>
        </div>

          <div className="mb-4">
            <label className="block text-white">
              Purity Name:
              <input
                placeholder='ENTER PURITY NAME'
                type="text"
                value={purity_name}
                onChange={(e) => setPurityName(e.target.value)}
                className="block w-full mt-2 p-2 rounded-md text-black border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              />
            </label>
        </div>
        
          <div className='flex justify-end'>
            <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded ">
              {selectedPurity ? 'Update' : 'Submit'}
            </button>
        </div>
      </form>
      </div>

      <div className='sm:col-span-6 p-4 sm:p-8'>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 bg-teal-200">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Purity ID</th>
                <th className="border border-gray-300 px-4 py-2">Purity Name</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purityData.map((purity, index) => (
                <tr key={purity.purity_id} className={index % 2 === 1 ? "bg-teal-100" : "bg-white"}>
                  <td className="border border-gray-300 px-4 py-2">{purity.purity_id}</td>
                  <td className="border border-gray-300 px-4 py-2">{purity.purity_name}</td>
                  <td className="border border-gray-300 flex px-4 py-2">
                    <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded" onClick={() => handleDelete(purity.purity_id)}>Delete</button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded ml-2" onClick={() => handleUpdate(purity)}>Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
    </div>

  );
};

export default PurityForm;
