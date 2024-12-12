import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Initial State
import axios from 'axios';

const initialState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null
};

// Async Thunks
export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/signup/', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Signup failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/token/', credentials);
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Call logout endpoint
      await axios.post('/logout/', { refresh_token: refreshToken });
      
      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Logout failed');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = !!accessToken;
      
      // Update localStorage
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    }
  },
  extraReducers: (builder) => {
    // Signup
    builder.addCase(signup.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.isAuthenticated = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    });
    
    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    });
  }
});

export const { setTokens } = authSlice.actions;
export default authSlice.reducer;

