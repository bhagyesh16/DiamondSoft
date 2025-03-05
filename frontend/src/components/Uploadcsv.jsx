import React from 'react'
import FileUploadForm from '../Homecomponents/FileUploadForm';

function Uploadcsv() {
    
    
    return (
        
        <>

        <div className='p-2 rounded-lg bg-teal-200 '>
            
            <div className="p-2">
                <h1 className="text-2xl font-bold mb-4">Upload Your CSV file here</h1>
                <FileUploadForm />
            </div>

        </div>
            
        </>
    );
}

export default Uploadcsv;