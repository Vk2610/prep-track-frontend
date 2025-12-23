import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen gradient-mesh-bg flex items-center justify-center">
                <LoadingSpinner message="Authenticating..." />
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
