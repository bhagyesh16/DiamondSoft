import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ColourDropdown from '../Homecomponents/ColorDropdown';
import ShapeDropdown from '../Homecomponents/ShapeDropdown';
import PurityDropdown from '../Homecomponents/PurityDropdown';
import FlrnDropdown from '../Homecomponents/FlrnDropdown';
import CutDropdown from '../Homecomponents/CutDropDown';
import NattsDropdown from '../Polishmaster/NattsDropdown';
import MilkyDropdown from '../Polishmaster/MilkyDropdown';
import LBDropdown from '../Polishmaster/LBDropdown';
import { useAuth } from '../AuthContext';

const PolishCalc = () => {
  const { isAuthenticatedFn, setAuthToken, resetAuthToken } = useAuth();
  const [selectedColour, setColourData] = useState('');
  const [selectedshape, setShapeData] = useState('');
  const [selectedPurity, setPurityData] = useState('');
  const [selectedFlrn, setFlrnData] = useState('');
  const [selectedCut, setCutData] = useState('');
  const [selectedNatts, setNattsData] = useState('');
  const [selectedMilky, setMilkyData] = useState('');
  const [selectedLb, setLBData] = useState('');
  const [discount, setDiscount] = useState(0);
  const [flrndiscount, setFlrnDiscount] = useState(0);
  const [cutdiscount, setCutdiscount] = useState(0);
  const [nattsdiscount, setnattsdiscount] = useState(0);
  const [milkyDiscount, setMilkyDiscount] = useState(0);
  const [LBDiscount, setLBDiscount] = useState(0);
  const [polishWeight, setPolishWeight] = useState('');
  const [Rate, setRate] = useState(0);
  const [price_type, setPrice_type] = useState('');
  const [stdRate, setstdRate] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [flrnRate, setflrnRate] = useState(0);
  const [cutRate, setcutRate] = useState(0);
  const [nattsRate, setnattsRate] = useState(0);
  const [milkyRate, setmilkyRate] = useState(0);
  const [LBRate, setLBRate] = useState(0);
  const [finalRate, setfinalRate] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticatedFn()) {
          const response = await axios.get('https://diamondsoft-backend.onrender.com/api/sdiscount');

          console.log(response);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        console.log('token set in pricelist');
        resetAuthToken(null);
      }
    };

    fetchData();
  }, [isAuthenticatedFn, setAuthToken, resetAuthToken]);

  const handlePolishWeightChange = (event) => {
    setPolishWeight(event.target.value);
  };
  // Handler for fetching rate based on selected parameters and price type
  const handleFetchRate = useCallback(async () => {
    try {
      let response;
      if (price_type === 'own') {
        // Fetch rate for own price type
        response = await axios.get(`https://diamondsoft-backend.onrender.com/api/getpricelistown/${polishWeight}/${selectedshape}/${selectedColour}/${selectedPurity}/${price_type}`);
      } else if (price_type === 'Repose') {
        // Fetch rate for Repose price type
        response = await axios.get(`https://diamondsoft-backend.onrender.com/api/getpricelistrep/${polishWeight}/${selectedshape}/${selectedColour}/${selectedPurity}/${selectedCut}/${selectedFlrn}/${price_type}`);
  } else if (price_type === 'Rep') {
        // Fetch rate for Rep price type
        response = await axios.get(`https://diamondsoft-backend.onrender.com/api/getpricelistrep/${polishWeight}/${selectedshape}/${selectedColour}/${selectedPurity}/${selectedCut}/${selectedFlrn}/${price_type}`);
      }
      // Update the rate state
      setRate(response.data.Rate);
    } catch (error) {
      console.error('Error fetching rate:', error);
    }
  }, [polishWeight, selectedPurity, selectedColour, selectedshape, selectedCut, selectedFlrn, price_type]);

  // Handler for fetching rate based on selected parameters and price type
  const handleCalculateDiscount = useCallback(async () => {
    try {

      const response = await axios.get(`https://diamondsoft-backend.onrender.com/api/getsdiscount/${polishWeight}/${selectedshape}/${selectedColour}/${selectedPurity}`);

      setDiscount(response.data.discount);
      const stdrate = Rate - (Rate * discount / 100);
      setstdRate(stdrate);
      console.log(`Std Rate`, stdrate);
    } catch (error) {
      console.error('Error fetching discount:', error);
    }
  }, [Rate, discount, polishWeight, selectedPurity, selectedColour, selectedshape]);

  useEffect(() => {
    handleCalculateDiscount();
  }, [handleCalculateDiscount]);

  const handleCalculateFlrnDiscount = useCallback(async () => {
    try {
      if (price_type === 'own') {
        // If price_type is 'own', set flrn discount to 0
        setFlrnDiscount(0);
        setflrnRate(Rate); // Set flrnRate to Rate directly
      } else {

        const response = await axios.get(`https://diamondsoft-backend.onrender.com/api/getfdiscount/${polishWeight}/${selectedshape}/${selectedColour}/${selectedPurity}/${selectedFlrn}`);
        setFlrnDiscount(response.data.discount);
        const flrnrate = (stdRate - (stdRate * flrndiscount / 100));
        setflrnRate(flrnrate);
      }
    } catch (error) {
      console.error('Error fetching discount:', error);
    }
  }, [price_type, polishWeight, selectedFlrn, selectedPurity, selectedColour, selectedshape, stdRate, flrndiscount, Rate]);

  useEffect(() => {
    handleCalculateFlrnDiscount();
  }, [handleCalculateFlrnDiscount]);

  const handleCalculateCutDiscount = useCallback(async () => {
    try {
      if (price_type === 'own') {
        // If price_type is 'own', set cut discount to 0
        setCutdiscount(0);
        setcutRate(Rate); // Set cutRate to Rate directly
      } else {

        const response = await axios.get(`https://diamondsoft-backend.onrender.com/api/getcdiscount/${polishWeight}/${selectedshape}/${selectedColour}/${selectedPurity}/${selectedCut}`);
        setCutdiscount(response.data.discount);
        const crate = ((flrnRate * cutdiscount) / 100);
        const cutrate = flrnRate - crate;
        setcutRate(cutrate);
      }
    } catch (error) {
      console.error('Error fetching discount:', error);
    }
  }, [price_type, polishWeight, selectedCut, selectedPurity, selectedColour, selectedshape, flrnRate, cutdiscount, Rate]);

  useEffect(() => {
    handleCalculateCutDiscount();
  }, [handleCalculateCutDiscount]);


  const handleCalculateNattsDiscount = useCallback(async () => {
    try {

      const response = await axios.get(`https://diamondsoft-backend.onrender.com/api/getndiscount/${polishWeight}/${selectedshape}/${selectedColour}/${selectedPurity}/${selectedNatts}`);
      setnattsdiscount(response.data.discount);
      console.log(`natts discount`, response.data.discount);
      const nattsrate = cutRate - (cutRate * nattsdiscount / 100);
      setnattsRate(nattsrate);
      console.log(`NATTS Rate`, nattsrate);
    } catch (error) {
      console.error('Error fetching discount:', error);
    }
  }, [cutRate, nattsdiscount, polishWeight, selectedNatts, selectedPurity, selectedColour, selectedshape]);

  useEffect(() => {
    handleCalculateNattsDiscount();
  }, [handleCalculateNattsDiscount]);

  const handleCalculateMilkyDiscount = useCallback(async () => {
    try {

      const response = await axios.get(`https://diamondsoft-backend.onrender.com/api/getmdiscount/${polishWeight}/${selectedshape}/${selectedColour}/${selectedPurity}/${selectedMilky}`);
      setMilkyDiscount(response.data.discount);
      console.log(`Milky discount`, response.data.discount);
      const milkyrate = nattsRate - (nattsRate * milkyDiscount / 100);
      setmilkyRate(milkyrate);
      console.log(`Milky Rate`, milkyrate);
    } catch (error) {
      console.error('Error fetching discount:', error);
    }
  }, [nattsRate, milkyDiscount, polishWeight, selectedMilky, selectedPurity, selectedColour, selectedshape]);

  useEffect(() => {
    handleCalculateMilkyDiscount();
  }, [handleCalculateMilkyDiscount]);

  const handleCalculateLBDiscount = useCallback(async () => {
    try {

      const response = await axios.get(`https://diamondsoft-backend.onrender.com/api/getlbdiscount/${polishWeight}/${selectedshape}/${selectedColour}/${selectedPurity}/${selectedLb}`);
      setLBDiscount(response.data.discount);
      console.log(`LB discount`, response.data.discount);
      const LBrate = milkyRate - (milkyRate * LBDiscount / 100);
      setLBRate(LBrate);
      console.log(`LB Rate`, LBrate);
    } catch (error) {
      console.error('Error fetching discount:', error);
    }
  }, [milkyRate, LBDiscount, polishWeight, selectedLb, selectedPurity, selectedColour, selectedshape]);

  useEffect(() => {
    handleCalculateLBDiscount();
  }, [handleCalculateLBDiscount]);


  useEffect(() => {
    handleCalculateLBDiscount();
  }, [handleCalculateLBDiscount]);



  useEffect(() => {
    handleFetchRate();
  }, [handleFetchRate]);

  // useEffect(() => {
  //   setTotalDiscount((Rate-LBRate)/Rate*100);
  // }, [Rate,LBRate]);

  const handleCalculateButtonClicked = () => {
    setTotalDiscount((Rate - LBRate) / Rate * 100);
    setfinalRate(LBRate);
  };
  return (


    <div className='bg-teal-300 p-4 m-4 mt-40'>

      <h1 className='text-xl font-bold'>Polish Calculator</h1>

      <div className=' m-2 flex items-start space-x-4'>

        {/* Price Type */}
        <div className=' p-2 flex space-x-4 items-center bg-cyan-100 rounded-lg shadow-md'>
          <label htmlFor="price_type" className="text-lg font-semibold">Enter Price Type:</label>
          <div className="flex flex-row">
            <div className="mr-4">
              <input
                type="radio"
                id="own"
                name="price_type"
                value="own"
                checked={price_type === 'own'}
                onChange={(event) => setPrice_type(event.target.value)}
                className="mr-2"
              />
              <label htmlFor="own">Own</label>
            </div>
            <div>
              <input
                type="radio"
                id="Rep"
                name="price_type"
                value="Rep"
                checked={price_type === 'Rep'}
                onChange={(event) => setPrice_type(event.target.value)}
                className="mr-2"
              />
              <label htmlFor="Rep">Rep</label>
            </div>
          </div>
        </div>

        {/* Polish Weight */}
        <div className=' p-2 flex items-center bg-cyan-100 rounded-lg shadow-md'>
          <label htmlFor="polishWeight" className="text-lg font-semibold">Polish Weight:</label>
          <input
            type="number"
            id="polishWeight"
            value={polishWeight}
            onChange={handlePolishWeightChange}
            placeholder="Enter polish weight"
            className="p-1 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>



      </div>


      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

        <div className='flex flex-col space-y-4'>
          <div className='flex flex-col'>
            <label htmlFor='shape' className='mb-1'>Shape:</label>
            <ShapeDropdown id='shape' value={selectedshape} onChange={(value) => setShapeData(value)} />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='colour' className='mb-1'>Colour:</label>
            <ColourDropdown id='colour' value={selectedColour} onChange={(value) => setColourData(value)} />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='purity' className='mb-1'>Purity:</label>
            <PurityDropdown id='purity' value={selectedPurity} onChange={(value) => setPurityData(value)} />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='flrn' className='mb-1'>Flrn:</label>
            <FlrnDropdown
              id='flrn'
              value={selectedFlrn}
              onChange={(value) => setFlrnData(value)}
              disabled={price_type === 'own'}
            />
          </div>
        </div>

        <div className='flex flex-col space-y-4'>
          <div className='flex flex-col'>
            <label htmlFor='cut' className='mb-1'>Cut:</label>
            <CutDropdown
              value={selectedCut}
              onChange={(value) => setCutData(value)}
              disabled={price_type === 'own'}
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='natts' className='mb-1'>Natts:</label>
            <NattsDropdown id='natts' value={selectedNatts} onChange={(value) => setNattsData(value)} />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='milky' className='mb-1'>Milky:</label>
            <MilkyDropdown id='milky' value={selectedMilky} onChange={(value) => setMilkyData(value)} />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='lb_tinich' className='mb-1'>LB_TINICH:</label>
            <LBDropdown id='lb_tinich' value={selectedLb} onChange={(value) => setLBData(value)} />
          </div>
        </div>

      </div>


      <div className='flex justify-end space-x-4 items-center  mt-2  p-2'>
        <div className= ' flex space-x-4 items-center justify-center  mt-2  p-2 rounded-lg bg-amber-500'>
        <p className='text-lg font-semibold'>Rate: {Rate}</p>
        <button onClick={handleCalculateButtonClicked} className='bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 mt-2'>
          Calculate Discount
        </button>
        <p className='text-lg mt-2'>Total Discount: {totalDiscount.toFixed(2)}</p>
        <p className='text-lg mt-2'>Value: {finalRate.toFixed(2)}</p>

        </div>
       
      </div>
    </div>


  );
};

export default PolishCalc;
