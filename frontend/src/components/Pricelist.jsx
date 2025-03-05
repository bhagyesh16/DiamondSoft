// Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ColourDropdown from '../Homecomponents/ColorDropdown';
import CutDropdown from '../Homecomponents/CutDropDown';
import ShapeDropdown from '../Homecomponents/ShapeDropdown';
import PurityDropdown from '../Homecomponents/PurityDropdown';
import FlrnDropdown from '../Homecomponents/FlrnDropdown';
import { useAuth } from '../AuthContext';
import Uploadcsv from './Uploadcsv';

const Pricelist = () => {
    const { isAuthenticatedFn, setAuthToken, resetAuthToken } = useAuth();
    const navigate = useNavigate();
    const [selectedColour, setColourData] = useState('');
    const [selectedCut, setCutData] = useState('');
    const [selectedshape, setShapeData] = useState('');
    const [selectedPurity, setPurityData] = useState('');
    const [selectedFlrn, setFlrnData] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        Pricelist_id: '',
        price_date: '',
        price_type: '',
        f_weight: '',
        t_weight: '',
        Rate: '',
    });
    const [pricelistData, setPricelistData] = useState([]);

    const fetchPricelistData = async () => {
        try {
            const response = await axios.get('http://192.168.1.59:5000/api/details');
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






    const handleEdit = async (Pricelist_id) => {
        try {
            // Fetch pricelist data by pricelistId

            const response = await axios.get(`http://192.168.1.59:5000/api/pricelist/${Pricelist_id}`);

            const pricelistData = response.data;
            console.log(pricelistData);
            // Set pricelist data to the form for editing
            setFormData({
                Pricelist_id: pricelistData.Pricelist_id,
                price_date: pricelistData.price_date,
                price_type: pricelistData.price_type,
                f_weight: pricelistData.f_weight,
                t_weight: pricelistData.t_weight,
                Rate: pricelistData.Rate,
            });

            // Set selected values for dropdowns
            setShapeData(pricelistData.shape_id);
            setColourData(pricelistData.colour_id);
            setPurityData(pricelistData.purity_id);
            setCutData(pricelistData.cut_id);
            setFlrnData(pricelistData.flrn_id);

            // You can add more set functions based on your data structure

            // Now, the form is populated with pricelist data, and the user can update it
        } catch (error) {
            console.error('Error fetching pricelist data for edit:', error);
        }
    };

    const handleUpdate = async () => {
        setSubmitting(true);

        try {
            // Similar to handleSubmit, but use axios.put instead of axios.post
            const UpdatedFormData = {
                Pricelist_id: formData.Pricelist_id,
                price_date: formData.price_date,
                price_type: formData.price_type,
                colour_id: selectedColour,
                cut_id: selectedCut,
                shape_id: selectedshape,
                purity_id: selectedPurity,
                flrn_id: selectedFlrn,
                f_weight: formData.f_weight,
                t_weight: formData.t_weight,
                Rate: formData.Rate,
            };


            await axios.put(`http://192.168.1.59:5000/api/pricelist/${formData.Pricelist_id}`, UpdatedFormData);
            alert('Data updated successfully!');
            setFormData({
                Pricelist_id: '',
                price_date: '',
                price_type: '',
                f_weight: '',
                t_weight: '',
                Rate: '',
            });
            fetchPricelistData();
        } catch (error) {
            console.error('Error updating data:', error);
            alert('Error updating data. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (Pricelist_id) => {
        try {
            // Delete pricelist by pricelistId

            await axios.delete(`http://192.168.1.59:5000/api/pricelist/${Pricelist_id}`);
            alert(`pricelist ${Pricelist_id} is deleted successfully`)
            // Fetch updated pricelist data
            fetchPricelistData();
        } catch (error) {
            console.error('Error deleting pricelist:', error);
        }
    };


    const handleSubmit = async () => {
        setSubmitting(true);

        //console.log(document.querySelector('input[name="price_type"]').value,formData.price_type)

        try {
            const InsertedFormData = {
                ...formData,
                Pricelist_id: document.querySelector('input[name="Pricelist_id"]').value,
                price_date: document.querySelector('input[name="price_date"]').value,
                // price_type: document.querySelector('input[name="price_type"]').value,
                price_type: formData.price_type,
                colour_id: selectedColour,
                cut_id: selectedCut === "" ? null : selectedCut,
                shape_id: selectedshape,
                purity_id: selectedPurity,
                flrn_id: selectedFlrn === "" ? null : selectedFlrn,
                f_weight: document.querySelector('input[name="f_weight"]').value,
                t_weight: document.querySelector('input[name="t_weight"]').value,
                Rate: document.querySelector('input[name="Rate"]').value,
            };


            await axios.post('http://192.168.1.59:5000/api/pricelist', InsertedFormData);
            console.log(formData);
            alert('Data submitted successfully!');
            setFormData({
                Pricelist_id: '',
                price_date: '',
                price_type: '',
                f_weight: '',
                t_weight: '',
                Rate: '',
            });
            fetchPricelistData();
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Error submitting data. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return isAuthenticatedFn() ? (


        <div className='grid grid-cols-1 mx-4 my-24 md:grid-cols-8 gap-4'>

            <div className=' flex flex-col md:col-span-2 '>

                <form className="bg-teal-200 rounded-lg m-2 h-max ">
                    <div className='m-4'>
                        <h1 className="text-xl font-bold mb-4">SET PRICELIST</h1>
                        <label htmlFor="Pricelist_id" className="block">ENTER PRICELIST ID</label>
                        <input
                            id="Pricelist_id"
                            type="number"
                            name="Pricelist_id"
                            value={formData.Pricelist_id}
                            onChange={(e) => setFormData({ ...formData, Pricelist_id: e.target.value })}
                            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                        />
                        <label htmlFor="price_date" className="block mt-4">ENTER PRICE DATE</label>
                        <input
                            id="price_date"
                            type="date"
                            name="price_date"
                            value={formData.price_date}
                            onChange={(e) => setFormData({ ...formData, price_date: e.target.value })}
                            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                        />
                        <label className="block mt-4">ENTER PRICE TYPE</label>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="own"
                                name="price_type"
                                value="own"
                                checked={formData.price_type === 'own'}
                                onChange={() => setFormData({ ...formData, price_type: 'own' })}
                                className="mr-2"
                            />
                            <label htmlFor="own">Own</label>
                            <input
                                type="radio"
                                id="Rep"
                                name="price_type"
                                value="Rep"
                                checked={formData.price_type === 'Rep'}
                                onChange={() => setFormData({ ...formData, price_type: 'Rep' })}
                                className="ml-4 mr-2"
                            />
                            <label htmlFor="Rep">Rep</label>
                        </div>

                        <label htmlFor="selectedShape" className="block mt-4">SELECTED SHAPE</label>
                        <ShapeDropdown
                            id="selectedShape"
                            value={selectedshape}
                            onChange={(value) => setShapeData(value)}
                            className="mt-1 w-full"
                        />
                        <label htmlFor="selectedColour" className="block mt-4">SELECTED COLOUR</label>
                        <ColourDropdown
                            id="selectedColour"
                            value={selectedColour}
                            onChange={(value) => setColourData(value)}
                            className="mt-1 w-full"
                        />
                        <label htmlFor="selectedPurity" className="block mt-4">SELECTED PURITY</label>
                        <PurityDropdown
                            id="selectedPurity"
                            value={selectedPurity}
                            onChange={(value) => setPurityData(value)}
                            className="mt-1 w-full"
                        />
                        <label htmlFor="selectedCut" className="block mt-4">SELECTED CUT</label>
                        <CutDropdown
                            id="selectedCut"
                            value={selectedCut}
                            onChange={(value) => setCutData(value)}
                            disabled={formData.price_type === 'own'}
                            className="mt-1 w-full"
                        />
                        <label htmlFor="selectedFlrn" className="block mt-4">SELECTED FLRN</label>
                        <FlrnDropdown
                            id="selectedFlrn"
                            value={selectedFlrn}
                            onChange={(value) => setFlrnData(value)}
                            disabled={formData.price_type === 'own'}
                            className="mt-1 w-full"
                        />
                        <label htmlFor="f_weight" className="block mt-4">ENTER F WEIGHT</label>
                        <input
                            id="f_weight"
                            type="number"
                            name="f_weight"
                            value={formData.f_weight}
                            onChange={(e) => setFormData({ ...formData, f_weight: e.target.value })}
                            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                        />
                        <label htmlFor="t_weight" className="block mt-4">ENTER T WEIGHT</label>
                        <input
                            id="t_weight"
                            type="number"
                            name="t_weight"
                            value={formData.t_weight}
                            onChange={(e) => setFormData({ ...formData, t_weight: e.target.value })}
                            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                        />
                        <label htmlFor="Rate" className="block mt-4">ENTER RATE</label>
                        <input
                            id="Rate"
                            type="number"
                            name="Rate"
                            value={formData.Rate}
                            onChange={(e) => setFormData({ ...formData, Rate: e.target.value })}
                            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                        />
                        <div className="mt-4 flex justify-center">
                            <button onClick={handleSubmit} disabled={submitting} className="bg-teal-500 text-white py-2 px-4 mt-4 mr-2 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">Submit</button>
                            <button onClick={handleUpdate} disabled={submitting} className="bg-teal-500 text-white py-2 px-4 mt-4 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">Update</button>
                        </div>
                    </div>
                </form>

            </div>

            <div className='md:col-span-6 rounded-lg'>


                <div>

                    <div>
                        <div className='m-2'>
                            <Uploadcsv />
                        </div>
                    </div>


                    <div className='m-2 '>
                        <div className="overflow-y-auto max-h-dvh"> {/* Adjust max-h- as needed */}
                            <div className="bg-teal-200 w-full h-max p-4 rounded-lg">
                                <h2 className="text-xl font-bold mb-2">Pricelist Data</h2>
                                <table className="colour-table w-full text-center table-auto border-collapse border-2 border-black">
                                    <thead>
                                        <tr className="bg-teal-400 border-2 border-black">
                                            <th className="px-2 py-2 border-2 border-black">Pricelist ID</th>
                                            <th className="px-2 py-2 border-2 border-black">Price Date</th>
                                            <th className="px-2 py-2 border-2 border-black">Price Type</th>
                                            <th className="px-2 py-2 border-2 border-black">Shape</th>
                                            <th className="px-2 py-2 border-2 border-black">Colour</th>
                                            <th className="px-2 py-2 border-2 border-black">Purity</th>
                                            <th className="px-2 py-2 border-2 border-black">Cut</th>
                                            <th className="px-2 py-2 border-2 border-black">Flrn</th>
                                            <th className="px-2 py-2 border-2 border-black">F Weight</th>
                                            <th className="px-2 py-2 border-2 border-black">T Weight</th>
                                            <th className="px-2 py-2 border-2 border-black">Rate</th>
                                            <th className="px-2 py-2 border-2 border-black">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pricelistData.map((item,index) => (
                                            <tr key={item.Pricelist_id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-teal-100'}`}>
                                                <td className="px-2 py-2 border-2 border-black">{item.Pricelist_id}</td>
                                                <td className="px-2 py-2 border-2 border-black">{item.price_date}</td>
                                                <td className="px-2 py-2 border-2 border-black">{item.price_type}</td>
                                                <td className="px-2 py-2 border-2 border-black">{item.shape_name}</td>
                                                <td className="px-2 py-2 border-2 border-black">{item.colour_name}</td>
                                                <td className="px-2 py-2 border-2 border-black">{item.purity_name}</td>
                                                <td className="px-2 py-2 border-2 border-black">{item.cut_name}</td>
                                                <td className="px-2 py-2 border-2 border-black">{item.flrn_name}</td>
                                                <td className="px-2 py-2 border-2 border-black">{item.f_weight}</td>
                                                <td className="px-2 py-2 border-2 border-black">{item.t_weight}</td>
                                                <td className="px-2 py-2 border-2 border-black">{item.Rate}</td>
                                                <td className="px-2 py-2  flex space-x-1">
                                                    <button onClick={() => handleEdit(item.Pricelist_id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Edit</button>
                                                    <button onClick={() => handleDelete(item.Pricelist_id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>


    ) : null;
};

export default Pricelist;
