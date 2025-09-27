import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/ui/spinner/Spinner";

interface PrivateRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: PrivateRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Spinner />;
    }

    if (!user || !['finance_batik', 'finance_tourism'].includes(user.role)) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;