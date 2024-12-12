import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Layout from './components/Layout'
import Signup from './components/Signup'
import Login from './components/Login'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from './components/Dashboard'
import { ToastContainer, toast } from 'react-toastify';
function App() {


  return (
    <>
        <BrowserRouter>
       <Routes>
     
       <Route path="/signup" element={<Signup/>}></Route>
       <Route path="/login" element={<Login/>}></Route>
      <Route path="/dashboard" element={<Dashboard/>}></Route>
       
        </Routes></BrowserRouter>  
        <ToastContainer/>
    </>
  )
}

export default App
