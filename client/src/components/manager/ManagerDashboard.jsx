
import React, { useState,useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Typography, 
  Button, 
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option
} from "@material-tailwind/react";

import { 
  ChartPieIcon, 
  PlusIcon,
  FolderIcon, 
  ClipboardDocumentListIcon 
} from "@heroicons/react/24/solid";

import Layout from '../Layout';
import { toast } from 'react-toastify';
import { fetchUserProjects } from '../../slice/projectSlice';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
const ManagerDashboard = () => {


const [projects, setProjects] = useState([]);

const [openProjectModal, setOpenProjectModal] = useState(false);

const navigate=useNavigate();
const dispatch=useDispatch();
const { userprojects, loading, error } = useSelector((state) => state.project);
  useEffect(() => {
    dispatch(fetchUserProjects());
  }, [dispatch]);
// Project Form State
const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'planned'
  });



  const handleOpenProjectModal = () => setOpenProjectModal(!openProjectModal);

  // Project Creation Handler
  const handleProjectCreate = async () => {
    // Validate project form
    const { title, description, start_date, end_date, status } = projectForm;
    console.log("this is projectform",projectForm)
    // Validate required fields
    if (!title || !start_date || !end_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate date comparison
    const today = new Date().toISOString().split('T')[0];
    if (start_date < today) {
      toast.error('Start date cannot be in the past');
      return;
    }
    if (new Date(end_date) <= new Date(start_date)) {
      toast.error('End date must be after start date');
      return;
    }

    try {
        console.log("this is projectform",projectForm)
      const response = await axiosInstance.post(`projects/`, projectForm, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      // Add new project to the list
      setProjects([response.data, ...projects]);
      
      // Close modal and reset form
      setOpenProjectModal(false);
      setProjectForm({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'planned'
      });

      toast.success('Project created successfully');
      navigate("/projects")
    } catch (err) {

      if (err && typeof err === 'object') {
        const errorMessages = Object.entries(err).map(([field, message]) => {
          return `${field}: ${Array.isArray(message) ? message.join(', ') : message}`;
        }).join('\n');
        setOpenProjectModal(false);
        toast.error(`${errorMessages}`);
      } else {
        setOpenProjectModal(false);
        toast.error('Failed to create project');
      }
     
    }
  };


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


 

  // Form input change handlers
  const handleProjectInputChange = (e) => {
    const { name, value } = e.target;
    setProjectForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

 

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Typography variant="h3" color="blue-gray" className="mb-8 text-center font-bold">
          Manager Dashboard
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
              <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
              <Card 
            className="flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-2 border-2 border-dashed border-ocean_green-100"
            onClick={handleOpenProjectModal}
          >
            <CardBody className="text-center">
              <PlusIcon className="mx-auto mb-2 text-ocean_green-100 h-12 w-12" />
              <Typography variant="h6" color="blue-gray">Create New Project</Typography>
            </CardBody>
          </Card>
              
              </div>
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
        

        {/* Project Creation Modal */}
        <Dialog open={openProjectModal} handler={() => setOpenProjectModal(false)}>
        <DialogHeader>Create New Project</DialogHeader>
        <DialogBody divider>
          <div className="grid gap-4">
            <Input 
              label="Project Title" 
              name="title"
              value={projectForm.title}
              onChange={handleProjectInputChange}
            />
            <Input 
              label="Description" 
              name="description"
              value={projectForm.description}
              onChange={handleProjectInputChange}
            />
            <Input 
              type="date" 
              label="Start Date" 
              name="start_date"
              value={projectForm.start_date}
              onChange={handleProjectInputChange}
            />
            <Input 
              type="date" 
              label="End Date" 
              name="end_date"
              value={projectForm.end_date}
              onChange={handleProjectInputChange}
            />
            <Select 
              label="Status"
              name="status"
              value={projectForm.status}
              onChange={(val) => setProjectForm(prev => ({...prev, status: val}))}
            >
              <Option value="planned">Planned</Option>
              <Option value="active">Active</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button 
            variant="text" 
            color="red" 
            onClick={() => setOpenProjectModal(false)}
          >
            Cancel
          </Button>
          <Button 
            color="green" 
            onClick={handleProjectCreate}
          >
            Create Project
          </Button>
        </DialogFooter>
      </Dialog>

     
      </div>
    </Layout>
  );
};

export default ManagerDashboard;