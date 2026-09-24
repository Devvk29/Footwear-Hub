import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '../components/admin/AdminDashboard';

export const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '92vh', background: '#F3F4F6' }}>
      <AdminDashboard
        isOpen={true}
        onClose={() => navigate('/')}
      />
    </div>
  );
};

export default AdminPage;
