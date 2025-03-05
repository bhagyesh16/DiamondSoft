import React, { useState, useEffect } from 'react';
import SievesDropdown from '../pricing/sieviesdropdown';
import RoughDescDropdown from '../pricing/RoughDescDropdown';
import { useNavigate } from 'react-router';
import axios from 'axios';

const RoughHeader = () => {
    const [submitting, setSubmitting] = useState(false);
    const [selectedSieves, setSievesData] = useState('');
    const [selectedRoughDesc, setRoughDescData] = useState('');
    const navigate = useNavigate();

    // Format the date as 'YYYY-MM-DD'
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [formdata, setformdata] = useState({
        Date_Of_Action: formatDate(new Date()), // Initialize with the current date
        Name_Of_Site: '',
        Extra_Remarks: '',
        Rough_weight: '',
    });

    const [generatedId, setGeneratedId] = useState(null);

    // Update the Date_Of_Action in the formdata whenever it changes
    useEffect(() => {
        setformdata((prevformdata) => ({
            ...prevformdata,
            Date_Of_Action: formatDate(new Date()),
        }));
    }, []); // Empty dependency array ensures the effect runs only once on mount

    const handleSubmit = async () => {
        setSubmitting(true);

        try {
            const insertedformdata = {
                ...formdata,
                Rough_Desc: selectedRoughDesc,
                Sieves_id: selectedSieves,
            };


            const response = await axios.post('http://192.168.1.59:5000/api/rough_header', insertedformdata);
            const newId = response.data?.ID;

            if (newId) {
                setGeneratedId(newId);

                // Redirect to the result page with the form data
                navigate('/RoughBody', {
                    state: {
                        formdata,
                        generatedId: newId,
                        selectedSieves, // Include selectedSieves in the state
                        selectedRoughDesc // Include selectedRoughDesc in the state
                    }
                });

                alert('Your data has been submitted.');
                setformdata({
                    Date_Of_Action: formatDate(new Date()), // Reset to the current date
                    Name_Of_Site: '',
                    Extra_Remarks: '',
                    Rough_weight: '',
                });
            } else {
                alert('Error: Unable to get ID from the server response.');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Error submitting data. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-20 md:mt-24 mx-4  ">

            <div className='flex items-center justify-center mt-4'>
                <form className="bg-teal-100 p-6 rounded-lg max-w-md w-full sm:max-w-lg">
                    <h1 className="text-xl font-bold mb-4">ROUGH DIAMOND DESCRIPTION</h1>
                    {generatedId && <label className="">Generated ID: {generatedId}</label>}
                    <label htmlFor="dateInput" className="block mt-4">ENTER AUCTION DATE</label>
                    <input
                        id="dateInput"
                        type="date"
                        name="Date_Of_Action"
                        value={formdata.Date_Of_Action}
                        onChange={(e) => setformdata({ ...formdata, Date_Of_Action: e.target.value })}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                    />
                    <label htmlFor="siteInput" className="block mt-4">ENTER NAME OF SITE</label>
                    <input
                        id="siteInput"
                        type="text"
                        name="Name_Of_Site"
                        placeholder="Enter Site Name"
                        value={formdata.Name_Of_Site}
                        onChange={(e) => setformdata({ ...formdata, Name_Of_Site: e.target.value })}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                    />
                    <label htmlFor="remarksInput" className="block mt-4">EXTRA REMARKS</label>
                    <input
                        id="remarksInput"
                        type="text"
                        name="Extra_Remarks"
                        placeholder="Enter Remarks"
                        value={formdata.Extra_Remarks}
                        onChange={(e) => setformdata({ ...formdata, Extra_Remarks: e.target.value })}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                    />
                    <label htmlFor="roughDescDropdown" className="block mt-4">Rough Description of the diamond</label>
                    <RoughDescDropdown
                        id="roughDescDropdown"
                        value={selectedRoughDesc}
                        onChange={(value) => setRoughDescData(value)}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                    />
                    <label htmlFor="sievesDropdown" className="block mt-4">Seives of Diamond</label>
                    <SievesDropdown
                        id="sievesDropdown"
                        value={selectedSieves}
                        onChange={(value) => setSievesData(value)}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                    />
                    <label htmlFor="weightInput" className="block mt-4">Enter Rough Weight of the Diamond</label>
                    <input
                        id="weightInput"
                        type="number"
                        name="Rough_weight"
                        value={formdata.Rough_weight}
                        onChange={(e) => setformdata({ ...formdata, Rough_weight: e.target.value })}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                    />
                    <button onClick={handleSubmit} disabled={submitting} className="bg-teal-500 text-white py-2 px-4 mt-4 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 w-full">
                        Submit
                    </button>
                </form>
            </div>

        </div>

    );
};

export default RoughHeader;

