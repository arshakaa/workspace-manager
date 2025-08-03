import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthForm from '../components/AuthForm';
import Layout from '../components/Layout';

const SignupPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const handleSignup = (userData) => {
        login(userData);
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
    };

    const handleSwitchMode = (mode) => {
        if (mode === 'login') {
            navigate('/login', { state: { from: location.state?.from } });
        }
    };

    return (
        <Layout>
            <AuthForm
                currentPage="signup"
                onSwitchMode={handleSwitchMode}
                onLogin={handleSignup}
            />
        </Layout>
    );
};

export default SignupPage;
