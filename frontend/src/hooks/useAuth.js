import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import apiClient from '../api';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await apiClient.getCurrentUser();
                    setUser(response.user);
                } catch (error) {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = (userData) => {
        setUser(userData);
        toast({
            title: 'Login successful!',
            description: 'Welcome to Workspace Manager',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast({
            title: 'Logged out',
            description: 'You have been successfully logged out',
            status: 'info',
            duration: 3000,
            isClosable: true,
        });
    };

    const showMessage = (message, type = 'success') => {
        toast({
            title: type === 'error' ? 'Error' : 'Success',
            description: message,
            status: type === 'error' ? 'error' : 'success',
            duration: 5000,
            isClosable: true,
        });
    };

    return {
        user,
        loading,
        login,
        logout,
        showMessage,
    };
};
