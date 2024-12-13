import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Typography, 
  Button, 
  Select, 
  Option 
} from "@material-tailwind/react";
import axios from 'axios';
import { Layout } from '../Layout'; 
import { BASE_URL } from '../../config';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axiosInstance';
const UserProjects = () => {
  // State management
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [projectStatus, setProjectStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const user=useSelector(state=>state.auth)
//   const axiosInstance = axios.create({
//     baseURL: 'http://localhost:8000/',
//     withCredentials: true,
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//     }
//   });
  // Fetch projects
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`projects/`, {
        params: {
          page: currentPage,
          status: projectStatus,
          user_id: user.id // Backend should handle this filtering
        }
      });

      setProjects(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10)); // Assuming 10 items per page
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
  // Render project card
  const renderProjectCard = (project) => (
    <Card key={project.id} className="mb-4">
      {/* <CardHeader 
        color="blue-gray" 
        className="relative h-56" */}
        {/* // Optionally add project image
      > */}
        {/* <img 
          src={project.image_url || '/default-project-image.png'} 
          alt={project.title} 
          className="h-full w-full object-cover"
        /> */}
      {/* <Typography variant="h5" color="bule-gray" className="mb-2">
          {project.title}
        </Typography>  
      </CardHeader> */}

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

        {/* Status Filter */}
        <div className="mb-4">
          <Select 
            label="Filter by Status"
            value={projectStatus}
            onChange={(val) => setProjectStatus(val)}
          >
            <Option value="">All Projects</Option>
            <Option value="planned">Planned</Option>
            <Option value="active">Active</Option>
            <Option value="completed">Completed</Option>
          </Select>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <Typography>Loading projects...</Typography>
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

export default UserProjects;