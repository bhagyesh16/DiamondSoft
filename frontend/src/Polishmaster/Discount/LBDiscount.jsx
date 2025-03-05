import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ColourDropdown from '../../Homecomponents/ColorDropdown';
import ShapeDropdown from '../../Homecomponents/ShapeDropdown';
import PurityDropdown from '../../Homecomponents/PurityDropdown';
import LBDropdown from '../LBDropdown';
import { useAuth } from '../../AuthContext';

const LBDiscount = () => {
    const { isAuthenticatedFn, setAuthToken, resetAuthToken } = useAuth();
    const navigate = useNavigate();
    const [selectedColour, setColourData] = useState('');
    const [selectedshape, setShapeData] = useState('');
    const [selectedPurity, setPurityData] = useState('');
    const [selectedLB, setSelectedLB] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        from_size: '',
        to_size: '',
        discount: ''
    });
    const [pricelistData, setPricelistData] = useState([]);
    const [csvFile, setCsvFile] = useState(null);

    const fetchPricelistData = async () => {
        try {
            const response = await axios.get('http://192.168.1.59:5000/api/lbdiscount');
            setPricelistData(response.data);
        } catch (error) {
            console.error('Error fetching pricelist data:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Your API call logic here
            } catch (error) {
                console.error('Error fetching data:', error);
                console.log('token set in pricelist');
                resetAuthToken(null);
            }
        };

        if (isAuthenticatedFn()) {
            fetchData();
            fetchPricelistData();
        }
    }, [isAuthenticatedFn, navigate, setAuthToken, resetAuthToken]);


    const handleEdit = async (id) => {
        try {
            const response = await axios.get(`http://192.168.1.59:5000/api/lbdiscount/${id}`);

            const pricelistData = response.data;
            console.log(`data from edit :`, pricelistData);
            // Set pricelist data to the form for editing
            setFormData({
                id: pricelistData.id,
                from_size: pricelistData.from_size,
                to_size: pricelistData.to_size,
                discount: pricelistData.discount,
            });

            // Set selected values for dropdowns
            setShapeData(pricelistData.shape);
            setColourData(pricelistData.colour);
            setPurityData(pricelistData.purity);
            setSelectedLB(pricelistData.lb);

            setSubmitting(false);
        } catch (error) {
            console.error('Error fetching pricelist data for edit:', error);
        }
    };

    const handleUpdate = async () => {
        setSubmitting(true);
        try {
            const UpdatedFormData = {
                id: formData.id,
                colour: selectedColour,
                shape: selectedshape,
                purity: selectedPurity,
                lb: selectedLB,
                from_size: formData.from_size,
                to_size: formData.to_size,
                discount: formData.discount,
            };

            console.log('Updating data...');
            console.log('UpdatedFormData:', UpdatedFormData);

            await axios.put(`http://192.168.1.59:5000/api/lbdiscount/${formData.id}`, UpdatedFormData);
            alert('Data updated successfully!');
            setFormData({
                id: '',
                from_size: '',
                to_size: '',
                discount: ''
            });
            fetchPricelistData();
        } catch (error) {
            console.error('Error updating data:', error);
            alert('Error updating data. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            // Delete pricelist by pricelistId
            await axios.delete(`http://192.168.1.59:5000/api/lbdiscount/${id}`);
            alert(`pricelist ${id} is deleted successfully`)
            // Fetch updated pricelist data
            fetchPricelistData();
        } catch (error) {
            console.error('Error deleting pricelist:', error);
        }
    };


    const handleSubmit = async () => {
        setSubmitting(true);

        try {
            const InsertedFormData = {
                ...formData,
                id: document.querySelector('input[name="id"]').value,
                colour: selectedColour,
                shape: selectedshape,
                purity: selectedPurity,
                lb: selectedLB === "" ? null : selectedLB,
                from_size: document.querySelector('input[name="from_size"]').value,
                to_size: document.querySelector('input[name="to_size"]').value,
                discount: document.querySelector('input[name="discount"]').value,
            };

            await axios.post('http://192.168.1.59:5000/api/lbdiscount', InsertedFormData);
            alert('Data submitted successfully!');
            setFormData({
                id: '',
                from_size: '',
                to_size: '',
                discount: ''
            });
            fetchPricelistData();
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Error submitting data. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleFileChange = (event) => {
        setCsvFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!csvFile) {
            alert('Please select a CSV file to upload.');
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('file', csvFile);

            await axios.post('http://192.168.1.59:5000/api/lbdiscount/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert('CSV file uploaded successfully!');

            fetchPricelistData();
        } catch (error) {
            console.error('Error uploading CSV file:', error);
            alert('Error uploading CSV file. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return isAuthenticatedFn() ? (
        <>
            <div className='grid grid-cols-1 md:grid-cols-8 p-2'>

                <div className='col-span-1 md:col-span-2 p-2'>
                    <form className='bg-teal-200 p-4 rounded-lg'>
                        <div className="">
                            <h1 className="text-2xl font-bold mb-4">SET LB DISCOUNT</h1>
                            <label className="block">ENTER LB DISCOUNT ID</label>
                            <input
                                type="number"
                                name="id"
                                value={formData.id}
                                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                className="mt-1 p-2 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                            />

                            <label className="block mt-4">SELECTED SHAPE</label>
                            <ShapeDropdown value={selectedshape} onChange={(value) => setShapeData(value)} />
                            <label className="block mt-4">SELECTED COLOUR</label>
                            <ColourDropdown value={selectedColour} onChange={(value) => setColourData(value)} />
                            <label className="block mt-4">SELECTED PURITY</label>
                            <PurityDropdown value={selectedPurity} onChange={(value) => setPurityData(value)} />
                            <label className="block mt-4">ENTER FROM_SIZE</label>
                            <input
                                type="number"
                                name="from_size"
                                value={formData.from_size}
                                onChange={(e) => setFormData({ ...formData, from_size: e.target.value })}
                                className="mt-1 p-2 block w-full rounded-md  text-black border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                            />
                            <label className="block mt-4">ENTER TO_SIZE</label>
                            <input
                                type="number"
                                name="to_size"
                                value={formData.to_size}
                                onChange={(e) => setFormData({ ...formData, to_size: e.target.value })}
                                className="mt-1 p-2 block w-full rounded-md  text-black border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                            />
                            <label className="block mt-4">SELECTED LB</label>
                            <LBDropdown value={selectedLB} onChange={(value) => setSelectedLB(value)} />
                            <label className="block mt-4">ENTER DISCOUNT</label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                className="mt-1 p-2 block w-full rounded-md  text-black border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                            />
                            <div className="mt-4 flex justify-center">
                                <button onClick={handleSubmit} disabled={submitting} className="bg-teal-500 text-white py-2 px-4 mt-4 mr-2 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">Submit</button>
                                <button onClick={handleUpdate} disabled={submitting} className="bg-teal-500 text-white py-2 px-4 mt-4 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">Update</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className='col-span-1 md:col-span-6 p-2'>

                    <div className='bg-teal-200 w-full mb-4 p-2 sm:flex justify-center items-center rounded-lg'>
                        <label className="text-lg font-bold ">UPLOAD YOUR LB DISCOUNT CSV</label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="p-2"
                        />
                        <button
                            onClick={handleUpload}
                            disabled={submitting}
                            className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Upload
                        </button>
                    </div>

                    <div className="bg-teal-200 w-full p-4 rounded-lg">
                        <h2 className="text-xl font-bold mb-2">LB DISCOUNT DATA</h2>
                        <table className="colour-table w-full text-center border-collapse border-2 border-black">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border-2 border-black">ID</th>
                                    <th className="px-4 py-2 border-2 border-black">Shape</th>
                                    <th className="px-4 py-2 border-2 border-black">Colour</th>
                                    <th className="px-4 py-2 border-2 border-black">Purity</th>
                                    <th className="px-4 py-2 border-2 border-black">F SIZE</th>
                                    <th className="px-4 py-2 border-2 border-black">T SIZE</th>
                                    <th className="px-4 py-2 border-2 border-black">LB</th>
                                    <th className="px-4 py-2 border-2 border-black">DISCOUNT</th>
                                    <th className="px-4 py-2 border-2 border-black">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pricelistData.map((item, index) => (
                                    <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-teal-100'}`}>
                                        <td className="px-4 py-2 border-2 border-black">{item.id}</td>
                                        <td className="px-4 py-2 border-2 border-black">{item.shape_name}</td>
                                        <td className="px-4 py-2 border-2 border-black">{item.colour_name}</td>
                                        <td className="px-4 py-2 border-2 border-black">{item.purity_name}</td>
                                        <td className="px-4 py-2 border-2 border-black">{item.from_size}</td>
                                        <td className="px-4 py-2 border-2 border-black">{item.to_size}</td>
                                        <td className="px-4 py-2 border-2 border-black">{item.LB_name}</td>
                                        <td className="px-4 py-2 border-2 border-black">{item.discount}</td>
                                        <td className="px-2 py-2 flex space-x-1 p-2">
                                            <button onClick={() => handleEdit(item.id)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded">Edit</button>
                                            <button onClick={() => handleDelete(item.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>
        </>
    ) : null;
}

export default LBDiscount