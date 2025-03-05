import React, { useState } from 'react';

import ColourForm from '../mainhome/colourform';
import CutForm from '../mainhome/cutform';
import ShapeForm from '../mainhome/shapeform';
import PurityForms from '../mainhome/purityform';
import FlrnForm from '../mainhome/flrnform';
import Natts from '../mainhome/Natts';
import Milky from '../mainhome/Milky';
import LBtinich from '../mainhome/LB_tinich';

const Insert = () => {
  return (
    
  //   style={{ 
  // backgroundImage: "url('https://www.onlygfx.com/wp-content/uploads/2018/07/4-turquoise-watercolor-background-1-1024x654.jpg')",
  // backgroundSize: 'cover'}}



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
    <div className="mt-24">
      {[...Array(8)].map((_, index) => (
        <button
          key={index}
          onClick={() => handleTabClick(index)}
          className={`py-2 px-4 text-gray-800 ${activeTab === index ? 'bg-green-400' : 'bg-gray-300'} hover:bg-red-400 focus:outline-none rounded m-1`}
        >
          {/* Updated tab names */}
          {index === 0 && 'Shape'}
          {index === 1 && 'Colour'}
          {index === 2 && 'Purity'}
          {index === 3 && 'Cut'}
          {index === 4 && 'Flrn'}
          {index === 5 && 'Natts'}
          {index === 6 && 'Milky'}
          {index === 7 && 'LB_Tinich'}
        </button>
      ))}
      <div className="mt-4">
        {/* Render content based on active tab */}
        {activeTab === 0 && <div><ShapeForm /></div>}
        {activeTab === 1 && <div><ColourForm /></div>}
        {activeTab === 2 && <div><PurityForms /></div>}
        {activeTab === 3 && <div><CutForm /></div>}
        {activeTab === 4 && <div><FlrnForm /></div>}
        {activeTab === 5 && <div><Natts /></div>}
        {activeTab === 6 && <div><Milky /></div>}
        {activeTab === 7 && <div><LBtinich /></div>}
        
      </div>
    </div>
  );
};

export default Insert;
