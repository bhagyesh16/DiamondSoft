// CutForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CutForm = () => {
  const [cut_id, setCutId] = useState('');
  const [cut_name, setCutName] = useState('');
  const [cutData, setCutData] = useState([]);
  const [selectedCut, setSelectedCut] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // If selectedCut is set, perform update
      if (selectedCut) {

        const response = await axios.put(`http://192.168.1.59:5000/master/cut/${selectedCut.cut_id}`, {
          cut_name,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Update Response:', response.data);
        // Reset selectedCut after update
        setSelectedCut(null);
      } else {
        // Make a POST request to your API endpoint

        const response = await axios.post('http://192.168.1.59:5000/master/cut', {
          cut_id,
          cut_name,
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
      setCutId('');
      setCutName('');

      // Fetch and update the data after submission
      fetchCutData();
    } catch (error) {
      // Handle errors, e.g., display an error message to the user
      console.error('Error posting/updating data to API:', error);
      alert('Unable to Add/Update Cut as there was an error');
    }
  };

  const fetchCutData = async () => {
    try {
      // Fetch data from the API endpoint

      const response = await axios.get('http://192.168.1.59:5000/master/cut');

      // Update the state with the fetched data
      setCutData(response.data);
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Make a DELETE request to your API endpoint

      const response = await axios.delete(`http://192.168.1.59:5000/master/cut/${id}`);

      // Handle the response as needed
      console.log('Delete Response:', response.data);
      alert(`Cut ${id} Deleted Successfully`);
      // Fetch and update the data after deletion
      fetchCutData();
    } catch (error) {
      alert(`Unable to delete cut: ${id}`);
      console.error('Error deleting data from API:', error);
    }
  };

  const handleUpdate = (cut) => {
    // Set the selected cut for updating
    setSelectedCut(cut);

    // Populate the form fields with the selected cut's data
    setCutId(cut.cut_id);
    setCutName(cut.cut_name);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCutData();
  }, []);

  return (  
    <div className="sm:grid grid-cols-8">
      <div className="sm:col-span-2 p-8">
        <form onSubmit={handleSubmit} className="bg-teal-800 p-4 rounded-lg shadow-md w-64">
          <div className="mb-2">
            <label className="block text-white p-4">
              Cut ID:
              <input
                placeholder="ENTER Cut ID"
                type="text"
                value={cut_id}
                onChange={(e) => setCutId(e.target.value)}
                className="block w-full mt-2 p-2 rounded-md text-black border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              />
            </label>
          </div>
        <div className="mb-2">
            <label className="block text-white p-4">
              Cut Name:
              <input
                placeholder="ENTER Cut NAME"
                type="text"
                value={cut_name}
                onChange={(e) => setCutName(e.target.value)}
                className="block w-full mt-2 p-2 rounded-md text-black border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              />
            </label>
        </div>
          <div className="flex flex-row-reverse p-4">
            <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded">
              {selectedCut ? "Update" : "Submit"}
            </button>
        </div>
      </form>
      </div>
      <div className="sm:col-span-6 p-8">
        <div className="overflow-x-auto">
          <table className="border-collapse border border-gray-300 bg-teal-200 w-full">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Cut ID</th>
                <th className="border border-gray-300 px-4 py-2">Cut Name</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cutData.map((Cut, index) => (
                <tr
                  key={Cut.cut_id}
                  className={index % 2 === 1 ? "bg-teal-100" : "bg-white"}
                >
                  <td className="border border-gray-300 px-4 py-2">{Cut.cut_id}</td>
                  <td className="border border-gray-300 px-4 py-2">{Cut.cut_name}</td>
                  <td className="border border-gray-300 flex px-4 p-2">
                    <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded" onClick={() => handleDelete(Cut.cut_id)}>Delete</button>&nbsp;
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded ml-2" onClick={() => handleUpdate(Cut)}>Update</button>
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

export default CutForm;
