import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Natts = () => {
    const [natts_id, setnattsId] = useState('');
    const [natts_name, setnattsName] = useState('');
    const [natts_order,setnattsOrder] = useState('');
    const [nattsData, setnattsData] = useState([]);
    const [selectednatts, setSelectednatts] = useState(null);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        // If selectednatts is set, perform update
        if (selectednatts) {
          const response = await axios.put(`http://192.168.1.59:5000/master/natts/${selectednatts.natts_id}`, {
            natts_name,
            natts_order,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log('Update Response:', response.data);
          // Reset selectednatts after update
          setSelectednatts(null);
        } else {
          // Make a POST request to your API endpoint
          const response = await axios.post('http://192.168.1.59:5000/master/natts', {
            natts_id,
            natts_name,
            natts_order,
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
        setnattsId('');
        setnattsName('');
        setnattsOrder('');
        // Fetch and update the data after submission
        fetchnattsData();
      } catch (error) {
        // Handle errors, e.g., display an error message to the user
        console.error('Error posting/updating data to API:', error);
        alert('Unable to Add/Update natts as there was an error');
      }
    };
  
    const fetchnattsData = async () => {
      try {
        // Fetch data from the API endpoint
        const response = await axios.get('http://192.168.1.59:5000/master/natts');
  
        // Update the state with the fetched data
        setnattsData(response.data);
      } catch (error) {
        console.error('Error fetching data from API:', error);
      }
    };
  
    const handleDelete = async (id) => {
      try {
        // Make a DELETE request to your API endpoint
        const response = await axios.delete(`http://192.168.1.59:5000/master/natts/${id}`);
  
        // Handle the response as needed
        console.log('Delete Response:', response.data);
        alert(`natts ${id} Deleted Successfully`);
        // Fetch and update the data after deletion
        fetchnattsData();
      } catch (error) {
        alert(`Unable to delete natts: ${id}`);
        console.error('Error deleting data from API:', error);
      }
    };
  
    const handleUpdate = (natts) => {
      // Set the selected natts for updating
      setSelectednatts(natts);
  
      // Populate the form fields with the selected natts's data
      setnattsId(natts.natts_id);
      setnattsName(natts.natts_name);
      setnattsOrder(natts.natts_order);
    };
  
    // Fetch data on component mount
    useEffect(() => {
      fetchnattsData();
    }, []);
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-8">
        <div className='sm:col-span-2 p-4 sm:p-8'>
          <form onSubmit={handleSubmit} className="bg-teal-800 p-4 rounded-lg shadow-md w-64">
            <div className="mb-2">
              <label className="block text-white">
                NATTS ID:
                <input
                  placeholder='ENTER NATTS ID'
                  type="text"
                  value={natts_id}
                  onChange={(e) => setnattsId(e.target.value)}
                  className="block w-full mt-2 p-2 rounded-md text-black border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
                />
              </label>
            </div>

            <div className="mb-2">
              <label className="block text-white">
                NATTS Name:
                <input
                  placeholder='ENTER NATTS NAME'
                  type="text"
                  value={natts_name}
                  onChange={(e) => setnattsName(e.target.value)}
                  className="block w-full mt-2 p-2 rounded-md text-black border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
                />
              </label>
            </div>

            <div className="mb-2">
              <label className="block text-white">
                NATTS Order:
                <input
                  placeholder='ENTER NATTS ORDER'
                  type="text"
                  value={natts_order}
                  onChange={(e) => setnattsOrder(e.target.value)}
                  className="block w-full mt-2 p-2 rounded-md text-black border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
                />
              </label>
            </div>

            <div className='flex justify-end'>
              <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded">
                {selectednatts ? 'Update' : 'Submit'}
              </button>
            </div>
          </form>
        </div>

        <div className='sm:col-span-6 p-4 sm:p-8'>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 bg-teal-200">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">NATTS ID</th>
                  <th className="border border-gray-300 px-4 py-2">NATTS Name</th>
                  <th className="border border-gray-300 px-4 py-2">NATTS Order</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {nattsData.map((natts, index) => (
                  <tr key={natts.natts_id} className={index % 2 === 1 ? "bg-teal-100" : "bg-white"}>
                    <td className="border border-gray-300 px-4 py-2">{natts.natts_id}</td>
                    <td className="border border-gray-300 px-4 py-2">{natts.natts_name}</td>
                    <td className="border border-gray-300 px-4 py-2">{natts.natts_order}</td>
                    <td className="border border-gray-300 flex p-2">
                      <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded" onClick={() => handleDelete(natts.natts_id)}>Delete</button>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded ml-2" onClick={() => handleUpdate(natts)}>Update</button>
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

export default Natts