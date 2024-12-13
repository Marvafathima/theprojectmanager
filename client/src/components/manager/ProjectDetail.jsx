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
const ProjectDetail = () => {
  // State management
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const { projectId } = useParams(); 
  const navigate=useNavigate();
   // Task Creation Modal State
   const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
   const [selectedTask, setSelectedTask] = useState(null); // For task update
   const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false); // Delete confirmation modal
  // Task Creation Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTaskUpdateModalOpen, setIsTaskUpdateModalOpen] = useState(false);
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
      navigate("/projects")

    } finally {
      setIsLoading(false);
    }
   
  };
// Update Project
const handleUpdateProject = async () => {
    try {
      await axiosInstance.put(`projects/${projectId}/`, project);
      toast.success("Project updated successfully");
      setIsProjectModalOpen(false); // Close modal
      fetchProjectDetails(); // Refresh project details
    } catch (err) {
      toast.error("Failed to update project");
    }
  };

  // Delete Project (if necessary)
  const handleDeleteProject = async () => {
    try {
      await axiosInstance.delete(`projects/${projectId}/`);
      toast.success("Project deleted successfully");
      navigate("/projects"); // Redirect to projects
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };


// const handleUpdateTask = async () => {
//     if (!validateTask()) {
//       return;
//     }
//     console.log("REACHED HERE",taskToUpdate)
//     try {
//       const response = await axiosInstance.put(`tasks/${taskToUpdate.id}/`, {
//         ...newTask,
//         project: projectId, // You might need to send project ID if your backend requires it
//         assigned_to: newTask.assigned_to ? newTask.assigned_to.id : null, // Ensure to send only id
//       });

//       // Update the task list with new data
//       setTasks((prevTasks) =>
//         prevTasks.map((task) => (task.id === response.data.id ? response.data : task))
//       );

//       toast.success("Task updated successfully");
//       setIsTaskUpdateModalOpen(false); // Close modal
//       setTaskToUpdate(null); // Reset task to update state
//     } catch (err) {
//     setIsTaskUpdateModalOpen(false); 
//       toast.error("Failed to update task");
//       console.error(err);
//     }
//   };
const handleUpdateTask = async () => {
    try {
      // Ensure all fields are included in the payload
      const payload = {
        title: taskToUpdate.title,
        description: taskToUpdate.description,
        status: taskToUpdate.status,
        priority: taskToUpdate.priority,
        project: projectId,
        assigned_to: taskToUpdate.assigned_to ? taskToUpdate.assigned_to.id : null,
        start_date: taskToUpdate.start_date,
        due_date: taskToUpdate.due_date
      };
  
      const response = await axiosInstance.put(`tasks/${taskToUpdate.id}/`, payload);
      
      // Update the task list with new data
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === response.data.id ? response.data : task))
      );
  
      toast.success("Task updated successfully");
      setIsTaskUpdateModalOpen(false);
    } catch (err) {
      console.error('Update error:', err.response ? err.response.data : err);
      
      if (err.response) {
        const errorDetails = err.response.data;
        toast.error(`Update failed: ${JSON.stringify(errorDetails)}`);
        
        if (errorDetails.details) {
          setValidationErrors(errorDetails.details);
        }
      } else {
        toast.error("Failed to update task");
      }
    }
  };
// const handleUpdateTask = async () => {
//     // if (!validateTask()) {
//     //   return;
//     // }
    
//     try {
//       const payload = {
//         ...taskToUpdate,
//         project: projectId,
//         assigned_to: taskToUpdate.assigned_to ? taskToUpdate.assigned_to.id : null
//       };
  
//       const response = await axiosInstance.put(`tasks/${taskToUpdate.id}/`, payload);
      
//       // Update the task list with new data
//       setTasks((prevTasks) =>
//         prevTasks.map((task) => (task.id === response.data.id ? response.data : task))
//       );


//       toast.success("Task updated successfully");
//       setIsTaskUpdateModalOpen(false);
//       setTaskToUpdate(null);
//     } catch (err) {
//       console.error('Update error:', err.response ? err.response.data : err);
      
//       // More detailed error handling
//       if (err.response) {
//         const errorDetails = err.response.data;
//         toast.error(`Update failed: ${JSON.stringify(errorDetails)}`);
        
//         // If there are validation errors, set them
//         if (errorDetails.details) {
//           setValidationErrors(errorDetails.details);
//         }
//       } else {
//         toast.error("Failed to update task");
//       }
//     }
//   };
  // Delete Task
  const handleDeleteTask = async () => {
    try {
      await axiosInstance.delete(`tasks/${selectedTask.id}/`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== selectedTask.id));
      toast.success("Task deleted successfully");
      setIsDeleteTaskModalOpen(false); // Close delete modal
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  // Open Update Project Modal
  const openProjectUpdateModal = () => {
    setProject({ ...project }); // Set project state to enable editing in modal
    setIsProjectModalOpen(true);
  };


// const openTaskUpdateModal = (task) => {
//     setTaskToUpdate({
//         ...task,
//         // Ensure assigned_to is handled correctly
//         assigned_to: task.assigned_to ? 
//           { id: task.assigned_to.id, username: task.assigned_to.username } : 
//           null
//       });
      
//       // Open the update modal
//       setIsTaskUpdateModalOpen(true);
    
//   };
const openTaskUpdateModal = (task) => {
    setTaskToUpdate({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assigned_to: task.assigned_to,
      start_date: task.start_date,
      due_date: task.due_date
    });
    setIsTaskUpdateModalOpen(true);
  };

  useEffect(() => {
    console.log('Current taskToUpdate:', taskToUpdate);
  }, [taskToUpdate]);
  // Open Delete Task Modal
  const openDeleteTaskModal = (task) => {
    setSelectedTask(task);
    setIsDeleteTaskModalOpen(true);
  };

  // Validate Task Creation
  const validateTask = () => {
    const errors = {};
    const today = new Date().toISOString().split('T')[0];

    // Validate title
    if (!newTask.title.trim()) {
      errors.title = 'Task title is required';
    }

    // Validate start date
    if (newTask.start_date < today) {
      errors.start_date = 'Start date cannot be in the past';
    }

    // Validate due date
    if (newTask.start_date && newTask.due_date) {
      if (new Date(newTask.due_date) <= new Date(newTask.start_date)) {
        errors.due_date = 'Due date must be after start date';
      }
    }

    // Validate project date constraints
    if (project) {
      const projectStartDate = new Date(project.start_date).toISOString().split('T')[0];
      const projectEndDate = new Date(project.end_date).toISOString().split('T')[0];

      if (newTask.start_date < projectStartDate || newTask.start_date > projectEndDate) {
        errors.start_date = `Start date must be between ${projectStartDate} and ${projectEndDate}`;
      }

      if (newTask.due_date < projectStartDate || newTask.due_date > projectEndDate) {
        errors.due_date = `Due date must be between ${projectStartDate} and ${projectEndDate}`;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create New Task
  const handleCreateTask = async () => {
    // Validate task before submission
    if (!validateTask()) {
      return;
    }

    try {
      const taskPayload = {
        ...newTask,
        project: projectId,
        // Ensure only ID is sent for related fields
        assigned_to: newTask.assigned_to ? newTask.assigned_to.id : null
      };

      const response = await axiosInstance.post('tasks/', taskPayload);

      // Update tasks list
      setTasks([...tasks, response.data]);
      
      // Close modal and reset form
      setIsTaskModalOpen(false);
      setNewTask({
        title: '',
        description: '',
        status: 'to-do',
        priority: 'medium',
        assigned_to: null,
        start_date: '',
        due_date: ''
      });
      setValidationErrors({});
    }
 
   
    catch (err) {
        // Handle backend validation errors
        if (err.response && err.response.data.details) {
          // Specific backend validation errors
          console.log("Backend error details:", err.response.data.details);
          
          // If details is an object, convert to a string
          const errorMessage = typeof err.response.data.details === 'object'
            ? JSON.stringify(err.response.data.details)
            : err.response.data.details;
   
    
            setIsTaskModalOpen(false);
          toast.error((errorMessage));
        } else if (err.response && err.response.data) {
          // Fallback to general response data
          setIsTaskModalOpen(false);
          toast.error(err.response.data.error || 'Failed to create task');
        } else {
          // Generic error fallback
          setIsTaskModalOpen(false);
          toast.error(err.message || 'An unexpected error occurred');
        }
        
        console.error(err);
      }
  };

  // Render validation error
  const renderValidationError = (field) => {
    return validationErrors[field] ? (
      <Typography variant="small" color="red" className="mt-1">
        {validationErrors[field]}
      </Typography>
    ) : null;
  };
  

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
            <Button 
              color="green" 
              size="sm"
              onClick={() => setIsTaskModalOpen(true)}
            >
              Add Task
            </Button>
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
                  <Button onClick={() => openDeleteTaskModal(task)}>Delete</Button>
                
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Task Creation Modal */}
        {/* Confirm Delete Task Dialog */}
        <Dialog open={isDeleteTaskModalOpen} handler={() => setIsDeleteTaskModalOpen(false)}>
          <DialogHeader>Confirm Delete</DialogHeader>
          <DialogBody>
            <Typography>Are you sure you want to delete this task?</Typography>
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => setIsDeleteTaskModalOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteTask}>Delete</Button>
          </DialogFooter>
        </Dialog>
        <Dialog 
          open={isTaskModalOpen} 
          handler={() => setIsTaskModalOpen(!isTaskModalOpen)}
          className="bg-deep-orange-50"
          size="lg"
        >
          <DialogHeader>Create New Task</DialogHeader>
          <DialogBody divider>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <Input 
                    label="Task Title" 
                    value={newTask.title}
                    onChange={(e) => {
                      setNewTask({...newTask, title: e.target.value});
                   
                      if (validationErrors.title) {
                        const newErrors = {...validationErrors};
                        delete newErrors.title;
                        setValidationErrors(newErrors);
                      }
                    }}
                    error={!!validationErrors.title}
                  />
                  {renderValidationError('title')}
                </div>

                <Input 
                  label="Description" 
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  type="textarea"
                />

                <div>
                  <Select 
                    label="Assigned To"
                    value={newTask.assigned_to?.id}
                    onChange={(val) => {
                      const selectedUser = users.find(user => user.id === val);
                      setNewTask({...newTask, assigned_to: selectedUser});
                    }}
                  >
                    <Option value="">Unassigned</Option>
                    {users.map((user) => (
                      <Option key={user.id} value={user.id}>
                        {user.username}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <Select 
                  label="Status"
                  value={newTask.status}
                  onChange={(val) => setNewTask({...newTask, status: val})}
                >
                  <Option value="to-do">To Do</Option>
                  <Option value="in-progress">In Progress</Option>
                  <Option value="done">Done</Option>
                </Select>

                <Select 
                  label="Priority"
                  value={newTask.priority}
                  onChange={(val) => setNewTask({...newTask, priority: val})}
                >
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                </Select>

                <div>
                  <Input 
                    label="Start Date" 
                    type="date"
                    value={newTask.start_date}
                    onChange={(e) => {
                      setNewTask({...newTask, start_date: e.target.value});
                      // Clear start date error when changing
                      if (validationErrors.start_date) {
                        const newErrors = {...validationErrors};
                        delete newErrors.start_date;
                        setValidationErrors(newErrors);
                      }
                    }}
                    error={!!validationErrors.start_date}
                  />
                  {renderValidationError('start_date')}
                </div>

                <div>
                  <Input 
                    label="Due Date" 
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => {
                      setNewTask({...newTask, due_date: e.target.value});
                      // Clear due date error when changing
                      if (validationErrors.due_date) {
                        const newErrors = {...validationErrors};
                        delete newErrors.due_date;
                        setValidationErrors(newErrors);
                      }
                    }}
                    error={!!validationErrors.due_date}
                  />
                  {renderValidationError('due_date')}
                </div>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button 
              variant="text" 
              color="red"
              onClick={() => {
                setIsTaskModalOpen(false);
                setValidationErrors({});
              }}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button 
              color="green" 
              onClick={handleCreateTask}
            >
              Create Task
            </Button>
          </DialogFooter>
        </Dialog>
       
         <Dialog
        open={isTaskUpdateModalOpen}
        handler={() => setIsTaskUpdateModalOpen(!isTaskUpdateModalOpen)}
        className="bg-deep-orange-50"
        size="lg"
      >
        <DialogHeader>Update Task</DialogHeader>
        <DialogBody divider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Input
                  label="Task Title"
                  value={taskToUpdate.title}
                  onChange={(e) => {
                    setTaskToUpdate({ ...taskToUpdate, title: e.target.value });
                    if (validationErrors.title) {
                      const newErrors = { ...validationErrors };
                      delete newErrors.title;
                      setValidationErrors(newErrors);
                    }
                  }}
                  error={!!validationErrors.title}
                />
                {renderValidationError('title')}
              </div>

              <Input
                label="Description"
                value={taskToUpdate.description}
                onChange={(e) => setTaskToUpdate({ ...taskToUpdate, description: e.target.value })}
                type="textarea"
              />

              <div>
                        <Select
            label="Assigned To"
            value={taskToUpdate.assigned_to?.id || ''}
            onChange={(val) => {
                const selectedUser = users.find(user => user.id === val);
                setTaskToUpdate(prev => ({ 
                ...prev, 
                assigned_to: selectedUser 
                }));
            }}
            >
            <Option value="">Select</Option>
            {users.map((user) => (
                <Option key={user.id} value={user.id}>
                {user.username}
                </Option>
            ))}
            </Select>
                {/* <Select
                  label="Assigned To"
                  value={taskToUpdate.assigned_to?.id}
                  onChange={(val) => {
                    const selectedUser = users.find(user => user.id === val);
                    setTaskToUpdate({ ...taskToUpdate, assigned_to: selectedUser });
                  }}
                >
                  <Option value="">Select</Option>
                  {users.map((user) => (
                    <Option key={user.id} value={user.id}>
                      {user.username}
                    </Option>
                  ))}
                </Select> */}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <Select
                label="Status"
                value={taskToUpdate.status}
                onChange={(val) => setTaskToUpdate({ ...taskToUpdate, status: val })}
              >
                <Option value="to-do">To Do</Option>
                <Option value="in-progress">In Progress</Option>
                <Option value="done">Done</Option>
              </Select>

              <Select
                label="Priority"
                value={taskToUpdate.priority}
                onChange={(val) => setTaskToUpdate({ ...taskToUpdate, priority: val })}
              >
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
              </Select>

              <div>
                <Input
                  label="Start Date"
                  type="date"
                  value={taskToUpdate.start_date}
                  onChange={(e) => {
                    setTaskToUpdate({ ...taskToUpdate, start_date: e.target.value });
                    if (validationErrors.start_date) {
                      const newErrors = { ...validationErrors };
                      delete newErrors.start_date;
                      setValidationErrors(newErrors);
                    }
                  }}
                  error={!!validationErrors.start_date}
                />
                {renderValidationError('start_date')}
              </div>

              <div>
                <Input
                  label="Due Date"
                  type="date"
                  value={taskToUpdate.due_date}
                  onChange={(e) => {
                    setTaskToUpdate({ ...taskToUpdate, due_date: e.target.value });
                    if (validationErrors.due_date) {
                      const newErrors = { ...validationErrors };
                      delete newErrors.due_date;
                      setValidationErrors(newErrors);
                    }
                  }}
                  error={!!validationErrors.due_date}
                />
                {renderValidationError('due_date')}
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => {
              setIsTaskUpdateModalOpen(false);
              setValidationErrors({});
            }}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleUpdateTask}
          >
            Update Task
          </Button>
        </DialogFooter>
      </Dialog>
      </div>
    </Layout>
  );
};

export default ProjectDetail;