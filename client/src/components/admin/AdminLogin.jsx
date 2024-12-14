import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter, 
  Typography, 
  Input, 
  Button 
} from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import Layout from '../Layout';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login,logout } from '../../slice/authSlice';
import { fetchUserProjects } from '../../slice/projectSlice';

export function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log("button clicked")
    try {
      // Using the loginUser thunk from your slice
      if (validateForm()){
        const resultAction = await dispatch(login(formData)).unwrap();
        console.log(resultAction)
        if (resultAction.user && resultAction.user.role=="admin" ){
          dispatch(fetchUserProjects())
          navigate('/hrdashboard')
          
          toast.success("login successfull.")
        }
        else{
          dispatch(logout())
          
         
          toast.error("Not an admin.Login Failed")
        }
        
      } 
    } catch (err) {
      console.error('Login failed:', err);
      if (err && typeof err === 'object') {
        const errorMessages = Object.entries(err).map(([field, message]) => {
          return `${field}: ${Array.isArray(message) ? message.join(', ') : message}`;
        }).join('\n');
  
        toast.error(`Login failed:\n${errorMessages}`);
      } else {
        toast.error('Login failed. Please try again later.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6 text-center">
              <Typography variant="h3" color="white" className="font-bold">
                Admin Login
              </Typography>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <Input 
                  label="Email" 
                  size="lg" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  className="border-2 border-gray-300 focus:border-gray-500 transition-all duration-300"
                />
                {errors.email && (
                  <Typography color="red" className="mt-1 text-xs pl-2">
                    {errors.email}
                  </Typography>
                )}
              </div>
              
              <div>
                <Input 
                  type="password" 
                  label="Password" 
                  size="lg" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  className="border-2 border-gray-300 focus:border-gray-500 transition-all duration-300"
                />
                {errors.password && (
                  <Typography color="red" className="mt-1 text-xs pl-2">
                    {errors.password}
                  </Typography>
                )}
              </div>

              <Button 
                className={`
                  w-full py-3 rounded-lg 
                  bg-gradient-to-r from-gray-700 to-gray-900 
                  hover:from-gray-800 hover:to-gray-950
                  text-white font-bold 
                  transition-all duration-300
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                variant="filled" 
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>

              <Typography variant="small" className="text-center mt-4">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="font-bold text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Sign Up
                </Link>
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminLogin;

