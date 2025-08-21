import { Navigate } from "react-router-dom";
export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token || (allowedRoles && !allowedRoles.includes(role))) {
    return <Navigate to="/login" />;
  }
  return children;
}
