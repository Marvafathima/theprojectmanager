// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './authSlice';
// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
// });
// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux';
import projectReducer from './projectSlice'
// Combine reducers if you have more than one
const rootReducer = combineReducers({
  auth: authReducer,
  project:projectReducer
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
});

// Export the persistor
export const persistor = persistStore(store);
