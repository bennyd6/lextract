import './App.css'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/navbar'
import Home from './pages/home'
import Analyze from './pages/analyze';

function App() {

  return (
    <>
    <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<Analyze />} />

        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/chat" element={<Chatbot />} /> */}
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </>
  )
}

export default App
