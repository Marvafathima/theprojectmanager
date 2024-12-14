import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Typography, 
  Button, 
  Select, 
  Option ,Spinner,
  Checkbox
} from "@material-tailwind/react";
import axios from 'axios';
import { Layout } from '../Layout'; 
import { BASE_URL } from '../../config';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const ProjectListPage = () => {
  // State management
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [projectStatus, setProjectStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const user=useSelector(state=>state.auth)
  const navigate=useNavigate();
  // New state for bulk selection
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`projects/`, {
        params: {
          page: currentPage,
          status: projectStatus,
          user_id: user.id 
        }
      });

      setProjects(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10)); 
      setError(null);
    } catch (err) {
      setError('Failed to fetch projects');
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect for fetching projects
  useEffect(() => {
    fetchProjects();
  }, [currentPage, projectStatus, user.id]);

// Bulk delete handler
const handleBulkDelete = async () => {
  if (selectedProjects.length === 0) return;

  try {
    setIsLoading(true);
    console.log("project id to be deleted",selectedProjects)
    await axiosInstance.post('projects/bulk-delete/', {
      data: { project_ids: selectedProjects }
    });

    // Refresh projects after deletion
    await fetchProjects();
    
    // Reset selection
    setSelectedProjects([]);
    setIsSelectMode(false);
  } catch (err) {
    // setError('Failed to delete projects');
    toast.error("Failed to delete projects")
  } finally {
    setIsLoading(false);
  }
};

// Toggle project selection
const toggleProjectSelection = (projectId) => {
  setSelectedProjects(prev => 
    prev.includes(projectId)
      ? prev.filter(id => id !== projectId)
      : [...prev, projectId]
  );
};

// Select all projects
const toggleSelectAll = () => {
  if (selectedProjects.length === projects.length) {
    setSelectedProjects([]);
  } else {
    setSelectedProjects(projects.map(project => project.id));
  }
};

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleViewDetails = (projectId) => {
    console.log("projectid:",projectId)
    navigate(`/projects/${projectId}`); // Navigate to the project detail page
  };

 
  const renderProjectCard = (project) => (
  
<Card 
  key={project.id} 
  className={`mb-4 mt-3 relative ${selectedProjects.includes(project.id) ? 'bg-blue-50' : ''}`}
>
  {isSelectMode && (
    <div className="absolute top-2 right-2 z-10">
      <Checkbox
        checked={selectedProjects.includes(project.id)}
        onChange={() => toggleProjectSelection(project.id)}
        containerProps={{
          className: 'inline-block'
        }}
      />
    </div>
  )}
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          {project.title}
        </Typography>
        <Typography variant="h5" color="blue-gray" className="mb-2">
        {formatDate(project.created_at)}
        </Typography>
        <Typography variant="h5" color="blue-gray" className="mb-2">
          {project.name}
        </Typography>

        <Typography color="gray" className="mb-2">
          Status: {project.status}
        </Typography>
        <Typography color="gray" className="mb-4">
          {project.description}
        </Typography>
        <Button variant="outlined" color="blue-gray"
        className='border-deep-orange-500 text-deep-orange-500'
        onClick={()=>handleViewDetails(project.id)}
        >
          View Details
        </Button>
      </CardBody>
    </Card>
  );

  // Main render
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Typography variant="h3" className="mb-6">
          User Projects
        </Typography>
{/* Bulk Actions */}
<div className="flex flex-col space-y-4">
  {/* Status Filter */}
  <div className="flex justify-between items-center">
    <Select 
      label="Filter by Status"
      value={projectStatus}
      onChange={(val) => setProjectStatus(val)}
      className="w-full sm:w-64"
    >
      <Option value="">All Projects</Option>
      <Option value="planned">Planned</Option>
      <Option value="active">Active</Option>
      <Option value="completed">Completed</Option>
    </Select>
  </div>

  {/* Project Selection Actions */}
  {isSelectMode && (
    <div className="flex flex-wrap items-center space-x-2 space-y-2 mb-4">
      <Checkbox 
        label="Select All"
        checked={selectedProjects.length === projects.length}
        onChange={toggleSelectAll}
        containerProps={{
          className: 'w-full sm:w-auto'
        }}
      />
      <Button 
        variant="outlined" 
        color="red"
        onClick={() => setIsSelectMode(false)}
        className="w-full sm:w-auto mb-4"
      >
        Cancel
      </Button>
      <Button 
        variant="filled" 
        color="red"
        disabled={selectedProjects.length === 0}
        onClick={handleBulkDelete}
        className="w-full sm:w-auto mb-4"
      >
        Delete Selected ({selectedProjects.length})
      </Button>
    </div>
  )}

  {/* Default Select Projects Button */}
  {!isSelectMode && (
    <div>
      <Button 
        variant="outlined" 
        color="blue-gray"
        onClick={() => setIsSelectMode(true)}
        className="w-full sm:w-auto"
      >
        Select Projects
      </Button>
    </div>
  )}
</div>

        {/* Projects Grid */}
        {isLoading ? (
            <div className="flex items-center justify-center h-screen">
            <Spinner className="h-16 w-16 text-deep_orange-500" />
          </div>
        ) : error ? (
          <Typography color="red">{error}</Typography>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(renderProjectCard)}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-4">
          <Button 
            variant="outlined" 
            color="blue-gray"  
            className='border-green-500 text-green-500'
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Typography className="self-center">
            Page {currentPage} of {totalPages}
          </Typography>
          <Button 
            variant="outlined" 
            className='border-green-500 text-green-500'
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectListPage;