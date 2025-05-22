// ShapeForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShapeForm = () => {
  const [shape_id, setShapeId] = useState('');
  const [shape_name, setShapeName] = useState('');
  const [shapeData, setShapeData] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // If selectedShape is set, perform update
      if (selectedShape) {
        const response = await axios.put(`http://192.168.1.59:5000/master/shape/${selectedShape.shape_id}`, {
          shape_name,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Update Response:', response.data);
        // Reset selectedShape after update
        setSelectedShape(null);
      } else {
        // Make a POST request to your API endpoint
        const response = await axios.post('http://192.168.1.59:5000/master/shape', {
          shape_id,
          shape_name,
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
      setShapeId('');
      setShapeName('');

      // Fetch and update the data after submission
      fetchShapeData();
    } catch (error) {
      // Handle errors, e.g., display an error message to the user
      console.error('Error posting/updating data to API:', error);
      alert('Unable to Add/Update Shape as there was an error');
    }
  };

  const fetchShapeData = async () => {
    try {
      // Fetch data from the API endpoint
      const response = await axios.get('http://192.168.1.59:5000/master/shape');

      // Update the state with the fetched data
      setShapeData(response.data);
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Make a DELETE request to your API endpoint
      const response = await axios.delete(`http://192.168.1.59:5000/master/shape/${id}`);

      // Handle the response as needed
      console.log('Delete Response:', response.data);
      alert(`Shape ${id} Deleted Successfully`);
      // Fetch and update the data after deletion
      fetchShapeData();
    } catch (error) {
      alert(`Unable to delete shape: ${id}`);
      console.error('Error deleting data from API:', error);
    }
  };

  const handleUpdate = (shape) => {
    // Set the selected shape for updating
    setSelectedShape(shape);

    // Populate the form fields with the selected shape's data
    setShapeId(shape.shape_id);
    setShapeName(shape.shape_name);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchShapeData();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-8">
      <div className='sm:col-span-2 p-4 sm:p-8'>
        <form onSubmit={handleSubmit} className="bg-teal-800 p-4 rounded-lg shadow-md">
          <div className="mb-2">
            <label className="block text-white">
              Shape ID:
              <input
                placeholder='ENTER SHAPE ID'
                type="text"
                value={shape_id}
                onChange={(e) => setShapeId(e.target.value)}
                className="block w-full mt-2 p-2 rounded-md text-black border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              />
            </label>
          </div>

          <div className="mb-2">
            <label className="block text-white">
              Shape Name:
              <input
                placeholder='ENTER SHAPE NAME'
                type="text"
                value={shape_name}
                onChange={(e) => setShapeName(e.target.value)}
                className="block w-full mt-2 p-2 rounded-md text-black border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              />
            </label>
          </div>

          <div className='flex justify-end'>
            <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded ">
              {selectedShape ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      <div className='sm:col-span-6 p-2 sm:p-8'>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 bg-teal-200">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Shape ID</th>
                <th className="border border-gray-300 px-4 py-2">Shape Name</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shapeData.map((shape, index) => (
                <tr key={shape.shape_id} className={index % 2 === 1 ? "bg-teal-100" : "bg-white"}>
                  <td className="border border-gray-300 px-4 py-2">{shape.shape_id}</td>
                  <td className="border border-gray-300 px-4 py-2">{shape.shape_name}</td>
                  <td className="border border-gray-300 flex p-2">
                    <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded" onClick={() => handleDelete(shape.shape_id)}>Delete</button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded ml-2" onClick={() => handleUpdate(shape)}>Update</button>
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

export default ShapeForm;
