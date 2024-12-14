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
import EmployeeProjectDetail from './components/employee/EmployeeProjectDetail'
import EmployeeProjects from './components/employee/EmployeeProjects'
import TaskDetailComponent from './components/employee/TaskDetailComponent'
import TaskListComponent from './components/employee/TaskListComponent'
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
     
      {/* <Route path="/hrdashboard" element={ <ManagerDashboard/>}></Route> */}
     
      <Route path="/hrdashboard" element={<RoleProtectedRoute allowedRoles={['manager','admin']} > <ManagerDashboard/></RoleProtectedRoute>}></Route>
      <Route path="/projects" element={<RoleProtectedRoute allowedRoles={['manager','admin']} >
         <UserProjects/></RoleProtectedRoute>}></Route>
         <Route path="/myprojects" element={<RoleProtectedRoute allowedRoles={['employee']} >
         <EmployeeProjects/></RoleProtectedRoute>}></Route>
         <Route path="/myprojects/:projectId" element={<RoleProtectedRoute allowedRoles={['employee']} ><EmployeeProjectDetail projectId={useParams().projectId} /></RoleProtectedRoute>} />
      <Route path="/tasklist" element={<RoleProtectedRoute allowedRoles={['employee','manager','admin']} ><TaskListComponent/></RoleProtectedRoute>} />
      <Route path="/task/:taskId" element={<RoleProtectedRoute allowedRoles={['employee','manager','admin']} ><TaskDetailComponent projectId={useParams().taskId} /></RoleProtectedRoute>} />
      
      <Route path="/projects/:projectId" element={<RoleProtectedRoute allowedRoles={['manager','admin']} ><ProjectDetail projectId={useParams().projectId} /></RoleProtectedRoute>} />
       
        </Routes></BrowserRouter>  
        <ToastContainer/>
    </>
  )
}

export default App
