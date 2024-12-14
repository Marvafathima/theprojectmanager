import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Typography, 
  Chip,
  Spinner
} from "@material-tailwind/react";

import axiosInstance from '../../utils/axiosInstance';
import Layout from '../Layout';
const TaskDetailComponent = ({ taskId }) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaskDetail = async () => {
      // Reset states when a new taskId is passed
      setLoading(true);
      setError(null);
      setTask(null);

      try {
        // Ensure taskId is truthy before making the API call
        if (taskId) {
          const response = await axiosInstance.get(`tasks/${taskId}/`);
          setTask(response.data);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetail();
  }, [taskId]); 

  if (loading) {
    <div className="flex justify-center items-center h-full">
        <Spinner className="h-12 w-12" />
      </div>
  }

  if (error) {
    return <Typography color="red">Error loading task details</Typography>;
  }

  if (!task) {
    return <Typography>No task found</Typography>;
  }

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'to-do': return 'gray';
      case 'in-progress': return 'blue';
      case 'done': return 'green';
      default: return 'gray';
    }
  };

  // Priority color mapping
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'green';
      case 'medium': return 'orange';
      case 'high': return 'red';
      default: return 'gray';
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Typography variant="h5" color="blue-gray" className="mb-4">
          {task.title}
        </Typography>
        
        <div className="mb-4 flex gap-2">
          <Chip 
            value={task.status} 
            color={getStatusColor(task.status)} 
            variant="outlined" 
          />
          <Chip 
            value={task.priority} 
            color={getPriorityColor(task.priority)} 
            variant="outlined" 
          />
        </div>

        <Typography variant="h6" className="mt-4 mb-2">
          Description
        </Typography>
        <Typography variant="paragraph" color="gray">
          {task.description || 'No description provided'}
        </Typography>
      </div>

      <div>
        <Typography variant="h6">Task Details</Typography>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <DetailItem label="Start Date" value={task.start_date || 'Not set'} />
          <DetailItem label="Due Date" value={task.due_date || 'Not set'} />
          <DetailItem 
            label="Assigned To" 
            value={task.assigned_to?.username || 'Unassigned'} 
          />
          <DetailItem label="Created By" value={task.created_by.username} />
        </div>

        <Typography variant="h6" className="mt-4">Project Info</Typography>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <DetailItem label="Project" value={task.project.title} />
          <DetailItem label="Project Status" value={task.project.status} />
        </div>
      </div>
    </div>
  );
};

// Helper component for consistent detail item rendering
const DetailItem = ({ label, value }) => (
  <div>
    <Typography variant="small" color="gray" className="font-bold">
      {label}
    </Typography>
    <Typography>{value}</Typography>
  </div>
);

// Color mapping functions (you can move these outside if needed)
const getStatusColor = (status) => {
  switch (status) {
    case 'to-do': return 'gray';
    case 'in-progress': return 'blue';
    case 'done': return 'green';
    default: return 'gray';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'low': return 'green';
    case 'medium': return 'orange';
    case 'high': return 'red';
    default: return 'gray';
  }
  // return (
  //   <Layout>
  //   <Card className="w-full max-w-[48rem] flex-row">
  //     <CardHeader
  //       shadow={false}
  //       floated={false}
  //       className="m-0 w-2/5 shrink-0 rounded-r-none"
  //     >
  //       <div className="p-4">
  //         <Typography variant="h4" color="blue-gray">
  //           Task Details
  //         </Typography>
  //         <Typography variant="h6" color="gray" className="mt-2">
  //           {task.title}
  //         </Typography>
  //       </div>
  //     </CardHeader>
  //     <CardBody>
  //       <div className="mb-4 flex gap-4">
  //         <Chip 
  //           value={task.status} 
  //           color={getStatusColor(task.status)} 
  //           variant="outlined" 
  //         />
  //         <Chip 
  //           value={task.priority} 
  //           color={getPriorityColor(task.priority)} 
  //           variant="outlined" 
  //         />
  //       </div>

  //       <Typography variant="h6" color="blue-gray" className="mb-2">
  //         Project Details
  //       </Typography>
  //       <div className="mb-4 grid grid-cols-2 gap-4">
  //         <div>
  //           <Typography variant="small" color="gray">Project</Typography>
  //           <Typography>{task.project.title}</Typography>
  //         </div>
  //         <div>
  //           <Typography variant="small" color="gray">Project Status</Typography>
  //           <Typography>{task.project.status}</Typography>
  //         </div>
  //       </div>

  //       <Typography variant="h6" color="blue-gray" className="mb-2">
  //         Task Information
  //       </Typography>
  //       <div className="grid grid-cols-2 gap-4">
  //         <div>
  //           <Typography variant="small" color="gray">Start Date</Typography>
  //           <Typography>{task.start_date || 'Not set'}</Typography>
  //         </div>
  //         <div>
  //           <Typography variant="small" color="gray">Due Date</Typography>
  //           <Typography>{task.due_date || 'Not set'}</Typography>
  //         </div>
  //         <div>
  //           <Typography variant="small" color="gray">Assigned To</Typography>
  //           <Typography>{task.assigned_to?.username || 'Unassigned'}</Typography>
  //         </div>
  //         <div>
  //           <Typography variant="small" color="gray">Created By</Typography>
  //           <Typography>{task.created_by.username}</Typography>
  //         </div>
  //       </div>

  //       <Typography variant="h6" color="blue-gray" className="mt-4 mb-2">
  //         Description
  //       </Typography>
  //       <Typography variant="paragraph" color="gray">
  //         {task.description || 'No description provided'}
  //       </Typography>
  //     </CardBody>
  //   </Card></Layout>
  // );



};

export default TaskDetailComponent;