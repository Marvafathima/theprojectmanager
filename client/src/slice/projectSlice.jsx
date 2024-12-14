import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
// Async thunk to fetch projects
export const fetchUserProjects = createAsyncThunk(
  'projects/fetchUserProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('projects/user-projects');
     
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch projects');
    }
  }
);

// Initial state
const initialState = {
  userprojects: [],
  loading: 'idle',
  error: null
};

// Create the project slice
const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // Add any additional synchronous reducers if needed
    clearProjects: (state) => {
      state.projects = [];
      state.loading = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProjects.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.loading = 'succeeded';
       
        state.userprojects = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProjects.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
        state.projects = [];
      });
  }
});

export const { clearProjects } = projectSlice.actions;
export default projectSlice.reducer;