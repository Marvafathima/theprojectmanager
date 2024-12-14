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
import Layout from './Layout';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signup,login,logout } from '../slice/authSlice';
import { fetchUserProjects } from '../slice/projectSlice';
export function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);
  const [errors, setErrors] = useState({});
  const dispatch=useDispatch();
  const navigate=useNavigate()
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
   
    try {
      // Using the loginUser thunk from your slice
      if (validateForm()){
        const resultAction = await dispatch(login(formData)).unwrap();
        console.log(resultAction)
        if (resultAction.user && resultAction.user.role=="employee" ){
          dispatch(fetchUserProjects())
          navigate('/dashboard')
          
          toast.success("login successfull.")
        }
        else if(resultAction.user.role=="admin"){
          dispatch(logout())
          navigate('/adminlogin')
          toast.error("Login through Admin Login")
        }
        else{
          dispatch(fetchUserProjects())
          navigate('/hrdashboard');
         
          toast.success("login successfull.")
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
    <div className="flex justify-center items-center min-h-screen bg-orange-50 p-4">
      <Card className="w-full max-w-[24rem]">
        <CardHeader 
          variant="gradient" 
           
          className="mb-4 grid h-28 place-items-center bg-deep_orange-400"
        >
          <Typography variant="h3" color="white">
            Log In
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Input 
            label="Email" 
            size="lg" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
          />
          {errors.email && (
            <Typography color="red" className="-mt-3 text-xs">
              {errors.email}
            </Typography>
          )}
          
          <Input 
            type="password" 
            label="Password" 
            size="lg" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
          />
          {errors.password && (
            <Typography color="red" className="-mt-3 text-xs">
              {errors.password}
            </Typography>
          )}
        </CardBody>
        <CardFooter className="pt-0">
          <Button 
          className={`mt-1 rounded-lg sm:mt-0 bg-ocean_green-50
          text-white
          hover:bg-ocean_green-100
          hover:text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
            variant="fulfilled" 
            disabled={loading}
            fullWidth 
            onClick={handleSubmit}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <Typography variant="small" className="mt-6 flex justify-center">
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              className="ml-1 font-bold text-ocean_green-50"
            >
              Sign Up
            </Link>
          </Typography>
        </CardFooter>
      </Card>
    </div></Layout>
  );
}

export default Login;