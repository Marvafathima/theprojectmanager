// import React, { useState } from 'react';
// import { 
//   Card, 
//   CardHeader, 
//   CardBody, 
//   Typography, 
//   Button, 
//   Chip,
//   Dialog,
//   DialogHeader,
//   DialogBody,
//   DialogFooter,
//   Input,
//   Select,
//   Option
// } from "@material-tailwind/react";
// import { 
//   PlusIcon, 
//   FolderIcon, 
//   ClipboardListIcon, 
//   UsersIcon 
// } from "lucide-react";
// import Layout from '../Layout';
// const ManagerDashboard = () => {
//   const [projects, setProjects] = useState([
//     {
//       id: 1,
//       title: "E-commerce Platform",
//       description: "Building a comprehensive online shopping solution",
//       startDate: "2024-01-15",
//       endDate: "2024-06-30",
//       status: "active",
//       tasks: [
//         { 
//           id: 1, 
//           title: "Frontend Development", 
//           assignedTo: "John Doe", 
//           status: "in-progress", 
//           priority: "high" 
//         },
//         { 
//           id: 2, 
//           title: "Payment Integration", 
//           assignedTo: "Jane Smith", 
//           status: "to-do", 
//           priority: "medium" 
//         }
//       ]
//     },
//     {
//       id: 2,
//       title: "Internal HR System",
//       description: "Developing a comprehensive HR management platform",
//       startDate: "2024-02-01",
//       endDate: "2024-07-15",
//       status: "planned",
//       tasks: []
//     }
//   ]);

//   const [openProjectModal, setOpenProjectModal] = useState(false);
//   const [openTaskModal, setOpenTaskModal] = useState(false);
//   const [selectedProject, setSelectedProject] = useState(null);

//   const handleOpenProjectModal = () => setOpenProjectModal(!openProjectModal);
//   const handleOpenTaskModal = (project) => {
//     setSelectedProject(project);
//     setOpenTaskModal(!openTaskModal);
//   };

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'active': return 'ocean_green.100';
//       case 'planned': return 'orange.100';
//       case 'completed': return 'deep_green';
//       default: return 'ash';
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch(priority) {
//       case 'high': return 'deep_orange.500';
//       case 'medium': return 'orange.100';
//       case 'low': return 'green.200';
//       default: return 'ash';
//     }
//   };

//   return (
//     <Layout>
//     {/* <div className="p-4 bg-ash min-h-screen">
//       <div className="container mx-auto"> */}
//         <Typography variant="h4" color="blue-gray" className="mb-6">
//           Manager Dashboard
//         </Typography>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           {[
//             { icon: FolderIcon, title: "Total Projects", value: projects.length, color: "ocean_green.50" },
//             { icon: ClipboardListIcon, title: "Active Projects", value: projects.filter(p => p.status === 'active').length, color: "green.500" },
//             { icon: UsersIcon, title: "Tasks Pending", value: projects.reduce((acc, proj) => acc + proj.tasks.filter(t => t.status !== 'done').length, 0), color: "deep_orange.400" }
//           ].map((stat, index) => (
//             <Card key={index} className="bg-white shadow-md">
//               <CardBody className="flex items-center space-x-4">
//                 <stat.icon className={`h-10 w-10 text-[${stat.color}]`} />
//                 <div>
//                   <Typography variant="h6" color="blue-gray">{stat.value}</Typography>
//                   <Typography variant="small" color="gray">{stat.title}</Typography>
//                 </div>
//               </CardBody>
//             </Card>
//           ))}
//         </div>

//         {/* Projects Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {projects.map((project) => (
//             <Card key={project.id} className="bg-white">
//               <CardHeader 
//                 color="transparent" 
//                 className={`bg-[${getStatusColor(project.status)}] text-white p-4 flex justify-between items-center`}
//               >
//                 <Typography variant="h5">{project.title}</Typography>
//                 <Chip 
//                   value={project.status} 
//                   color="white" 
//                   className="text-xs capitalize" 
//                 />
//               </CardHeader>
//               <CardBody>
//                 <Typography variant="small" color="gray" className="mb-2">
//                   {project.description}
//                 </Typography>
//                 <div className="flex justify-between text-xs mb-2">
//                   <span>Start: {project.startDate}</span>
//                   <span>End: {project.endDate}</span>
//                 </div>

//                 <div className="mt-4">
//                   <Typography variant="small" className="font-bold mb-2">
//                     Tasks ({project.tasks.length})
//                   </Typography>
//                   {project.tasks.map((task) => (
//                     <div 
//                       key={task.id} 
//                       className="flex justify-between items-center bg-ash p-2 rounded-md mb-2"
//                     >
//                       <div>
//                         <Typography variant="small">{task.title}</Typography>
//                         <Typography variant="small" color="gray">
//                           {task.assignedTo}
//                         </Typography>
//                       </div>
//                       <Chip 
//                         value={task.priority} 
//                         size="sm" 
//                         color={getPriorityColor(task.priority)} 
//                         className="capitalize text-xs" 
//                       />
//                     </div>
//                   ))}
//                 </div>

//                 <div className="flex space-x-2 mt-4">
//                   <Button 
//                     size="sm" 
//                     variant="outlined" 
//                     color="blue-gray"
//                     onClick={() => handleOpenTaskModal(project)}
//                   >
//                     Add Task
//                   </Button>
//                 </div>
//               </CardBody>
//             </Card>
//           ))}

//           {/* Add Project Button */}
//           <Card 
//             className="flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all"
//             onClick={handleOpenProjectModal}
//           >
//             <CardBody className="text-center">
//               <PlusIcon className="mx-auto mb-2 text-ocean_green.100" />
//               <Typography>Create New Project</Typography>
//             </CardBody>
//           </Card>
//         </div>

//         {/* Project Creation Modal */}
//         <Dialog open={openProjectModal} handler={handleOpenProjectModal}>
//           <DialogHeader>Create New Project</DialogHeader>
//           <DialogBody divider>
//             <div className="grid gap-4">
//               <Input label="Project Title" />
//               <Input label="Description" />
//               <Input type="date" label="Start Date" />
//               <Input type="date" label="End Date" />
//               <Select label="Status">
//                 <Option>Planned</Option>
//                 <Option>Active</Option>
//                 <Option>Completed</Option>
//               </Select>
//             </div>
//           </DialogBody>
//           <DialogFooter>
//             <Button 
//               variant="text" 
//               color="red" 
//               onClick={handleOpenProjectModal}
//             >
//               Cancel
//             </Button>
//             <Button 
//               color="green" 
//               onClick={handleOpenProjectModal}
//             >
//               Create Project
//             </Button>
//           </DialogFooter>
//         </Dialog>

//         {/* Task Creation Modal */}
//         <Dialog open={openTaskModal} handler={() => handleOpenTaskModal(null)}>
//           <DialogHeader>
//             Create Task for {selectedProject?.title}
//           </DialogHeader>
//           <DialogBody divider>
//             <div className="grid gap-4">
//               <Input label="Task Title" />
//               <Input label="Description" />
//               <Select label="Assigned To">
//                 <Option>John Doe</Option>
//                 <Option>Jane Smith</Option>
//               </Select>
//               <Select label="Status">
//                 <Option>To Do</Option>
//                 <Option>In Progress</Option>
//                 <Option>Done</Option>
//               </Select>
//               <Select label="Priority">
//                 <Option>Low</Option>
//                 <Option>Medium</Option>
//                 <Option>High</Option>
//               </Select>
//             </div>
//           </DialogBody>
//           <DialogFooter>
//             <Button 
//               variant="text" 
//               color="red" 
//               onClick={() => handleOpenTaskModal(null)}
//             >
//               Cancel
//             </Button>
//             <Button 
//               color="green" 
//               onClick={() => handleOpenTaskModal(null)}
//             >
//               Create Task
//             </Button>
//           </DialogFooter>
//         </Dialog>
//      </Layout>
//   );
// };

// export default ManagerDashboard;
import React, { useState } from 'react';
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

const ManagerDashboard = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "E-commerce Platform",
      description: "Building a comprehensive online shopping solution",
      startDate: "2024-01-15",
      endDate: "2024-06-30",
      status: "active",
      tasks: [
        { 
          id: 1, 
          title: "Frontend Development", 
          assignedTo: "John Doe", 
          status: "in-progress", 
          priority: "high" 
        },
        { 
          id: 2, 
          title: "Payment Integration", 
          assignedTo: "Jane Smith", 
          status: "to-do", 
          priority: "medium" 
        }
      ]
    },
    {
      id: 2,
      title: "Internal HR System",
      description: "Developing a comprehensive HR management platform",
      startDate: "2024-02-01",
      endDate: "2024-07-15",
      status: "planned",
      tasks: []
    }
  ]);

  const [openProjectModal, setOpenProjectModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpenProjectModal = () => setOpenProjectModal(!openProjectModal);
  const handleOpenTaskModal = (project) => {
    setSelectedProject(project);
    setOpenTaskModal(!openTaskModal);
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { 
              icon: FolderIcon, 
              title: "Total Projects", 
              value: projects.length, 
              color: "text-ocean_green-50",
              bgColor: "bg-ocean_green-50/20"
            },
            { 
              icon: ClipboardListIcon, 
              title: "Active Projects", 
              value: projects.filter(p => p.status === 'active').length, 
              color: "text-green-500",
              bgColor: "bg-green-500/20"
            },
            { 
              icon: UsersIcon, 
              title: "Tasks Pending", 
              value: projects.reduce((acc, proj) => acc + proj.tasks.filter(t => t.status !== 'done').length, 0), 
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
        <Dialog 
          open={openProjectModal} 
          handler={handleOpenProjectModal}
          className="max-w-lg mx-auto"
        >
          <DialogHeader className="text-blue-gray-800">Create New Project</DialogHeader>
          <DialogBody divider className="space-y-6">
            <Input 
              label="Project Title" 
              color="blue"
              className="mb-4"
            />
            <Input 
              label="Description" 
              color="blue"
              className="mb-4"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                type="date" 
                label="Start Date" 
                color="blue"
              />
              <Input 
                type="date" 
                label="End Date" 
                color="blue"
              />
            </div>
            <Select 
              label="Status" 
              color="blue"
              className="mt-4"
            >
              <Option>Planned</Option>
              <Option>Active</Option>
              <Option>Completed</Option>
            </Select>
          </DialogBody>
          <DialogFooter>
            <Button 
              variant="text" 
              color="red" 
              onClick={handleOpenProjectModal}
              className="mr-4"
            >
              Cancel
            </Button>
            <Button 
              color="green" 
              onClick={handleOpenProjectModal}
            >
              Create Project
            </Button>
          </DialogFooter>
        </Dialog>

        {/* Task Creation Modal */}
        <Dialog 
          open={openTaskModal} 
          handler={() => handleOpenTaskModal(null)}
          className="max-w-lg mx-auto"
        >
          <DialogHeader className="text-blue-gray-800">
            Create Task for {selectedProject?.title}
          </DialogHeader>
          <DialogBody divider className="space-y-6">
            <Input 
              label="Task Title" 
              color="blue"
              className="mb-4"
            />
            <Input 
              label="Description" 
              color="blue"
              className="mb-4"
            />
            <Select 
              label="Assigned To" 
              color="blue"
              className="mb-4"
            >
              <Option>John Doe</Option>
              <Option>Jane Smith</Option>
            </Select>
            <div className="grid grid-cols-2 gap-4">
              <Select 
                label="Status" 
                color="blue"
              >
                <Option>To Do</Option>
                <Option>In Progress</Option>
                <Option>Done</Option>
              </Select>
              <Select 
                label="Priority" 
                color="blue"
              >
                <Option>Low</Option>
                <Option>Medium</Option>
                <Option>High</Option>
              </Select>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button 
              variant="text" 
              color="red" 
              onClick={() => handleOpenTaskModal(null)}
              className="mr-4"
            >
              Cancel
            </Button>
            <Button 
              color="green" 
              onClick={() => handleOpenTaskModal(null)}
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