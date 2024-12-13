import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Select,
  Option
} from "@material-tailwind/react";
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance'; // Adjust import path as needed

const ProjectUpdateModal = ({ 
  project, 
  projectId, 
  isOpen, 
  onClose, 
  fetchProjectDetails 
}) => {
  const [editedProject, setEditedProject] = useState({
    title: project.title || '',
    description: project.description || '',
    start_date: project.start_date || new Date().toISOString().split('T')[0],
    end_date: project.end_date || '',
    status: project.status || 'planned'
  });

  const STATUS_CHOICES = [
    { value: 'planned', label: 'Planned' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (value) => {
    setEditedProject(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleUpdateProject = async () => {
    try {
      await axiosInstance.put(`projects/${projectId}/`, editedProject);
      toast.success("Project updated successfully");
      onClose(); // Close modal
      fetchProjectDetails(); // Refresh project details
    } catch (err) {
      toast.error("Failed to update project");
      console.error(err);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      handler={onClose}
      className="p-4"
    >
      <DialogHeader className="text-2xl font-bold mb-4">
        Update Project
      </DialogHeader>
      
      <DialogBody className="space-y-4">
        <Input
          label="Project Title"
          name="title"
          value={editedProject.title}
          onChange={handleInputChange}
          required
        />
        
        <Textarea
          label="Description"
          name="description"
          value={editedProject.description}
          onChange={handleInputChange}
          rows={4}
        />
        
        <div className="flex space-x-4">
          <Input
            type="date"
            label="Start Date"
            name="start_date"
            value={editedProject.start_date}
            onChange={handleInputChange}
            required
          />
          
          <Input
            type="date"
            label="End Date"
            name="end_date"
            value={editedProject.end_date || ''}
            onChange={handleInputChange}
          />
        </div>
        
        <Select
          label="Status"
          value={editedProject.status}
          onChange={handleStatusChange}
        >
          {STATUS_CHOICES.map((choice) => (
            <Option key={choice.value} value={choice.value}>
              {choice.label}
            </Option>
          ))}
        </Select>
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
          onClick={handleUpdateProject}
        >
          Update Project
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ProjectUpdateModal;