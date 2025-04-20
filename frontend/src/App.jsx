import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/home';
import Signup from './pages/signup';
import Login from './pages/login';
// import About from './about';
import Analyze from './pages/analyze';
import './App.css'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {!isAuthPage && <Navbar />}

      <Routes>
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/analyze" element={<PrivateRoute><Analyze /></PrivateRoute>} />
        {/* <Route path="/chat" element={<PrivateRoute><Chatbot /></PrivateRoute>} /> */}
        {/* <Route path="/about" element={<PrivateRoute><About /></PrivateRoute>} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;
