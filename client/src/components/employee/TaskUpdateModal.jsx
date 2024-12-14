import React, { useState,useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,Spinner
} from "@material-tailwind/react";
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance'; 

const TaskUpdateModal = ({ 
  task, 
//   taskId, 
  isOpen, 
  onClose, 
  onTaskUpdate
//   fetchTaskDetails 
}) => {
  const [taskStatus, setTaskStatus] = useState(task.status);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const STATUS_OPTIONS = [
    { value: 'to-do', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
  ];

  const handleUpdateTask = async () => {
    setLoading(true); 
    try {
      
      const response=await axiosInstance.patch(`tasks/${task.id}/`, { status: taskStatus });
     
      toast.success("Task status updated successfully");
      onTaskUpdate(response.data);
      onClose();
    //   fetchTaskDetails(taskId);
    } catch (err) {

     onClose(); 
    if(err.response.status===403){
        toast.error("Forbidden to edit tasks which are not assigned to you");
    }
    else{
      toast.error(`Failed to update task status:${err}`);
      console.error(err);
    }}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTaskStatus(task.status);
  }, [task]);
  if (loading) {
    <div className="flex justify-center items-center h-full">
        <Spinner className="h-12 w-12" />
      </div>
  }
  return (
    <Dialog 
      open={isOpen} 
      handler={onClose}
      className="p-4 bg-deep-orange-50"
      size="lg"
    >
      <DialogHeader className="text-2xl font-bold mb-4">
        Update Task Status
      </DialogHeader>
      
      <DialogBody divider className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="bg-gray-100 p-3 rounded">
              <p className="text-sm text-gray-600">Task Title</p>
              <p className="font-medium">{task.title}</p>
            </div>

            <div className="bg-gray-100 p-3 rounded">
              <p className="text-sm text-gray-600">Description</p>
              <p className="font-medium">{task.description || 'No description'}</p>
            </div>

            <div className="bg-gray-100 p-3 rounded">
              <p className="text-sm text-gray-600">Assigned To</p>
              <p className="font-medium">
                {task.assigned_to?.username || 'Unassigned'}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="bg-gray-100 p-3 rounded">
              <p className="text-sm text-gray-600">Start Date</p>
              <p className="font-medium">{task.start_date || 'Not set'}</p>
            </div>

            <div className="bg-gray-100 p-3 rounded">
              <p className="text-sm text-gray-600">Due Date</p>
              <p className="font-medium">{task.due_date || 'Not set'}</p>
            </div>

            <Select
              label="Status"
              value={taskStatus}
              onChange={(val) => setTaskStatus(val)}
            >
              {STATUS_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </DialogBody>
      
      <DialogFooter className="space-x-4">
        <Button 
          variant="text" 
          color="red" 
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          color="green" 
          onClick={handleUpdateTask}
        >
          Update Status
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default TaskUpdateModal;