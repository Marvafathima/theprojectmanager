import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
export const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated} = useSelector(state => state.auth);
  const userRole = useSelector((state) => state.auth.user?.role);
 console.log("this is the user role",userRole)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.includes(userRole)) {
    return children;
  } 
  else {
    return <Navigate to="/unauthorized" replace />;
  }
};
