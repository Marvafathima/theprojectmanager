import axios from 'axios';
import { BASE_URL } from '../config'; // Make sure to set your base URL
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

// Request interceptor to add auth header
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if we received a 401 error and that it's not a retry
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;  // Mark request as retrying

            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                // No refresh token available, redirect to login or logout
                console.log("No refresh token available, logging out...");
                const dispatch = useDispatch(); // Initialize dispatch
                dispatch(logout());
                const navigate=useNavigate()
                navigate("/")
                return Promise.reject(error);
            }

            try {
                // Attempt to refresh the access token
                const response = await axios.post(`${BASE_URL}api/token/refresh/`, { refresh: refreshToken });

                const { access } = response.data; // Assuming the response contains { access: "...", ... }

                // Update stored access token
                localStorage.setItem('accessToken', access);

                // Set the new access token for the original request
                originalRequest.headers.Authorization = `Bearer ${access}`;

                // Retry the original request with the new access token
                return axios(originalRequest);
            } catch (err) {
                console.log("Refresh token failed or expired, logging out...");
                // Log out user or redirect to login
                // localStorage.removeItem('accessToken');
                // localStorage.removeItem('refreshToken');
                const dispatch = useDispatch(); // Initialize dispatch
                dispatch(logout());
                const navigate=useNavigate()
                navigate("/")
                return Promise.reject(err);
            }
        }

        // If it's not a 401 error, just reject the promise
        return Promise.reject(error);
    }
);

export default axiosInstance;

// import axios from 'axios';
// import { store } from './store';
// import { logout, setTokens } from './authSlice';
// import { BASE_URL } from '../config';
// // Create an axios instance
// const axiosInstance = axios.create({
//     baseURL:`${BASE_URL}`, 
// //   baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/',
// });

// // Request interceptor to add access token to every request
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const state = store.getState();
//     const accessToken = state.auth.accessToken;
    
//     if (accessToken) {
//       config.headers['Authorization'] = `Bearer ${accessToken}`;
//     }
    
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor to handle token refresh
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
    
//     // If the error status is 401 and there is no originalRequest._retry flag
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       try {
//         const state = store.getState();
//         const refreshToken = state.auth.refreshToken;
        
//         // If no refresh token, force logout
//         if (!refreshToken) {
//           store.dispatch(logout());
//           return Promise.reject(error);
//         }
        
//         // Try to get new access token using refresh token
//         const response = await axios.post('api/token/refresh/', { 
//           refresh: refreshToken 
//         });
        
//         // Update tokens in store
//         store.dispatch(setTokens({
//           accessToken: response.data.access,
//           refreshToken: response.data.refresh
//         }));
        
//         // Retry the original request with new token
//         originalRequest.headers['Authorization'] = 
//           `Bearer ${response.data.access}`;
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         // If refresh fails, logout user
//         store.dispatch(logout());
//         return Promise.reject(refreshError);
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
