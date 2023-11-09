import React, { Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './pages/loading/Loading';
const Dashboard = React.lazy(() => import('@/layouts/Dashboard'));
const Auth = React.lazy(() => import('@/layouts/Auth'));



const loadingMessage = (
  <div>
    <Loading/>
  </div>
);

function App() {
  const navigates = useNavigate();
  useEffect(() => {
    let token = sessionStorage.getItem('token');
    if (!token) {
      navigates('auth/sign-in');
    }
  }, [navigates]);
  return (
    <Suspense fallback={loadingMessage}>
      <Routes>
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      </Routes>
   </Suspense>
  );
}

export default App;
