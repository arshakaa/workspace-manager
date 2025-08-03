import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthForm from '../components/AuthForm';
import Layout from '../components/Layout';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const handleLogin = (userData) => {
        login(userData);
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
    };

    const handleSwitchMode = (mode) => {
        if (mode === 'signup') {
            navigate('/signup', { state: { from: location.state?.from } });
        }
    };

    return (
        <Layout>
            <AuthForm
                currentPage="login"
                onSwitchMode={handleSwitchMode}
                onLogin={handleLogin}
            />
        </Layout>
    );
};

export default LoginPage;
