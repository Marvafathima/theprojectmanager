import axios from 'axios';
import { store } from './store';
import { logout, setTokens } from './authSlice';
import { BASE_URL } from '../config';
// Create an axios instance
const axiosInstance = axios.create({
    baseURL:BASE_URL, 
//   baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/',
});

// Request interceptor to add access token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const accessToken = state.auth.accessToken;
    
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error status is 401 and there is no originalRequest._retry flag
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const state = store.getState();
        const refreshToken = state.auth.refreshToken;
        
        // If no refresh token, force logout
        if (!refreshToken) {
          store.dispatch(logout());
          return Promise.reject(error);
        }
        
        // Try to get new access token using refresh token
        const response = await axios.post('/token/refresh/', { 
          refresh: refreshToken 
        });
        
        // Update tokens in store
        store.dispatch(setTokens({
          accessToken: response.data.access,
          refreshToken: response.data.refresh
        }));
        
        // Retry the original request with new token
        originalRequest.headers['Authorization'] = 
          `Bearer ${response.data.access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout user
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
// import axios from 'axios';
// import { store } from '../slice/store'; 
// import { BASE_URL} from '../config';
// import { logout } from '../slice/authSlice';
// // Create an axios instance
// const axiosInstance = axios.create({
// //   baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/',
// baseURL:BASE_URL,
// });

// // Request interceptor to add access token to every request
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // const state = store.getState();
//     // const accessToken = state.auth.accessToken;
//     const accessToken =localStorage.getItem('accessToken');
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
//         // const state = store.getState();
//         // const refreshToken = state.auth.refreshToken;
//         const refreshToken = state.auth.refreshToken;
//         // If no refresh token, force logout
//         if (!refreshToken) {
//           store.dispatch(logout());
//           return Promise.reject(error);
//         }
        
//         // Try to get new access token using refresh token
//         const response = await axios.post('/token/refresh/', { 
//           refresh: refreshToken 
//         });
//         localStorage.setItem('accessToken', response.data.access);
//         localStorage.setItem('refreshToken', response.data.refresh);
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