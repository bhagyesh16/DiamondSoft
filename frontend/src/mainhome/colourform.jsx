import React, { useState, useEffect } from 'react';
import axios from 'axios';


const ColourForm = () => {
  const [colour_id, setColourId] = useState('');
  const [colour_name, setColourName] = useState('');
  const [colourData, setColourData] = useState([]);
  const [selectedColour, setSelectedColour] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // If selectedColour is set, perform update
      if (selectedColour) {

        const response = await axios.put(`http://192.168.1.59:5000/master/colour/${selectedColour.colour_id}`, {
          colour_name,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Update Response:', response.data);
        // Reset selectedColour after update
        setSelectedColour(null);
      } else {
        // Make a POST request to your API endpoint

        const response = await axios.post('http://192.168.1.59:5000/master/colour', {
          colour_id,
          colour_name,
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
      setColourId('');
      setColourName('');

      // Fetch and update the data after submission
      fetchColourData();
    } catch (error) {
      // Handle errors, e.g., display an error message to the user
      console.error('Error posting/updating data to API:', error);
      alert('Unable to Add/Update Colour as there was an error');
    }
  };

  const fetchColourData = async () => {
    try {
      // Fetch data from the API endpoint

      const response = await axios.get('http://192.168.1.59:5000/master/colour');
      // Update the state with the fetched data
      setColourData(response.data);
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Make a DELETE request to your API endpoint

      const response = await axios.delete(`http://192.168.1.59:5000/master/colour/${id}`);
      
      // Handle the response as needed
      console.log('Delete Response:', response.data);
      alert(`Colour ${id} Deleted Successfully`);
      // Fetch and update the data after deletion
      fetchColourData();
    } catch (error) {
      alert(`unable to delete colour: ${id}`);
      console.error('Error deleting data from API:', error);
    }
  };

  const handleUpdate = (colour) => {
    // Set the selected colour for updating
    setSelectedColour(colour);

    // Populate the form fields with the selected colour's data
    setColourId(colour.colour_id);
    setColourName(colour.colour_name);

  };

  // Fetch data on component mount
  useEffect(() => {
    fetchColourData();
  }, []);

  return (

    <div className="sm:grid grid-cols-8">

      <div className='sm:col-span-2 p-8'>
      <form onSubmit={handleSubmit} className="bg-teal-800 p-4 rounded-lg shadow-md w-64">
        <div className="mb-2">
          <label className="block text-white p-4">
            Colour ID:
            <input
              placeholder='ENTER COLOUR ID'
              type="text"
              value={colour_id}
              onChange={(e) => setColourId(e.target.value)}
              className="block w-full mt-2 p-2 rounded-md text-black border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
            />
          </label>
        </div>

        <div className="mb-2">
          <label className="block text-white p-4">
              Colour Name:
            <input
              placeholder='ENTER COLOUR NAME'
              type="text"
              value={colour_name}
              onChange={(e) => selectedColour(e.target.value)}
              className="block w-full mt-2 p-2 rounded-md text-black border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
            />
          </label>
        </div>

        <div className=' flex flex-row-reverse p-4'>
          <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded ">
            {selectedColour ? 'Update' : 'Submit'}
          </button>
          </div>
        </form>
    </div>

    <div className='sm:col-span-6 p-8'>
        <table className="colour-table border-collapse border border-gray-300 bg-teal-200 w-full">
        <thead>
          <tr>
              <th className="border border-gray-300 px-4 py-2">Colour ID</th>
              <th className="border border-gray-300 px-4 py-2">Colour Name</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {colourData.map((colour, index) => (
            <tr key={colour.colour_id} className={index % 2 === 1 ? 'bg-teal-100' : 'bg-white'}>
              <td className="border border-gray-300 px-4 py-2">{colour.colour_id}</td>
              <td className="border border-gray-300 px-4 py-2">{colour.colour_name}</td>
              <td className="border border-gray-300 flex px-4 p-2">
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded" onClick={() => handleDelete(colour.colour_id)}>Delete</button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded ml-2" onClick={() => handleUpdate(colour)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>




    // <div className="container">
    //   <form onSubmit={handleSubmit}>
    //     <label>
    //       Colour ID:
    //       <input
    //         placeholder='ENTER COLOUR ID'
    //         type="text"
    //         value={colour_id}
    //         onChange={(e) => setColourId(e.target.value)}
    //       />
    //     </label>
    //     <br />
    //     <label>
    //       Colour Name:
    //       <input
    //         placeholder='ENTER COLOUR NAME'
    //         type="text"
    //         value={colour_name}
    //         onChange={(e) => setColourName(e.target.value)}  
    //       />
    //     </label>
    //     <br />
    //     <button type="submit">{selectedColour ? 'Update' : 'Submit'}</button>
    //   </form>
    // <br/>
    //   <table className="colour-table">
    //     <thead>
    //       <tr>
    //         <th>Colour ID</th>
    //         <th>Colour Name</th>
    //         <th>Actions</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {colourData.map((colour) => (
    //         <tr key={colour.colour_id}>
    //           <td>{colour.colour_id}</td>
    //           <td>{colour.colour_name}</td>
    //           <td>
    //             <button onClick={() => handleDelete(colour.colour_id)}>Delete</button>&nbsp;
    //             <button onClick={() => handleUpdate(colour)}>Update</button>
    //           </td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>
  );
};

export default ColourForm;
