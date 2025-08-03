import React from 'react';
import { useAuth } from '../hooks/useAuth';
import WorkspaceList from '../components/WorkspaceList';
import Layout from '../components/Layout';

const DashboardPage = () => {
    const { user, showMessage } = useAuth();

    return (
        <Layout user={user}>
            <WorkspaceList
                user={user}
                showMessage={showMessage}
            />
        </Layout>
    );
};

export default DashboardPage;
