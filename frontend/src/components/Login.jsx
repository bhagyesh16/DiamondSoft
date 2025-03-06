import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import gsap from "gsap";

const LoginForm = () => {
  const { setAuthToken } = useAuth();
  const [loginData, setLoginData] = useState({ user_email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const loginBackground = document.getElementById("loginbackground");
    const loginFormContainer = document.getElementById("loginFormContainer");

    if (loginBackground) {
      loginBackground.style.backgroundImage =
        "url('https://t3.ftcdn.net/jpg/03/55/60/70/360_F_355607062_zYMS8jaz4SfoykpWz5oViRVKL32IabTP.jpg')";
      loginBackground.style.backgroundSize = "cover";
    }

    if (loginFormContainer) {
      gsap.fromTo(
        loginFormContainer,
        { opacity: 0, y: -100 },
        { opacity: 1, y: 0, duration: 1, ease: "power4.out" }
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://diamondsoft-backend.onrender.com/api/login", loginData);
      setAuthToken(response.data.token);
      alert("Login Successful");
      navigate("/home");
    } catch (error) {
      console.error("Login Error:", error);
      console.error("Full Error Response:", error.response);
      alert(error.response?.data?.message || "Error during login. Please try again.");
    }
  };
  

  return (
    <div id="loginbackground" className="flex items-center justify-center min-h-screen">
      <div id="loginFormContainer" className="bg-teal-100 w-72 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            Email:
            <input
              type="email"
              name="user_email"
              value={loginData.user_email}
              onChange={handleChange}
              className="mt-1 p-2 w-full rounded-md border border-gray-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </label>
          <label className="block">
            Password:
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              className="mt-1 p-2 w-full rounded-md border border-gray-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </label>
          <button
            type="submit"
            className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 w-full"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm">
          Don't have an account? <Link to="/" className="text-blue-500 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
