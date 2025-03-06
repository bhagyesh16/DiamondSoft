import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { IoDiamondOutline, IoMenu, IoClose } from "react-icons/io5";
import { HiOutlineViewList } from 'react-icons/hi';

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { isAuthenticatedFn, setAuthToken, resetAuthToken } = useAuth();
  const navigate = useNavigate();


  const sidebarItems = [
    { to: '/master', text: 'Master', icon: <HiOutlineViewList className="h-8 w-7 mr-2" /> },
    { to: '/pricelist', text: 'Price List', icon: <HiOutlineViewList className="h-8 w-7 mr-2" /> },
    { to: '/RoughHeader', text: 'Pricing', icon: <HiOutlineViewList className="h-8 w-7 mr-2" /> },
    { to: '/polishMaster', text: 'Polish Master', icon: <HiOutlineViewList className="h-8 w-7 mr-2" /> },
    { to: '/polishCalc', text: 'Polish Calculator', icon: <HiOutlineViewList className="h-8 w-7 mr-2" /> }
  ];

  const handleLogout = () => {
    resetAuthToken();
    navigate('/login');
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        // const token = localStorage.getItem('token');
        // console.log(token);
        // await axios.post(

        //   'https://diamondsoft-backend.onrender.com/api/login',
        //   {},
        //   {
        //     headers: {
        //       'Authorization': `Bearer ${token}`,
        //     },
        //   }
        // );
        // Handle the response data if needed`
      } catch (error) {
        console.error('Error fetching data:', Response.error);
        // Handle error, e.g., redirect to login page
        //navigate('/login');
      }
    };


    if (isAuthenticatedFn()) {
      fetchData();
    }
  }, [isAuthenticatedFn, navigate, setAuthToken]);



  return isAuthenticatedFn() ? (
    <>
      <div className="fixed top-0 z-50 w-full lg:flex lg:flex-row lg:justify-between lg:bg-teal-800 lg:h-24 lg:px-4 lg:py-4">

        <div className='lg:block md:block bg-teal-800 flex justify-between p-2'>

          <div className="lg:flex lg:items-center">

            <div className="lg:mr-8">
              <Link to="/home">
                <IoDiamondOutline size={50} className='text-white hover:text-teal-300' />
              </Link>
            </div>

            <div className="hidden lg:flex lg:flex-row">
              {sidebarItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.to}
                  className="flex items-center text-2xl py-2 px-4 text-white hover:text-teal-300"
                  activeClassName="bg-teal-700"
                >
                  {item.icon}
                  <span>{item.text}</span>
                </NavLink>

              ))}
            </div>

            <button
              onClick={handleLogout}
              className="hidden  mt-8 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
            Logout
          </button>



          </div>


          <div className="lg:hidden p-2">
            {!showSidebar ? (
              <IoMenu size={28} className="text-white" onClick={() => setShowSidebar(true)} />
            ) : (
              <IoClose size={28} className="text-white" onClick={() => setShowSidebar(false)} />
            )}
          </div>

        </div>

      </div>

      {showSidebar && (
        <div className="lg:hidden z-50 bg-teal-800 fixed top-16 left-0  w-full h-[720px]">
          <div className="flex flex-col items-center justify-center  pt-20">
            {sidebarItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.to}
                className="py-2 px-4 flex text-3xl text-white hover:text-teal-300"
                activeClassName="bg-teal-700"
                onClick={() => setShowSidebar(false)}
              >
                {item.icon}
                <span>{item.text}</span>
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className=" w-max mt-8 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  ) : null;
};

export default Sidebar;
