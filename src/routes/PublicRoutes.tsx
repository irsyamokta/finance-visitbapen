import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "../components/ui/spinner/Spinner";

const PublicRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <Spinner />;

    if (user) {
        return <Navigate to={"/dashboard"} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;