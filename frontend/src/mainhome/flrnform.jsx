import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FlrnForm = () => {
  const [flrn_id, setFlrnId] = useState('');
  const [flrn_name, setFlrnName] = useState('');
  const [flrnData, setFlrnData] = useState([]);
  const [selectedFlrn, setSelectedFlrn] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // If selectedFlrn is set, perform update
      if (selectedFlrn) {

        const response = await axios.put(`http://192.168.1.59:5000/master/flrn/${selectedFlrn.flrn_id}`, {
          flrn_name,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Update Response:', response.data);
        // Reset selectedFlrn after update
        setSelectedFlrn(null);
      } else {
        // Make a POST request to your API endpoint

        const response = await axios.post('http://192.168.1.59:5000/master/flrn', {
          flrn_id,
          flrn_name,
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
      setFlrnId('');
      setFlrnName('');

      // Fetch and update the data after submission
      fetchFlrnData();
    } catch (error) {
      // Handle errors, e.g., display an error message to the user
      console.error('Error posting/updating data to API:', error);
      alert('Unable to Add/Update FLRN as there was an error');
    }
  };

  const fetchFlrnData = async () => {
    try {
      // Fetch data from the API endpoint

      const response = await axios.get('http://192.168.1.59:5000/master/flrn');

      // Update the state with the fetched data
      setFlrnData(response.data);
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Make a DELETE request to your API endpoint

      const response = await axios.delete(`http://192.168.1.59:5000/master/flrn/${id}`);

      // Handle the response as needed
      console.log('Delete Response:', response.data);
      alert(`FLRN ${id} Deleted Successfully`);
      // Fetch and update the data after deletion
      fetchFlrnData();
    } catch (error) {
      alert(`Unable to delete FLRN: ${id}`);
      console.error('Error deleting data from API:', error);
    }
  };

  const handleUpdate = (flrn) => {
    // Set the selected flrn for updating
    setSelectedFlrn(flrn);

    // Populate the form fields with the selected flrn's data
    setFlrnId(flrn.flrn_id);
    setFlrnName(flrn.flrn_name);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchFlrnData();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-8">
      <div className='sm:col-span-2 p-4 sm:p-8'>
        <form onSubmit={handleSubmit} className="bg-teal-800 p-4 rounded-lg shadow-md w-64">
          <div className="mb-2">
            <label className="block text-white">
              Flrn ID:
              <input
                placeholder='ENTER Flrn ID'
                type="text"
                value={flrn_id}
                onChange={(e) => setFlrnId(e.target.value)}
                className="block w-full mt-2 p-2 rounded-md text-black border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              />
            </label>
          </div>
        <div className="mb-2">
            <label className="block text-white">
              Flrn Name:
              <input
                placeholder='ENTER Flrn NAME'
                type="text"
                value={flrn_name}
                onChange={(e) => setFlrnName(e.target.value)}
                className="block w-full mt-2 p-2 rounded-md text-black border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              />
            </label>
        </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded">
              {selectedFlrn ? 'Update' : 'Submit'}
            </button>
        </div>
      </form>
      </div>
      <div className='sm:col-span-6 p-4 sm:p-8'>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 bg-teal-200">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Flrn ID</th>
                <th className="border border-gray-300 px-4 py-2">Flrn Name</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flrnData.map((Flrn, index) => (
                <tr key={Flrn.flrn_id} className={index % 2 === 1 ? 'bg-teal-100' : 'bg-white'}>
                  <td className="border border-gray-300 px-4 py-2">{Flrn.flrn_id}</td>
                  <td className="border border-gray-300 px-4 py-2">{Flrn.flrn_name}</td>
                  <td className="border border-gray-300 flex p-2">
                    <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded" onClick={() => handleDelete(Flrn.flrn_id)}>Delete</button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded ml-2" onClick={() => handleUpdate(Flrn)}>Update</button>
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

export default FlrnForm;
