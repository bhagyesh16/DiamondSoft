//App.js
import React from 'react';
import {  Route, Routes } from 'react-router-dom';
import {  useLocation  } from "react-router-dom" 
import PolishMaster from './components/PolishMaster';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/Login';
import Home from './components/Home';
import MainHome from './components/mainhome';
import Pricelist from './components/Pricelist';
import ProtectedRoute from './ProtectedRoute';
import Uploadcsv from './components/Uploadcsv';
import RoughHeader from './components/RoughHeader';
import RoughBody from './components/RoughBody';
import Sidebar from './components/Sidebar';
import PolishCalc from './components/PolishCalc';

function App() {

  const location = useLocation()



  const shouldShowSidebar = () => {
    const { pathname } = location
    return !["/", "/login" ].includes(pathname)
  } 


  return (
    
  
      <div className="App">

          {shouldShowSidebar() && <Sidebar/>}
        
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />


          {/* Protected routes */}
          
          <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>} />
          <Route path="/master" element={<ProtectedRoute><MainHome /></ProtectedRoute>} />
          <Route path="/pricelist" element={<ProtectedRoute><Pricelist/></ProtectedRoute>}/>
          <Route path="/uploadcsv" element={<ProtectedRoute><Uploadcsv/></ProtectedRoute>}/>
          <Route path="/roughHeader" element={<ProtectedRoute><RoughHeader/></ProtectedRoute>}/>
          <Route path="/roughBody" element={<ProtectedRoute><RoughBody/></ProtectedRoute>}/>
          <Route path="/polishMaster" element={<ProtectedRoute><PolishMaster/></ProtectedRoute>}/>
          <Route path="/polishCalc" element={<ProtectedRoute><PolishCalc/></ProtectedRoute>}/>

        </Routes>

        
      </div>
   
  );
}

export default App;



// --hostname  192.168.1.59 --port 3000