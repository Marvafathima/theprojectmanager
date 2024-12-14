
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
  PlusIcon, 
  FolderIcon, 
  ClipboardListIcon, 
  UsersIcon 
} from "lucide-react";
import Layout from '../Layout';
import { toast } from 'react-toastify';
import { fetchUserProjects } from '../../slice/projectSlice';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useSelector } from 'react-redux';
const ManagerDashboard = () => {


const [projects, setProjects] = useState([]);
const [users, setUsers] = useState([]);
const [openProjectModal, setOpenProjectModal] = useState(false);
const [openTaskModal, setOpenTaskModal] = useState(false);
const [selectedProject, setSelectedProject] = useState(null);
const navigate=useNavigate();
const { userprojects, loading, error } = useSelector((state) => state.project);

// Project Form State
const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'planned'
  });

  // Task Form State
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    project_id: null,
    assigned_to_id: null,
    status: 'to_do',
    priority: 'medium',
    start_date: '',
    due_date: ''
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


  // Task Creation Handler
  const handleTaskCreate = async () => {
    const { title, description, project_id, assigned_to_id, status, priority, start_date, due_date } = taskForm;

    // Validate required fields
    if (!title || !project_id || !assigned_to_id || !start_date || !due_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate date comparison

    const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

  const startDate = new Date(start_date);
  startDate.setHours(0, 0, 0, 0);
  if (startDate < today) {
    toast.error('Start date cannot be in the past');
    return;
  }
    if (new Date(due_date) <= new Date(start_date)) {
      toast.error('Due date must be after start date');
      return;
    }

    try {
      const response = await axiosInstance.post(`tasks/`, taskForm, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      // Update the specific project's tasks
      const updatedProjects = projects.map(proj => 
        proj.id === project_id 
          ? { ...proj, tasks: [...(proj.tasks || []), response.data] }
          : proj
      );

      setProjects(updatedProjects);
      
      // Close modal and reset form
      setOpenTaskModal(false);
      setTaskForm({
        title: '',
        description: '',
        project_id: null,
        assigned_to_id: null,
        status: 'to_do',
        priority: 'medium',
        start_date: '',
        due_date: ''
      });

      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
      console.error(error);
    }
  };

  // Form input change handlers
  const handleProjectInputChange = (e) => {
    const { name, value } = e.target;
    setProjectForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open Task Modal for a specific project
  const handleOpenTaskModal = (project) => {
    setSelectedProject(project);
    setTaskForm(prev => ({
      ...prev,
      project_id: project.id
    }));
    setOpenTaskModal(true);
  };




  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-ocean_green-100';
      case 'planned': return 'bg-orange-100';
      case 'completed': return 'bg-deep_green';
      default: return 'bg-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-deep_orange-500 text-white';
      case 'medium': return 'bg-orange-100';
      case 'low': return 'bg-green-200';
      default: return 'bg-gray-200';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Typography variant="h3" color="blue-gray" className="mb-8 text-center font-bold">
          Manager Dashboard
        </Typography>

        {/* Staqts Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { 
              icon: FolderIcon, 
              title: "Total Projects", 
              value:userprojects.length, 
              color: "text-ocean_green-50",
              bgColor: "bg-ocean_green-50/20"
            },
            { 
              icon: ClipboardListIcon, 
              title: "Active Projects", 
              value:userprojects?.filter(p => p.status === 'active').length, 
              color: "text-green-500",
              bgColor: "bg-green-500/20"
            },
            { 
              icon: UsersIcon, 
              title: "Tasks Pending", 
              value:userprojects?.reduce((acc, proj) => acc + proj.tasks.filter(t => t.status !== 'done').length, 0), 
              color: "text-deep_orange-400",
              bgColor: "bg-deep_orange-400/20"
            }
          ].map((stat, index) => (
            <Card 
              key={index} 
              className={`${stat.bgColor} shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
            >
              <CardBody className="flex items-center space-x-6 p-6">
                <stat.icon className={`h-12 w-12 ${stat.color}`} />
                <div>
                  <Typography variant="h5" color="blue-gray" className="font-bold">{stat.value}</Typography>
                  <Typography variant="small" color="gray">{stat.title}</Typography>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Projects Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
            >
              <CardHeader 
                color="transparent" 
                className={`${getStatusColor(project.status)} p-4 flex justify-between items-center`}
              >
                <Typography variant="h5" color="white" className="font-bold">{project.title}</Typography>
                <Chip 
                  value={project.status} 
                  color="white" 
                  className="text-xs capitalize" 
                />
              </CardHeader>
              <CardBody className="space-y-4">
                <Typography variant="small" color="gray" className="h-12 overflow-hidden">
                  {project.description}
                </Typography>
                <div className="flex justify-between text-xs text-gray-600 mb-4">
                  <span>Start: {project.startDate}</span>
                  <span>End: {project.endDate}</span>
                </div>

                <div>
                  <Typography variant="small" className="font-bold mb-3">
                    Tasks ({project.tasks.length})
                  </Typography>
                  {project.tasks.length > 0 ? (
                    project.tasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="flex justify-between items-center bg-gray-100 p-3 rounded-md mb-2 hover:bg-gray-200 transition-colors"
                      >
                        <div>
                          <Typography variant="small" className="font-medium">{task.title}</Typography>
                          <Typography variant="small" color="gray" className="text-xs">
                            {task.assignedTo}
                          </Typography>
                        </div>
                        <Chip 
                          value={task.priority} 
                          size="sm" 
                          className={`capitalize text-xs ${getPriorityColor(task.priority)}`}
                        />
                      </div>
                    ))
                  ) : (
                    <Typography variant="small" color="gray" className="text-center italic">
                      No tasks yet
                    </Typography>
                  )}
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button 
                    size="sm" 
                    variant="outlined" 
                    color="blue-gray"
                    className="hover:bg-gray-100 transition-colors"
                    onClick={() => handleOpenTaskModal(project)}
                  >
                    Add Task
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}

          {/* Add Project Button */}
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

      {/* Task Creation Modal */}
      <Dialog open={openTaskModal} handler={() => setOpenTaskModal(false)}>
        <DialogHeader>
          Create Task for {selectedProject?.title}
        </DialogHeader>
        <DialogBody divider>
          <div className="grid gap-4">
            <Input 
              label="Task Title"
              name="title"
              value={taskForm.title}
              onChange={handleTaskInputChange}
            />
            <Input 
              label="Description"
              name="description"
              value={taskForm.description}
              onChange={handleTaskInputChange}
            />
            <Select
              label="Assigned To"
              name="assigned_to_id"
              value={taskForm.assigned_to_id}
              onChange={(val) => setTaskForm(prev => ({...prev, assigned_to_id: val}))}
            >
              {users.map(user => (
                <Option key={user.id} value={user.id}>
                  {user.name}
                </Option>
              ))}
            </Select>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Status"
                name="status"
                value={taskForm.status}
                onChange={(val) => setTaskForm(prev => ({...prev, status: val}))}
              >
                <Option value="to_do">To Do</Option>
                <Option value="in_progress">In Progress</Option>
                <Option value="done">Done</Option>
              </Select>
              <Select
                label="Priority"
                name="priority"
                value={taskForm.priority}
                onChange={(val) => setTaskForm(prev => ({...prev, priority: val}))}
              >
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                type="date"
                label="Start Date"
                name="start_date"
                value={taskForm.start_date}
                onChange={handleTaskInputChange}
              />
              <Input 
                type="date"
                label="Due Date"
                name="due_date"
                value={taskForm.due_date}
                onChange={handleTaskInputChange}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button 
            variant="text" 
            color="red" 
            onClick={() => setOpenTaskModal(false)}
          >
            Cancel
          </Button>
          <Button 
            color="green" 
            onClick={handleTaskCreate}
          >
            Create Task
          </Button>
        </DialogFooter>
      </Dialog>
      </div>
    </Layout>
  );
};

export default ManagerDashboard;