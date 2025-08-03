import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import apiClient from '../api';

export const useWorkspaces = () => {
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();

    const fetchWorkspaces = async () => {
        try {
            setLoading(true);
            const response = await apiClient.getWorkspaces();
            setWorkspaces(response.workspaces || []);
            setError(null);
        } catch (error) {
            setError(error.message || 'Failed to fetch workspaces');
        } finally {
            setLoading(false);
        }
    };

    const createWorkspace = async (name, slug) => {
        try {
            await apiClient.createWorkspace(name, slug);
            await fetchWorkspaces();
            toast({
                title: 'Workspace created!',
                description: 'Your workspace has been created successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create workspace',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            throw error;
        }
    };

    const updateWorkspace = async (id, name, slug) => {
        try {
            await apiClient.updateWorkspace(id, name, slug);
            await fetchWorkspaces();
            toast({
                title: 'Workspace updated!',
                description: 'Your workspace has been updated successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update workspace',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            throw error;
        }
    };

    const deleteWorkspace = async (id) => {
        try {
            await apiClient.deleteWorkspace(id);
            await fetchWorkspaces();
            toast({
                title: 'Workspace deleted!',
                description: 'Your workspace has been deleted successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete workspace',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            throw error;
        }
    };

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    return {
        workspaces,
        loading,
        error,
        createWorkspace,
        updateWorkspace,
        deleteWorkspace,
        refreshWorkspaces: fetchWorkspaces,
    };
};
