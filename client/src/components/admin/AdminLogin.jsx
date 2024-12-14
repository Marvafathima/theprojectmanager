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
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { login } from '../../slice/authSlice';
// import { fetchUserProjects } from '../../slice/projectSlice';
// import Layout from '../Layout';
// import { logout } from '../../slice/authSlice';
// const AdminLogin = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [errors,setErrors]=useState({})
//   // Get loading and error states from Redux
//   const loading=useSelector(state=>state.auth)
//   const validateForm = () => {
//     const newErrors = {};

//     // Email validation
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }

//     // Password validation
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async () => {
//     console.log("button clicked")
//      try {
//        // Using the loginUser thunk from  slice
//        if (validateForm()){
//          const resultAction = await dispatch(login(formData)).unwrap();
//          console.log(resultAction)
//          if (resultAction.user && resultAction.user.role=="admin" ){
//            dispatch(fetchUserProjects())
//            navigate('/hrdashboard')
           
//            toast.success("login successfull.")
//          }
//          else{
//            dispatch(logout())
//            navigate('/login');
          
//            toast.success("Admin login only allowed")
//          }
         
//        } 
//      } catch (err) {
//        console.error('Login failed:', err);
//        if (err && typeof err === 'object') {
//          const errorMessages = Object.entries(err).map(([field, message]) => {
//            return `${field}: ${Array.isArray(message) ? message.join(', ') : message}`;
//          }).join('\n');
   
//          toast.error(`Login failed:\n${errorMessages}`);
//        } else {
//          toast.error('Login failed. Please try again later.');
//        }
//      }
//    };

//   return (
//     <Layout>
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
//           <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          
//           <form onSubmit={handleSubmit}>
//             {/* Show error message if exists */}
//             {errors&& (
//               <div className="mb-4 text-red-500 text-center">
//                 {errors}
//               </div>
//             )}
            
//             <div className="mb-4">
//               <label className="block mb-2">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded"
//                 required
//               />
//             </div>

//             <div className="mb-6">
//               <label className="block mb-2">Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border rounded"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
//                 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//             >
//               {loading ? 'Logging in...' : 'Login'}
//             </button>
//           </form>
//         </div>
//       </div>



//     </Layout>
//   );
// };

// export default AdminLogin;