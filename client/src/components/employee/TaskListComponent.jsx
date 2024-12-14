import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  Typography, 
  Button, 
  Input, 
  Select, 
  Option ,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter
} from "@material-tailwind/react";
import Layout from '../Layout';
import { EyeIcon } from "@heroicons/react/24/solid";
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import TaskDetailComponent from './TaskDetailComponent';

const TaskListComponent = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assigned_to: '',
    search: ''
  });

// Task Detail Modal State
const [selectedTask, setSelectedTask] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get('mytasks/');
      setTasks(response.data);
      setFilteredTasks(response.data);
      setTotalPages(Math.ceil(response.data.length / 10)); // 10 items per page
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let result = tasks;

    if (filters.status) {
      result = result.filter(task => task.status === filters.status);
    }

    if (filters.priority) {
      result = result.filter(task => task.priority === filters.priority);
    }

    if (filters.assigned_to) {
      result = result.filter(task => 
        task.assigned_to.username === filters.assigned_to
      );
    }

    if (filters.search) {
      result = result.filter(task => 
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.project.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredTasks(result);
    setTotalPages(Math.ceil(result.length / 10));
    setPage(1);
  };

  // Pagination
  const paginatedTasks = filteredTasks.slice(
    (page - 1) * 10, 
    page * 10
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
    // Navigate to task detail or open modal
    // navigate(`/task/${taskId}`)
    // console.log('View task:', taskId);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };
  return (
  <Layout>
    <Card className="h-full w-full p-4">
      <div className="mb-4 flex flex-col md:flex-row gap-3">
        <Input 
          label="Search Tasks" 
          value={filters.search}
          onChange={(e) => setFilters(prev => ({
            ...prev, 
            search: e.target.value
          }))}
        />
        <Select 
          label="Status" 
          value={filters.status}
          onChange={(val) => setFilters(prev => ({
            ...prev, 
            status: val
          }))}
        >
          <Option value="">All Statuses</Option>
          <Option value="to-do">To Do</Option>
          <Option value="in-progress">In Progress</Option>
          <Option value="done">Done</Option>
        </Select>
        <Select 
          label="Priority" 
          value={filters.priority}
          onChange={(val) => setFilters(prev => ({
            ...prev, 
            priority: val
          }))}
        >
          <Option value="">All Priorities</Option>
          <Option value="low">Low</Option>
          <Option value="medium">Medium</Option>
          <Option value="high">High</Option>
        </Select>
      </div>

      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {['Task Title', 'Project', 'Start Date', 'End Date', 'Created By', 'Status', 'Priority', 'Actions'].map((head) => (
              <th key={head} className="border-b border-blue-gray-100 p-4">
                <Typography variant="small" className="font-normal leading-none opacity-70">
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedTasks.map((task) => (
            <tr key={task.id} className="even:bg-blue-gray-50/50">
              <td className="p-4">{task.title}</td>
              <td className="p-4">{task.project.title}</td>
              <td className="p-4">{task.start_date}</td>
              <td className="p-4">{task.due_date}</td>
              <td className="p-4">{task.created_by.username}</td>
              <td className="p-4">{task.status}</td>
              <td className="p-4">{task.priority}</td>
              <td className="p-4">
                <Button 
                  variant="text" 
                  color="blue" 
                  onClick={() => handleViewTask(task)}
                >
                  <EyeIcon className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Button 
          variant="text" 
          color="blue-gray" 
          disabled={page === 1}
          onClick={() => setPage(prev => Math.max(1, prev - 1))}
        >
          Previous
        </Button>
        <Typography color="gray" className="font-normal">
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </Typography>
        <Button 
          variant="text" 
          color="blue-gray" 
          disabled={page === totalPages}
          onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
        >
          Next
        </Button>
      </div>
    </Card>
     {/* Task Detail Modal */}
     <Dialog 
        open={isModalOpen} 
        handler={handleCloseModal}
        size="lg"
        className="min-w-[80%]"
      >
        <DialogHeader>Task Details</DialogHeader>
        <DialogBody divider>
          {selectedTask && (
            <TaskDetailComponent taskId={selectedTask.id} />
          )}
        </DialogBody>
        <DialogFooter>
          <Button 
            variant="text" 
            color="red" 
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    
    </Layout>
  );
};

export default TaskListComponent;