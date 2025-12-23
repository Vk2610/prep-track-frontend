import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user profile from API if token exists
        const fetchUser = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    const response = await authAPI.getProfile();
                    const userData = response.data.user;
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = (updatedData) => {
        const newUserData = { ...user, ...updatedData };
        setUser(newUserData);
        localStorage.setItem('user', JSON.stringify(newUserData));
    };

    const value = {
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
