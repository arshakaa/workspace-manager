import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';
import Header from './Header';
import { useAuth } from '../hooks/useAuth';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box
            minH="100vh"
            bg="gray.50">
            <Header
                user={user}
                onLogout={handleLogout}
            />
            <Container
                maxW="container.xl"
                py={8}>
                {children}
            </Container>
        </Box>
    );
};

export default Layout;
