import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ColourDropdown from '../Homecomponents/ColorDropdown';
import CutDropdown from '../Homecomponents/CutDropDown';
import ShapeDropdown from '../Homecomponents/ShapeDropdown';
import PurityDropdown from '../Homecomponents/PurityDropdown';
import FlrnDropdown from '../Homecomponents/FlrnDropdown';
import { useNavigate, useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const RoughBody = () => {
  const [selectedColour, setSelectedColour] = useState('');
  const [selectedCut, setSelectedCut] = useState('');
  const [selectedShape, setSelectedShape] = useState('');
  const [selectedPurity, setSelectedPurity] = useState('');
  const [selectedFlrn, setSelectedFlrn] = useState('');
  const [fetchedData, setFetchedData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();
  const { formdata, generatedId, selectedSieves, selectedRoughDesc } = location.state || {};
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [formData, setFormData] = useState({
    RH_id: '',
    purity_weight: '',
    Rate: '',
    discount: '',
    price: '',
    value: '',
    labour: '',
    extra_exp: '',
    roughprice: '',
    MU: '',
  });
  const [tradeExpense, setTradeExpense] = useState();
  const [isPDF, setisPDF] = useState(false);

  //get weight lost in percentage
  useEffect(() => {
    const totals = calculateTotals(fetchedData);
    const weightlost = formdata.Rough_weight - totals.purity_weight;
    const weightlostper = (weightlost * 100) / formdata.Rough_weight;
    const finalMU = totals.MU / formdata.Rough_weight;
    const finalRp = totals.roughprice / formdata.Rough_weight;
    console.log('bid price', finalMU, finalRp);
    console.log('Totals:', totals);
    console.log('Weight Lost Percentage:', weightlostper);
  }, [fetchedData, formdata]);

  //calc totol value of required field from RH_id
  const calculateTotals = (data) => {
    let totals = {
      purity_weight: 0,
      rate: 0,
      discount: 0,
      value: 0,
      labour: 0,
      extra_exp: 0,
      roughprice: 0,
      MU: 0,
    };

    data.forEach((item) => {
      totals.purity_weight += parseFloat(item.purity_weight);
      totals.rate += parseFloat(item.Rate);
      totals.discount += parseFloat(item.discount);
      totals.value += parseFloat(item.value);
      totals.labour += parseFloat(item.labour);
      totals.extra_exp += parseFloat(item.extra_exp);
      totals.roughprice += parseFloat(item.roughprice);
      totals.MU += parseFloat(item.MU);
    });

    return totals;
  };


  //to fetch Rate from pricelist
  const fetchPricelistPrice = useCallback(async () => {
    try {
      // Check if all necessary dropdown values are selected
      if (!selectedShape || !selectedColour || !selectedPurity) {
        //alert('Please select Shape, Colour, and Purity.');
        return; // Exit the function early if any value is missing
      }

      // Check if purity_weight is a valid number
      const purityWeightValue = parseFloat(formData.purity_weight);
      if (isNaN(purityWeightValue)) {
        //alert('Please enter a valid purity weight.');
        return; // Exit the function early if purity_weight is NaN
      }

      const response = await axios.get('http://192.168.1.59:5000/master/roughpricelist', {

        params: {
          shape_id: selectedShape,
          colour_id: selectedColour,
          purity_id: selectedPurity,
          cut_id: selectedCut,
          flrn_id: selectedFlrn,
          purity_weight: purityWeightValue, // Use the parsed value
        },
      });

      if (response.data.rate) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          Rate: response.data.rate,
        }));
      } else {
        console.log('Invalid API response:', response.data);
      }
    } catch (error) {
      console.error('Error fetching pricelist rate:', error);
      alert('Error fetching pricelist rate. Please try again.');
    }
  }, [selectedShape, selectedColour, selectedPurity, selectedCut, selectedFlrn, formData.purity_weight]);


  useEffect(() => {
    fetchPricelistPrice();
  }, [fetchPricelistPrice]);

  useEffect(() => {
    if (formdata) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        //Date_Of_Action: formdata.Date_Of_Action,
        //Rough_weight: formdata.Rough_weight,
      }));
    }
  }, [formdata]);

  //to Calculate price from discount on the rate
  const handleDiscountChange = (e) => {
    const discountValue = e.target.value;
    const calculatedDiscount = (formData.Rate * discountValue) / 100;
    const price = formData.Rate - calculatedDiscount;

    setFormData((prevFormData) => ({
      ...prevFormData,
      discount: discountValue,
      Price: price,
    }));
  };

  //to calculate value 
  useEffect(() => {
    const calculatedValue = formData.Price * formData.purity_weight;
    setFormData((prevFormData) => ({
      ...prevFormData,
      value: calculatedValue,
    }));
  }, [formData.Price, formData.purity_weight]);

  // to calculate rough price
  useEffect(() => {
    const calculateRough = formData.value - formData.labour;
    const calculatedRoughPrice = calculateRough - formData.extra_exp;
    setFormData((prevFormData) => ({
      ...prevFormData,
      roughprice: calculatedRoughPrice,
    }));
  }, [formData.value, formData.labour, formData.extra_exp]);

  // to calculate MU
  const handleMUvalue = (e) => {
    const tradeExpenseValue = parseFloat(e.target.value);
    const calculate = 100 + tradeExpenseValue;
    const MU = (formData.roughprice / calculate * 100).toFixed(2);
    setFormData((prevFormData) => ({
      ...prevFormData,
      MU: MU,
    }));
    setTradeExpense(tradeExpenseValue);
  };



  const handlePurityWeightChange = (e) => {
    const purityWeight = parseFloat(e.target.value);
    const totalPolishWeight = fetchedData.reduce((acc, item) => acc + parseFloat(item.purity_weight), 0);

    if (totalPolishWeight + purityWeight > parseFloat(formdata.Rough_weight)) {
      alert("Total polish weight cannot exceed rough weight.");
      return; // Exit the function without updating state if validation fails
    }

    // Update the form data state
    setFormData((prevFormData) => ({
      ...prevFormData,
      purity_weight: purityWeight,
    }));
  };

  const fetchData = async () => {
    try {

      const response = await axios.get(`http://192.168.1.59:5000/master/roughcalc/${generatedId}`);
      setFetchedData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error, e.g., display an error message to the user
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://192.168.1.59:5000/master/roughcalc/${generatedId}`);
        setFetchedData(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error, e.g., display an error message to the user
      }
    };

    if (generatedId) {
      fetchData(); // Call fetchData function directly
    }
  }, [generatedId, setFetchedData]); // Include fetchData in the dependency array

  //Handle Onsubmit Event of the Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // let fetchedData; 
    const totalPolishWeight = fetchedData.reduce((acc, item) => acc + parseFloat(item.purity_weight), 0);
    console.log("Total Polish Weight:", totalPolishWeight);

    // Check if total polish weight exceeds rough weight
    if (parseFloat(totalPolishWeight) > parseFloat(formdata.Rough_weight)) {
      alert("Total polish weight exceeds rough weight. Please adjust.");
      setSubmitting(false);
      return;
    }
    setSubmitting(true);
    // Add your submission logic here
    try {
      await fetchData();
      console.log("generatedId:", generatedId);
      console.log("formdata.Rough_weight:", formdata.Rough_weight);
      console.log("fetchedData:", fetchedData);

      const calculatedDiscount = (formData.Rate * formData.discount) / 100;
      const Price = formData.Rate - calculatedDiscount;
      const calculatedValue = Price * formData.purity_weight;
      const calculatedRoughPrice = calculatedValue - formData.labour - formData.extra_exp;
      const MU = calculatedRoughPrice / 110 * 100; // 10% of roughprice

      const insertedData = await axios.post('http://192.168.1.59:5000/master/roughcalc', {

        RH_id: generatedId,
        colour_id: selectedColour,
        cut_id: selectedCut || null,
        shape_id: selectedShape,
        purity_id: selectedPurity,
        flrn_id: selectedFlrn || null,
        purity_weight: formData.purity_weight,
        Rate: formData.Rate,
        discount: formData.discount,
        price: Price,
        value: calculatedValue,
        labour: formData.labour,
        extra_exp: formData.extra_exp,
        roughprice: calculatedRoughPrice,
        MU: MU,
      });

      console.log("Inserted data:", insertedData.data);

      alert("Successfully inserted data");

      // Reset form data
      setFormData({
        RH_id: '',
        purity_weight: '',
        Rate: '',
        discount: '',
        price: '',
        value: '',
        labour: '',
        extra_exp: '',
        roughprice: '',
        MU: '',
      });
      setSelectedColour('');
      setSelectedCut('');
      setSelectedShape('');
      setSelectedPurity('');
      setSelectedFlrn('');
      setTradeExpense('');
      setSubmitting(false); // Reset submitting state
      //alert(isPDF);
      fetchData();
    } catch (error) {
      console.error("Error occurred during form submission:", error);
      // Handle error as needed
      setSubmitting(false); // Reset submitting state
    }
  };

  const handleEdit = (id) => {
    const selectedItem = fetchedData.find(item => item.ID === id);
    setSelectedItemId(id);
    setFormData(selectedItem);
    setEditMode(true);
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {  // Construct the updated data object
        ID: selectedItemId,  // Assuming selectedItemId is set elsewhere in your component
        SelectedColour: selectedColour,
        SelectedShape: selectedShape,
        SelectedPurity: selectedPurity,
        SelectedCut: selectedCut,
        SelectedFlrn: selectedFlrn,
        PurityWeight: formData.purity_weight,
        Rate: formData.Rate,
        Discount: formData.discount,
        Price: formData.Price,
        Value: formData.value,
        Labour: formData.labour,
        ExtraExp: formData.extra_exp,
        RoughPrice: formData.roughprice,
        MU: formData.MU
      };

      // Make an HTTP PUT request to update the data

      const response = await axios.put(`http://192.168.1.59:5000/master/roughcalc/${selectedItemId}`, updatedData);

      if (response.data.success) {
        // Handle successful update
        alert("Data updated successfully");

        // Update the local state with the updated data
        const updatedFetchedData = fetchedData.map(item => {
          if (item.ID === selectedItemId) {
            // If the item ID matches the updated item, return the updated item
            return {
              ...item,
              ...updatedData
            };
          }
          return item; // Return the original item for other items
        });

        // Update the state with the updated fetched data
        setFetchedData(updatedFetchedData);

        // Clear the form data
        setFormData({
          RH_id: '',
          purity_weight: '',
          Rate: '',
          discount: '',
          price: '',
          value: '',
          labour: '',
          extra_exp: '',
          roughprice: '',
          MU: '',
        });

        // Exit edit mode
        setEditMode(false);
      } else {
        // Handle unsuccessful update
        console.error("Failed to update data:", response.data.message);
        // You may want to display an error message to the user
      }
    } catch (error) {
      // Handle errors that occur during the update process
      console.error("Error occurred during data update:", error);
      // You may want to display an error message to the user
    }
  };

  //Handle Delete Event of the Form
  const handleDelete = async (id) => {
    try {
      // Make an HTTP DELETE request to the server

      const response = await axios.delete(`http://192.168.1.59:5000/master/roughcalc/${id}`);
      // Check if the deletion was successful
      if (response.data.success) {
        // Handle successful deletion
        console.log('Data deleted successfully');

        // Update the fetched data state by removing the deleted item
        setFetchedData(prevData => prevData.filter(item => item.ID !== id));
      } else {
        console.error('Failed to delete data:', response.data.message);
      }
    } catch (error) {
      console.error('Error occurred during data deletion:', error);
    }
  };

  const totals = calculateTotals(fetchedData);
  const weightlost = formdata.Rough_weight - totals.purity_weight;
  const weightlostper = (weightlost * 100 / formdata.Rough_weight).toFixed(2);
  const finalMU = (totals.MU / formdata.Rough_weight).toFixed(2);
  const finalRp = (totals.roughprice / formdata.Rough_weight).toFixed(2);

  const handlePrintPDF = () => {
    setisPDF(true);
  };

  useEffect(() => {
    if (isPDF) {
      const input = document.getElementById('pdf-content');
      const inputWidth = input.offsetWidth;
      const inputHeight = input.offsetHeight;

      html2canvas(input, { width: inputWidth, height: inputHeight }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); // Set PDF orientation to portrait ('p') and size to A4

        const imgWidth = pdf.internal.pageSize.getWidth(); // Width of A4 paper in mm
        let imgHeight = (canvas.height * imgWidth) / canvas.width; // Adjust height to maintain aspect ratio

        let heightLeft = imgHeight;
        let position = 0;

        while (heightLeft >= 0) {
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= imgHeight;
          position -= 297; // Move to the next page (297 mm is the height of A4 page)
          if (heightLeft > 0) {
            pdf.addPage();
          }
        }

        const RH_id = generatedId;
        const filename = `${RH_id}_report.pdf`;
        pdf.save(filename);

        navigate('/home');
      });
    }
  }, [isPDF, generatedId, navigate]);


  return (
    <>
      <div className='mt-12 mg:mt-20'>

        <div className='p-2'>

          <div className=''>

            <div className="flex flex-col sm:flex-row bg-teal-200 rounded-lg shadow-md p-6 mt-4 lg:mt-12 gap-4">
              <p className="text-teal-600 text-lg font-bold mb-4 sm:mb-0">ROUGH DIAMOND ID: {generatedId}</p>
              <div className="flex flex-wrap">
                {formdata && (
                  <>
                    <p className="text-gray-700 font-bold text-lg mr-4 mb-2 sm:mb-0">Date of Action: {formdata.Date_Of_Action}</p>
                    <p className="text-gray-700 font-bold text-lg mr-4 mb-2 sm:mb-0">Rough Weight: {formdata.Rough_weight}</p>
                    <p className="text-gray-700 font-bold text-lg mr-4 mb-2 sm:mb-0">Sieves: {selectedSieves}</p>
                    <p className="text-gray-700 font-bold text-lg mb-2 sm:mb-0">Description: {selectedRoughDesc}</p>
                  </>
                )}
              </div>
            </div>


            <div className='bg-teal-200 p-4 mt-2'>

              <h2 className='text-2xl font-bold text-center'>Rough Calculation</h2>

              <div className=' rounded-lg p-2 text-center '>


                <div className='mg:p-4 sm:flex mg:space-x-4 lg:space-x-4 '>

                <div className="mb-4 ">
                    <div>
                      <label>ENTER POLISH WEIGHT</label>
                    </div>
                    <input
                      type='number'
                      name='purity_weight'
                      value={formData.purity_weight}
                      onChange={handlePurityWeightChange}
                      className="mt-1 w-full p-2 rounded-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <div>
                      <label className="block">SELECTED SHAPE</label>
                    </div>
                    <div>
                      <ShapeDropdown
                        value={selectedShape}
                        onChange={setSelectedShape}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div>
                      <label className="block">SELECTED COLOUR</label>
                    </div>
                    <div>
                      <ColourDropdown
                        value={selectedColour}
                        onChange={setSelectedColour}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div>
                      <label className="block">SELECTED PURITY</label>
                    </div>
                    <div>
                      <PurityDropdown
                        value={selectedPurity}
                        onChange={setSelectedPurity}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div>
                      <label className="block">SELECTED CUT</label>
                    </div>
                    <div>
                      <CutDropdown
                        value={selectedCut}
                        onChange={setSelectedCut}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div>
                      <label className="block">SELECTED FLRN</label>
                    </div>
                    <div>
                      <FlrnDropdown
                        value={selectedFlrn}
                        onChange={setSelectedFlrn}
                      />
                    </div>
                  </div>

                  <div className="mb-4 bg-teal-300 rounded-lg p-2">
                    <div>
                      <label className="block">RATE: </label>
                    </div>
                    <div className=''>
                      {formData.Rate}
                    </div>
                  </div>

                  

                  <div className="mb-4 ">
                    <div>
                      <label>ENTER DISCOUNT</label>
                    </div>
                    <input
                      type='number'
                      name='discount'
                      value={formData.discount}
                      onChange={handleDiscountChange}
                      className="mt-1 w-full p-2 rounded-sm "
                    />
                  </div>

                  <div className="mb-4 bg-teal-300 rounded-lg p-2">
                    <div>
                      <label>PRICE: </label>
                    </div>
                    <div>
                      {formData.Price}
                    </div>
                  </div>

                  <div className="mb-4 bg-teal-300 rounded-lg p-2">
                    <div>
                      <label>VALUE: </label>
                    </div>
                    <div>
                      {formData.value}
                    </div>
                  </div>


                </div>

                <div className='mg:p-4 sm:flex mg:space-x-4 lg:space-x-4 '>

                  

                  <div className="mb-4">
                    <div>
                      <label>ENTER LABOUR COST</label>
                    </div>
                    <input
                      type='number'
                      name='labour'
                      value={formData.labour}
                      onChange={(e) => setFormData({ ...formData, labour: e.target.value })}
                      className="mt-1  w-full p-2 rounded-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <div>
                      <label>ENTER EXTRA EXPENSE</label>
                    </div>
                    <input
                      type='number'
                      name='extra_exp'
                      value={formData.extra_exp}
                      onChange={(e) => setFormData({ ...formData, extra_exp: e.target.value })}
                      className="mt-1  w-full p-2 rounded-sm"
                    />
                  </div>

                  <div className="mb-4 bg-teal-300 rounded-lg p-2">
                    <div>
                      <label>ROUGH PRICE: </label>
                    </div>
                    <div>
                      {formData.roughprice}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div>
                      <label>ENTER TRADED EXPENSES IN %</label>
                    </div>
                    <input
                      type='number'
                      name='tradeExpense'
                      value={tradeExpense}
                      onChange={handleMUvalue}
                      className="mt-1  w-full p-2 rounded-sm"
                    />
                  </div>

                  <div className="mb-4 bg-teal-300 rounded-lg p-2">
                    <div>
                      <label>MU:</label>
                    </div>
                    <div>
                      {formData.MU}
                    </div>
                  </div>


                  <div className=''>
                    <div className='bg-teal-500 text-white py-3 px-3  w-24 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'>
                      <button className='w-20' onClick={editMode ? handleUpdate : handleSubmit} disabled={submitting}>
                        {editMode ? 'Update' : 'Submit'}
                      </button>
                    </div>
                  </div>

                </div>


              </div>
            </div>
          </div>
        </div>



        <div className='m-2 border-2 p-2 bg-teal-100'>

          <div id="pdf-content" className='overflow-x-auto'>

            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4'>

              {formdata && (
                <div className='flex items-center mb-2 sm:mb-0'>
                  <div className="font-bold mr-2">Date of Auction:</div>
                  <div>{formdata.Date_Of_Action}</div>
                </div>
              )}

              {formdata && (
                <div className='flex items-center mb-2 sm:mb-0'>
                  <div className="font-bold mr-2">Rough Weight:</div>
                  <div>{formdata.Rough_weight}</div>
                </div>
              )}

              {formdata && (
                <div className='flex items-center mb-2 sm:mb-0'>
                  <div className="font-bold mr-2">Sieves:</div>
                  <div>{selectedSieves}</div>
                </div>
              )}

              {formdata && (
                <div className='flex items-center'>
                  <div className="font-bold mr-2">Description:</div>
                  <div>{selectedRoughDesc}</div>
                </div>
              )}

            </div>

            <div className='overflow-x-auto'>
              <div className='border-4 border-black'>
                <table className="w-full table-auto border-collapse text-center bg-teal-100">
                  <thead className="bg-teal-400">
                    <tr className='h-10'>
                      <th className="px-2">RH_ID</th>
                      <th className="px-2">ID</th>
                      <th className="px-2">SHAPE</th>
                      <th className="px-2">COLOUR</th>
                      <th className="px-2">PURITY</th>
                      <th className="px-2">CUT</th>
                      <th className="px-2">FLRN</th>
                      <th className="px-2">POLISH WEIGHT</th>
                      <th className="px-2">RATE</th>
                      <th className="px-2">DISC.%</th>
                      <th className="px-2">Price</th>
                      <th className="px-2">Value</th>
                      <th className="px-2">Labour</th>
                      <th className="px-2">Extra Expense</th>
                      <th className="px-2">Rough Price</th>
                      <th className="px-2">MU</th>
                      {!isPDF && <th className="px-2">Methods</th>}
                    </tr>
                  </thead>

                  <tbody>
                    {/* Rows */}
                    {fetchedData.map((item) => (
                      <tr key={item.ID}>
                        <td className="px-2 py-2">{item.RH_id}</td>
                        <td className="px-2 py-2">{item.ID}</td>
                        <td className="px-2 py-2">{item.shape_name}</td>
                        <td className="px-2 py-2">{item.colour_name}</td>
                        <td className="px-2 py-2">{item.purity_name}</td>
                        <td className="px-2 py-2">{item.cut_name}</td>
                        <td className="px-2 py-2">{item.flrn_name}</td>
                        <td className="px-2 py-2">{item.purity_weight}</td>
                        <td className="px-2 py-2">{item.Rate}</td>
                        <td className="px-2 py-2">{item.discount}</td>
                        <td className="px-2 py-2">{item.price}</td>
                        <td className="px-2 py-2">{item.value}</td>
                        <td className="px-2 py-2">{item.labour}</td>
                        <td className="px-2 py-2">{item.extra_exp}</td>
                        <td className="px-2 py-2">{item.roughprice}</td>
                        <td className="px-2 py-2">{item.MU}</td>
                        {!isPDF && (
                          <td className="px-2 py-2 flex">
                            <button onClick={() => handleEdit(item.ID)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2">Edit</button>
                            <button onClick={() => handleDelete(item.ID)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Delete</button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {/* Totals */}
                    <tr className="bg-teal-400 text-center h-10">
                      <td colSpan="7" className="px-2">Totals</td>
                      <td className="px-2">{totals.purity_weight.toFixed(2)}</td>
                      <td colSpan="3" className="px-2"></td>
                      <td className="px-2">{totals.value.toFixed(2)}</td>
                      <td className="px-2">{totals.labour}</td>
                      <td className="px-2">{totals.extra_exp}</td>
                      <td className="px-2 bg-red-500 text-white">{totals.roughprice.toFixed(2)}</td>
                      <td className="px-2">{totals.MU.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row sm:justify-between items-center mb-4 border-2 border-black p-4'>

              <div className='flex items-center mb-2 sm:mb-0'>
                <div className='font-bold'>Weight remain:</div>
                <div className='ml-2'>{weightlostper}%</div>
              </div>

              <div className='flex items-center mb-2 sm:mb-0'>
                <div className='font-bold'>Rough Price:</div>
                <div className='ml-2'>{finalRp}</div>
              </div>

              <div className='flex items-center'>
                <div className='font-bold'>Price after Trade Expenses:</div>
                <div className='ml-2'>{finalMU}</div>
              </div>

            </div>

          </div>

          <br></br>

          <button onClick={handlePrintPDF} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded">
            Download Report as PDF
          </button>

        </div>



      </div>

    </>
  );
};

export default RoughBody;
