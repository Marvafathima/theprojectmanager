import React from 'react';
import { Button, Typography } from "@material-tailwind/react";
import { ShieldExclamationIcon } from "@heroicons/react/24/solid";
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center max-w-md">
          <ShieldExclamationIcon className="mx-auto h-24 w-24 text-red-500 mb-6" />
          
          <Typography variant="h2" color="red" className="mb-4">
            Unauthorized Access
          </Typography>
          
          <Typography variant="paragraph" className="text-gray-700 mb-6">
            You do not have permission to access this page. 
            Please contact your system administrator if you believe this is an error.
          </Typography>
          
          <div className="flex justify-center space-x-4">
            <Button 
              color="red" 
              variant="outlined"
              onClick={handleGoBack}
            >
              Go to Home
            </Button>
            
            <Button 
              color="blue-gray" 
              variant="filled"
              onClick={handleGoBack}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Unauthorized;