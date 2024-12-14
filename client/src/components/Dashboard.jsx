import React, { useState,useEffect } from 'react';
import { 
  Card, 
 Typography, 
 
} from "@material-tailwind/react";

import { 
  ChartPieIcon, 
  FolderIcon, 
  ClipboardDocumentListIcon 
} from "@heroicons/react/24/solid";

import Layout from './Layout';
import { fetchUserProjects } from '../slice/projectSlice';
import { useDispatch, useSelector } from 'react-redux';
const Dashboard = () => {



const dispatch=useDispatch();
const { userprojects, loading, error } = useSelector((state) => state.project);
  useEffect(() => {
    dispatch(fetchUserProjects());
  }, [dispatch]);


// Calculate project statistics
const calculateProjectStats = () => {
  return {
    totalProjects:  userprojects.length,
    activeProjects:  userprojects.filter(p => p.status === 'active').length,
    plannedProjects:  userprojects.filter(p => p.status === 'planned').length,
    completedProjects:  userprojects.filter(p => p.status === 'completed').length
  };
};

// Calculate task statistics
const calculateTaskStats = () => {
  const allTasks =  userprojects.flatMap(project => project.tasks || []);
  return {
    totalTasks: allTasks.length,
    todoTasks: allTasks.filter(t => t.status === 'todo').length,
    inProgressTasks: allTasks.filter(t => t.status === 'in-progress').length,
    doneTasks: allTasks.filter(t => t.status === 'done').length
  };
};

// Get two most recent projects
const getRecentProjects = () => {
  return  userprojects
  //   .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 2);
};
// Render statistics card
const StatCard = ({ icon, title, value, color }) => (
  <Card className={`p-4 bg-${color}-50 flex flex-row items-center space-x-4`}>
    <div className={`p-3 rounded-full bg-${color}-100`}>
      {icon}
    </div>
    <div>
      <Typography variant="h6" color="blue-gray">{title}</Typography>
      <Typography variant="h4" color="blue-gray">{value}</Typography>
    </div>
  </Card>
);

// Render recent project card
const RecentProjectCard = ({ project }) => (
  <Card className="p-4 mb-2">
    <div className="flex justify-between items-center">
      <Typography variant="h6" color="blue-gray">
        {project.title}
      </Typography>
      <Typography variant="small" color="gray">
        {new Date(project.created_at).toLocaleDateString()}
      </Typography>
    </div>
    <Typography variant="small" className="mt-2 text-gray-600">
      {project.description}
    </Typography>
  </Card>
);


 


  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Typography variant="h3" color="blue-gray" className="mb-8 text-center font-bold">
          Employee Dashboard
        </Typography>

       
   {loading=="pending" ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="red">Error: {error}</Typography>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Project Statistics Cards */}
            <StatCard 
              icon={<FolderIcon className="h-6 w-6 text-blue-500" />}
              title="Total Projects"
              value={calculateProjectStats().totalProjects}
              color="blue"
            />
            <StatCard 
              icon={<ChartPieIcon className="h-6 w-6 text-green-500" />}
              title="Active Projects"
              value={calculateProjectStats().activeProjects}
              color="green"
            />
            <StatCard 
              icon={<ClipboardDocumentListIcon className="h-6 w-6 text-orange-500" />}
              title="Total Tasks"
              value={calculateTaskStats().totalTasks}
              color="orange"
            />
            <StatCard 
              icon={<ClipboardDocumentListIcon className="h-6 w-6 text-purple-500" />}
              title="In Progress Tasks"
              value={calculateTaskStats().inProgressTasks}
              color="purple"
            />

            {/* Recent Projects Section */}
            <div className="col-span-full lg:col-span-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow"> */}
              {/* <Card 
            className="flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-2 border-2 border-dashed border-ocean_green-100"
            onClick={handleOpenProjectModal}
          >
            <CardBody className="text-center">
              <PlusIcon className="mx-auto mb-2 text-ocean_green-100 h-12 w-12" />
              <Typography variant="h6" color="blue-gray">Create New Project</Typography>
            </CardBody>
          </Card> */}
              
              {/* </div> */}
              <div className="bg-white p-4 rounded-lg shadow">
                <Typography variant="h5" className="mb-4">
                  Recent Projects
                </Typography>
                {getRecentProjects().map(project => (
                  <RecentProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </div>
        )}
        

       

     
      </div>
    </Layout>
  );
};

export default Dashboard;