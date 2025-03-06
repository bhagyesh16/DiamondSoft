import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LB_tinich = () => {
    const [LB_id, setLBId] = useState('');
    const [LB_name, setLBName] = useState('');
    const [LB_order,setLBOrder] = useState('');
    const [LBData, setLBData] = useState([]);
    const [selectedLB, setSelectedLB] = useState(null);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        // If selectedLB is set, perform update
        if (selectedLB) {

          const response = await axios.put(`https://diamondsoft-backend.onrender.com/master/LB/${selectedLB.LB_id}`, {
            LB_name,
            LB_order,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log('Update Response:', response.data);
          // Reset selectedLB after update
          setSelectedLB(null);
        } else {
          // Make a POST request to your API endpoint

          const response = await axios.post('https://diamondsoft-backend.onrender.com/master/LB', {
            LB_id,
            LB_name,
            LB_order,
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
        setLBId('');
        setLBName('');
        setLBOrder('');
        // Fetch and update the data after submission
        fetchLBData();
      } catch (error) {
        // Handle errors, e.g., display an error message to the user
        console.error('Error posting/updating data to API:', error);
        alert('Unable to Add/Update LB as there was an error');
      }
    };
  
    const fetchLBData = async () => {
      try {
        // Fetch data from the API endpoint

        const response = await axios.get('https://diamondsoft-backend.onrender.com/master/LB');
  
        // Update the state with the fetched data
        setLBData(response.data);
      } catch (error) {
        console.error('Error fetching data from API:', error);
      }
    };
  
    const handleDelete = async (id) => {
      try {
        // Make a DELETE request to your API endpoint

        const response = await axios.delete(`https://diamondsoft-backend.onrender.com/master/LB/${id}`);
        // Handle the response as needed
        console.log('Delete Response:', response.data);
        alert(`LB ${id} Deleted Successfully`);
        // Fetch and update the data after deletion
        fetchLBData();
      } catch (error) {
        alert(`Unable to delete LB: ${id}`);
        console.error('Error deleting data from API:', error);
      }
    };
  
    const handleUpdate = (LB) => {
      // Set the selected LB for updating
      setSelectedLB(LB);
  
      // Populate the form fields with the selected LB's data
      setLBId(LB.LB_id);
      setLBName(LB.LB_name);
      setLBOrder(LB.LB_order);
    };
  
    // Fetch data on component mount
    useEffect(() => {
      fetchLBData();
    }, []);
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-8">
        <div className='sm:col-span-2 p-4 sm:p-8'>
          <form onSubmit={handleSubmit} className="bg-teal-800 p-4 rounded-lg shadow-md w-64">
            <div className="mb-2">
              <label className="block text-white">
                LB ID:
                <input
                  placeholder='ENTER LB ID'
                  type="text"
                  value={LB_id}
                  onChange={(e) => setLBId(e.target.value)}
                  className="block w-full mt-2 p-2 rounded-md text-black border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
                />
              </label>
            </div>
            <div className="mb-2">
              <label className="block text-white">
                LB Name:
                <input
                  placeholder='ENTER LB NAME'
                  type="text"
                  value={LB_name}
                  onChange={(e) => setLBName(e.target.value)}
                  className="block w-full mt-2 p-2 rounded-md text-black border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
                />
              </label>
            </div>
            <div className="mb-2">
              <label className="block text-white">
                LB ORDER:
                <input
                  placeholder='ENTER LB ORDER'
                  type="text"
                  value={LB_order}
                  onChange={(e) => setLBOrder(e.target.value)}
                  className="block w-full mt-2 p-2 rounded-md text-black border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
                />
              </label>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded">
                {selectedLB ? 'Update' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
        <div className='sm:col-span-6 p-4 sm:p-8'>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 bg-teal-200">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">LB ID</th>
                  <th className="border border-gray-300 px-4 py-2">LB Name</th>
                  <th className="border border-gray-300 px-4 py-2">LB Order</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {LBData.map((LB, index) => (
                  <tr key={LB.LB_id} className={index % 2 === 1 ? 'bg-teal-100' : 'bg-white'}>
                    <td className="border border-gray-300 px-4 py-2">{LB.LB_id}</td>
                    <td className="border border-gray-300 px-4 py-2">{LB.LB_name}</td>
                    <td className="border border-gray-300 px-4 py-2">{LB.LB_order}</td>
                    <td className="border border-gray-300 flex p-2">
                      <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded" onClick={() => handleDelete(LB.LB_id)}>Delete</button>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded ml-2" onClick={() => handleUpdate(LB)}>Update</button>
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

export default LB_tinich