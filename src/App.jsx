import React, { Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './pages/loading/Loading';
const Dashboard = React.lazy(() => import('@/layouts/Dashboard'));
const Auth = React.lazy(() => import('@/layouts/Auth'));
import { ToastContainer } from 'react-toastify';



const loadingMessage = (
  <div>
    <Loading/>
  </div>
);

function App() {
  const navigate = useNavigate();
  const [token, setToken] = useState(sessionStorage.getItem('token'));

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if (!storedToken) {
      navigate('/auth/sign-in');
    } else {
      setToken(storedToken);
    }
  }, [navigate]);
  return (
    <Suspense fallback={loadingMessage}>
      <Routes>
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      </Routes>
      <ToastContainer/>
   </Suspense>
  );
}

export default App;
