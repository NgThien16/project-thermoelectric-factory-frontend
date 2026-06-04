import { Navigate } from "react-router-dom";
import useAuth from "../../context/useAuth";

export default function RoleProtectedRoute({ children, allowedRoles = [] }) {

    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user) return <Navigate to="/login" replace />;


    const hasRole =
        (user.roles || []).some(role =>
            allowedRoles.includes(role)
        );

    if (!hasRole) return <Navigate to="/" replace />;

    return children;
}