import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from "@material-tailwind/react";
 import { store,persistor } from './slice/store.jsx';
 import { Provider } from 'react-redux';
 import { PersistGate } from 'redux-persist/integration/react';
createRoot(document.getElementById('root')).render(
  <StrictMode>
     <Provider store={store}>
     <PersistGate loading={null} persistor={persistor}>
     <ThemeProvider>
    
    <App />
    </ThemeProvider>
    </PersistGate>
    </Provider>
  </StrictMode>,
)
