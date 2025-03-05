import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";




const RegisterForm = () => {

    useEffect(() => {
        const element = document.getElementById("regbackground");
    
        // Set the background image
        element.style.backgroundImage = "url('https://t3.ftcdn.net/jpg/03/55/60/70/360_F_355607062_zYMS8jaz4SfoykpWz5oViRVKL32IabTP.jpg')";
        element.style.backgroundSize = "cover";
      }, []);

    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://192.168.1.59:5000/api/users', formData)
            .then(response => {
                alert('Registration Successful:', response.data);
            })
            .catch(error => {
                console.error('Error during registration:', error);
                console.log('Response:', error.response); // Log the entire response for more details
            });
    };

    return (

        <div id="regbackground" className="flex items-center justify-center min-h-screen">

        <div className="grid grid-cols-1 md:grid-cols-1">
    
            <div className="p-2 rounded-lg  md:w-[800px] md:m-auto" style={{ backgroundImage: "url('https://img.freepik.com/free-photo/organized-desk-with-copy-space_23-2148219270.jpg')", backgroundSize: "cover" }}>
    
                <div className="bg-transparent p-6 rounded-lg md:w-72 md:ml-8">
                    <h2 className="text-xl font-bold mb-4">Register</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block">
                            UserName:
                            <input type="text" name="user_name" value={formData.user_name} onChange={handleChange} className="mt-1 p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50" />
                        </label>
                        <label className="block">
                            UserMail:
                            <input type="email" name="user_email" value={formData.user_email} onChange={handleChange} className="mt-1 p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50" />
                        </label>
                        <label className="block">
                            Password:
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50" />
                        </label>
                        <button type="submit" className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">Register</button>
                    </form>
                    <p className="mt-4 text-sm">Already have an account? <Link to="/login" className="text-teal-500 hover:underline">Login</Link></p>
                </div>
    
            </div>
        </div>
    </div>
    


    );
}

export default RegisterForm;