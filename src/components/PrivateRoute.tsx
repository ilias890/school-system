import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext.tsx";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <span className="loading loading-dots loading-lg flex item-center mx-auto"></span>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/" />;
};

export default PrivateRoute;
