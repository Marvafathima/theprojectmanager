import React, { useState, useEffect } from 'react';
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
import { Layout } from '../Layout'; // Your existing layout component
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import TaskUpdateModal from './TaskUpdateModal';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
const EmployeeProjectDetail = () => {
  // State management
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [isTaskUpdateModalOpen, setIsTaskUpdateModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null); // Task being edited
  const user=useSelector(state=>state.auth)
  
  const { projectId } = useParams(); 
  const navigate=useNavigate();
  
   const [selectedTask, setSelectedTask] = useState(null); // For task update 
  //   const [taskToUpdate, setTaskToUpdate] = useState(null);
  const [taskToUpdate, setTaskToUpdate] = useState({
    id: null,
    title: '',
    description: '',
    status: 'to-do',
    priority: 'medium',
    assigned_to: null,
    start_date: '',
    due_date: ''
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'to-do',
    priority: 'medium',
    assigned_to: null,
    start_date: '',
    due_date: ''
  });
 // Validation State
 const [validationErrors, setValidationErrors] = useState({});

  // Fetch Project Details
  const fetchProjectDetails = async () => {
    setIsLoading(true);
    try {
      // Fetch project details
      console.log("projectId",projectId)
      const projectResponse = await axiosInstance.get(`projects/${projectId}/`);
      setProject(projectResponse.data);

      // Fetch project tasks
      const tasksResponse = await axiosInstance.get(`projects/${projectId}/tasks/`);
      setTasks(tasksResponse.data);
      console.log("task data fetvched",tasksResponse.data)
      // Fetch users for assignment
      const usersResponse = await axiosInstance.get('api/user/users/');
      setUsers(usersResponse.data);
      setError(null);
    } 
    catch (err) {
      setError('Failed to fetch project details');
      setProject(null);
      setTasks([]);
      toast.error("Failed to fetch project details")
      navigate("/myprojects")

    } finally {
      setIsLoading(false);
    }
   
  };
  const openTaskUpdateModal = (task) => {
    setTaskToEdit(task);
    setIsTaskUpdateModalOpen(true);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setIsTaskUpdateModalOpen(false);
  };
//   const fetchTaskDetails = useCallback(async () => {
//     if (!taskId) {
//       setError(new Error('No task ID provided'));
//       setIsLoading(false);
//       return null;
//     }

//     try {
//       setIsLoading(true);
//       const response = await axiosInstance.get(`tasks/${taskId}/`);
//       setTasks(response.data);
//       setError(null);
//       return response.data;
//     } catch (err) {
//       const errorMessage = err.response?.data?.detail 
//         || err.response?.data?.message 
//         || 'Failed to fetch task details';
      
//       setError(err);
//       toast.error(errorMessage);
//       console.error('Task fetch error:', err);
      
//       return null;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchTaskDetails();
//   }, [fetchTaskDetails]);

// const fetchTaskDetails = useCallback(async (taskId) => {
//     if (!taskId) {
//       setError(new Error('No task ID provided'));
//       setIsLoading(false);
//       return null;
//     }

//     try {
//       setIsLoading(true);
//       const response = await axiosInstance.get(`tasks/${taskId}/`);
//       setTask(response.data);
//       setError(null);
//       return response.data;
//     } catch (err) {
//       const errorMessage = err.response?.data?.detail 
//         || err.response?.data?.message 
//         || 'Failed to fetch task details';
      
//       setError(err);
//       toast.error(errorMessage);
//       console.error('Task fetch error:', err);
      
//       return null;
//     } finally {
//       setIsLoading(false);
//     }
//   }, [taskId]);

//   useEffect(() => {
//     fetchTaskDetails();
//   }, [fetchTaskDetails]);
 
// const openTaskUpdateModal = (task) => {
//     setTaskToUpdate({
//       id: task.id,
//       title: task.title,
//       description: task.description,
//       status: task.status,
//       priority: task.priority,
//       assigned_to: task.assigned_to,
//       start_date: task.start_date,
//       due_date: task.due_date
//     });
//     setIsTaskUpdateModalOpen(true);
//   };

  useEffect(() => {
    console.log('Current taskToUpdate:', taskToUpdate);
  }, [taskToUpdate]);
 

 
  

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  // Render Loading State
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <Typography variant="h4" color="blue-gray">
            Loading Project Details...
          </Typography>
        </div>
      </Layout>
    );
  }

  // Render Error State
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <Typography variant="h4" color="red">
            {error}
          </Typography>
        </div>
      </Layout>
    );
  }


 
  // Render Task Priority Chip
  const renderPriorityChip = (priority) => {
    const colorMap = {
      low: 'green',
      medium: 'orange',
      high: 'red'
    };
    return (
      <Chip 
        value={priority} 
        color={colorMap[priority] || 'blue-gray'} 
        size="sm" 
        className="capitalize"
      />
    );
  };

  // Render Task Status Chip
  const renderStatusChip = (status) => {
    const colorMap = {
      pending: 'orange',
      in_progress: 'blue',
      completed: 'green'
    };
    return (
      <Chip 
        value={status.replace('_', ' ')} 
        color={colorMap[status] || 'blue-gray'} 
        size="sm" 
        className="capitalize"
      />
    );
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        {/* Project Header */}
        <Card className="mb-6 bg-deep-orange-50">
        
          <CardHeader color="deep-orange" className="relative h-56 flex items-center justify-center">
  {/* Check if there's an image, if not show the title */}
  {!project.image_url ? (
    <Typography
      variant="h3"  // Use a large heading size
      color="white"
      className="text-center text-white font-bold sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
    >
      {project.title}
    </Typography>
  ) : (
    <img
      src={project.image_url || '/default-project-image.png'}
      alt={project.name}
      className="h-full w-full object-cover"
    />
  )}
</CardHeader>
          <CardBody>
            <div className="flex justify-between items-center">
              <Typography variant="h4" color="blue-gray">
                {project.name}
              </Typography>
              <Chip 
                value={project.status} 
                color="green" 
                variant="outlined" 
                className="capitalize"
              />
            </div>
            <Typography color="gray" className="mt-2 mb-4">
              {project.description}
            </Typography>
            <div className="flex space-x-2">
              <Typography color="gray">
                Created by: {project.created_by.username}
              </Typography>
              <Typography color="gray">
                Created On: {new Date(project.created_at).toLocaleDateString()}
              </Typography>
            </div>
            <div className="flex space-x-2">
            <Typography color="gray">
                Start Date: {new Date(project.start_date).toLocaleDateString()}
              </Typography>
              <Typography color="gray">
                Deadline:  {new Date(project.end_date).toLocaleDateString()}
              </Typography>
             
            </div>
          
          </CardBody>
        </Card>

        
      <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h5" color="blue-gray">
              Project Tasks
            </Typography>
            
          </div>

          {/* Tasks Grid */}
          {tasks.length === 0 ? (
            <Typography color="gray" className="text-center">
              No tasks for this project yet
            </Typography>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <Card key={task.id} className="bg-green-50">
                  <CardBody>
                    <div className="flex justify-between items-start mb-2">
                      <Typography variant="h6" color="blue-gray">
                        {task.title}
                      </Typography>
                      {renderPriorityChip(task.priority)}
                    </div>
                    <Typography color="gray" className="mb-2">
                      {task.description}
                    </Typography>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Typography color="gray" variant="small">
                          Status: {renderStatusChip(task.status)}
                        </Typography>
                      </div>
                      <div className="flex justify-between items-center">
                        <Typography color="gray" variant="small">
                          Assigned to: {task.assigned_to?.username || 'Unassigned'}
                        </Typography>
                      </div>
                      {task.start_date && (
                        <Typography color="gray" variant="small">
                          Start Date: {new Date(task.start_date).toLocaleDateString()}
                        </Typography>
                      )}
                      {task.due_date && (
                        <Typography color="gray" variant="small">
                          Due Date: {new Date(task.due_date).toLocaleDateString()}
                        </Typography>
                      )}
                    </div>
                     <Button onClick={() => openTaskUpdateModal(task)}>Edit</Button>
                    
                 
                
                  </CardBody>
                  {/* {task && (
        <TaskUpdateModal
          task={task}
          taskId={task.id}
          isOpen={isTaskUpdateModalOpen}
          onClose={() => setIsTaskUpdateModalOpen(false)}
          fetchTaskDetails={() => fetchTaskDetails(task.id)} 
        />
        )} */}
                </Card>

                
              ))}
            </div>
          )}
        </div>

       

    
      </div>
{/* Task Update Modal */}
{taskToEdit && (
        <TaskUpdateModal
          isOpen={isTaskUpdateModalOpen}
          onClose={() => setIsTaskUpdateModalOpen(false)}
          task={taskToEdit}
          onTaskUpdate={handleTaskUpdate}
        />
      )}


    </Layout>
  );
};

export default EmployeeProjectDetail;