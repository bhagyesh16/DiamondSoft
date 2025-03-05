import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LBDropdown = ({ onChange, value }) => {
    const [LBData, setLBData] = useState([]);

    useEffect(() => {
        const fetchLBData = async () => {
            try {
                const response = await axios.get('http://192.168.1.59:5000/master/LB');
                setLBData(response.data);
            } catch (error) {
                console.error('Error fetching LB data:', error);
            }
        };

        fetchLBData();
    }, []);

    const handleLBChange = (event) => {
        const selectedLB = event.target.value;
        onChange(selectedLB);
        console.log("LB ID SELECTED : " + selectedLB);
    };

    return (
        <div className="relative">
            <select
                value={value}
                onChange={handleLBChange}
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md shadow-sm focus:outline-none focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
            >
                <option value="" disabled>Select LB</option>
                {LBData.map((LB) => (
                    <option key={LB.LB_id} value={LB.LB_id}>
                        {LB.LB_name}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M10 12a1 1 0 0 1-.7-.29l-4-4a1.002 1.002 0 1 1 1.41-1.42L10 9.59l3.29-3.3a1 1 0 0 1 1.42 1.42l-4 4a1 1 0 0 1-.71.28z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
        </div>
    );
};

export default LBDropdown;
