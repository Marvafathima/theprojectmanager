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
import ManagerDashboard from './components/manager/ManagerDashboard'
import { RoleProtectedRoute } from './routes/RoleProtectedRoute'
import { ProtectedRoute } from './routes/ProtectedRoute'
import UserProjects from './components/manager/UserProjects'
import ProjectDetail from './components/manager/ProjectDetail'
import { useParams } from 'react-router-dom'
function App() {


  return (
    <>
        <BrowserRouter>
       <Routes>
       <Route path="/signup" element={<Signup/>}></Route>
       <Route path="/login" element={<Login/>}></Route>
       {/* <Route path="/signup" element={<ProtectedRoute><Signup/></ProtectedRoute>}></Route> */}
       {/* <Route path="/login" element={<ProtectedRoute><Login/></ProtectedRoute>}></Route> */}
      <Route path="/dashboard" element={<Dashboard/>}></Route>
      <Route path="/hrdashboard" element={<RoleProtectedRoute allowedRoles={['manager']} > <ManagerDashboard/></RoleProtectedRoute>}></Route>
      <Route path="/projects" element={<RoleProtectedRoute allowedRoles={['manager']} > <UserProjects/></RoleProtectedRoute>}></Route>
      <Route path="/projects/:projectId" element={<RoleProtectedRoute allowedRoles={['manager']} ><ProjectDetail projectId={useParams().projectId} /></RoleProtectedRoute>} 
/>
       
        </Routes></BrowserRouter>  
        <ToastContainer/>
    </>
  )
}

export default App
