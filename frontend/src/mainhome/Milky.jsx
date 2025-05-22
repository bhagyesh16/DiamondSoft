import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Milky = () => {
  const [milky_id, setmilkyId] = useState('');
  const [milky_name, setmilkyName] = useState('');
  const [milky_order, setmilkyOrder] = useState('');
  const [milkyData, setmilkyData] = useState([]);
  const [selectedmilky, setSelectedmilky] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // If selectedmilky is set, perform update
      if (selectedmilky) {

        const response = await axios.put(`http://192.168.1.59:5000/master/milky/${selectedmilky.milky_id}`, {
          milky_name,
          milky_order,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Update Response:', response.data);
        // Reset selectedmilky after update
        setSelectedmilky(null);
      } else {
        // Make a POST request to your API endpoint

        const response = await axios.post('http://192.168.1.59:5000/master/milky', {
          milky_id,
          milky_name,
          milky_order,
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
      setmilkyId('');
      setmilkyName('');
      setmilkyOrder('');
      // Fetch and update the data after submission
      fetchmilkyData();
    } catch (error) {
      // Handle errors, e.g., display an error message to the user
      console.error('Error posting/updating data to API:', error);
      alert('Unable to Add/Update milky as there was an error');
    }
  };

  const fetchmilkyData = async () => {
    try {
      // Fetch data from the API endpoint

      const response = await axios.get('http://192.168.1.59:5000/master/milky');

      // Update the state with the fetched data
      setmilkyData(response.data);
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Make a DELETE request to your API endpoint

      const response = await axios.delete(`http://192.168.1.59:5000/master/milky/${id}`);

      // Handle the response as needed
      console.log('Delete Response:', response.data);
      alert(`milky ${id} Deleted Successfully`);
      // Fetch and update the data after deletion
      fetchmilkyData();
    } catch (error) {
      alert(`Unable to delete milky: ${id}`);
      console.error('Error deleting data from API:', error);
    }
  };

  const handleUpdate = (milky) => {
    // Set the selected milky for updating
    setSelectedmilky(milky);

    // Populate the form fields with the selected milky's data
    setmilkyId(milky.milky_id);
    setmilkyName(milky.milky_name);
    setmilkyOrder(milky.milky_order);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchmilkyData();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-8">
      <div className='sm:col-span-2 p-4 sm:p-8'>
        <form onSubmit={handleSubmit} className="bg-teal-800 p-4 rounded-lg shadow-md w-64">
          <div className="mb-2">
            <label className="block text-white">
              MILKY ID:
              <input
                placeholder='ENTER MILKY ID'
                type="text"
                value={milky_id}
                onChange={(e) => setmilkyId(e.target.value)}
                className="block w-full mt-2 p-2 rounded-md text-black border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              />
            </label>
          </div>
          <div className="mb-2">
            <label className="block text-white">
              MILKY Name:
              <input
                placeholder='ENTER MILKY NAME'
                type="text"
                value={milky_name}
                onChange={(e) => setmilkyName(e.target.value)}
                className="block w-full mt-2 p-2 rounded-md text-black border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              />
            </label>
          </div>
          <div className="mb-2">
            <label className="block text-white">
              MILKY ORDER:
              <input
                placeholder='ENTER MILKY ORDER'
                type="text"
                value={milky_order}
                onChange={(e) => setmilkyOrder(e.target.value)}
                className="block w-full mt-2 p-2 rounded-md text-black border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              />
            </label>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded">
              {selectedmilky ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
      <div className='sm:col-span-6 p-4 sm:p-8'>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 bg-teal-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">MILKY ID</th>
              <th className="border border-gray-300 px-4 py-2">MILKY Name</th>
              <th className="border border-gray-300 px-4 py-2">MILKY Order</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {milkyData.map((milky, index) => (
              <tr key={milky.milky_id} className={index % 2 === 1 ? 'bg-teal-100' : 'bg-white'}>
                <td className="border border-gray-300 px-4 py-2">{milky.milky_id}</td>
                <td className="border border-gray-300 px-4 py-2">{milky.milky_name}</td>
                <td className="border border-gray-300 px-4 py-2">{milky.milky_order}</td>
                <td className="border border-gray-300 flex p-2">
                  <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded" onClick={() => handleDelete(milky.milky_id)}>Delete</button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded ml-2" onClick={() => handleUpdate(milky)}>Update</button>
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

export default Milky