import React, { useState } from 'react';
import StandardDiscount from '../Polishmaster/Discount/StandardDiscount';
import FlrnDiscount from '../Polishmaster/Discount/FlrnDiscount';
import CutDiscount from '../Polishmaster/Discount/CutDiscount';
import NattsDiscount from '../Polishmaster/Discount/NattsDiscount';
import MilkyDiscount from '../Polishmaster/Discount/MilkyDiscount';
import LBDiscount from '../Polishmaster/Discount/LBDiscount'; 



const PolishMaster = () => {
  return (
    
 



        <div className='p-4 w-auto  '>
          <Tabs />
        </div>

   
 

  );
};

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="mt-24 ">
      {[...Array(6)].map((_, index) => (
        <button
          key={index}
          onClick={() => handleTabClick(index)}
          className={`py-2 px-4 text-gray-800 ${activeTab === index ? 'bg-green-400' : 'bg-gray-300'} hover:bg-red-400 focus:outline-none rounded m-1`}
        >
          {/* Updated tab names */}
          {index === 0 && 'StandardDiscount'}
          {index === 1 && 'FlrnDiscount'}
          {index === 2 && 'CutDiscount'}
          {index === 3 && 'NattsDiscount'}
          {index === 4 && 'MilkyDiscount'}
          {index === 5 && 'LBDiscount'}

        </button>
      ))}
      <div className="mt-4">
        {/* Render content based on active tab */}
        {activeTab === 0 && <div><StandardDiscount/></div>}
        {activeTab === 1 && <div><FlrnDiscount /></div>}
        {activeTab === 2 && <div><CutDiscount /></div>}
        {activeTab === 3 && <div><NattsDiscount /></div>}
        {activeTab === 4 && <div><MilkyDiscount /></div>}
        {activeTab === 5 && <div><LBDiscount /></div>}

      </div>
    </div>
  );
};


export default PolishMaster;
