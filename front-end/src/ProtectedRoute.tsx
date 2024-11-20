import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { user, loading } = useContext(UserContext);
  console.log("User:", user); // Debugging: Log user data
  if (loading) {
    // Return null while user is being authenticated
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/" replace />;
  }

  // Render the protected component if user is authenticated
  return element;
};

export default ProtectedRoute;
